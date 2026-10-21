"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { interiorStyles, type InteriorStyle } from "@/lib/ai-render/catalogPick";
import {
  budgetRanges,
  budgetTiers,
  getRecommendedProducts,
  sceneKey,
  type BudgetTier,
} from "@/lib/ai-render/designSets";
import type { PartnerProduct, RoomKind } from "@/lib/partner-store/catalog";
import { useProjectDestination } from "@/lib/partner-store/ProjectDestinationProvider";
import {
  MIX_VENDOR_ID,
  getActiveVendorName,
  getVendor,
} from "@/lib/partner-store/vendors";
import { VendorChipBar } from "@/components/layout/VendorSelect";
import { extractImageUrl } from "@/lib/ai-render/extractImageUrl";
import {
  defaultSelectedSlots,
  pieceOptionsForRoom,
  type PieceSlotId,
} from "@/lib/ai-render/furniturePieces";
import { DesignProductsSection } from "./DesignProductsSection";

type RoomType = RoomKind;

const roomLabels: Record<RoomType, string> = {
  living: "Sufragerie / Living",
  bedroom: "Dormitor",
  office: "Birou Acasă",
  kitchen: "Bucătărie / Dining",
};

export function AiRenderFlow() {
  const t = useTranslations("aiRender");
  const tCommerce = useTranslations("commerce");
  const locale = useLocale();
  const { catalog, vendorId, countryId } = useProjectDestination();
  const activeVendorName =
    vendorId === MIX_VENDOR_ID
      ? tCommerce("mixMatchShort")
      : getVendor(vendorId)?.brandName ??
        getActiveVendorName(vendorId, tCommerce("mixMatchShort"));
  const [isMounted, setIsMounted] = useState(false);
  const [roomType, setRoomType] = useState<RoomType>("bedroom");
  const [style, setStyle] = useState<InteriorStyle>("scandinavian");
  const [budget, setBudget] = useState<BudgetTier>("medium");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [renderedImageUrl, setRenderedImageUrl] = useState<string | null>(null);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [heroView, setHeroView] = useState<"ai" | "original">("ai");
  const [renderedProducts, setRenderedProducts] = useState<PartnerProduct[] | null>(
    null,
  );
  const [selectedSlots, setSelectedSlots] = useState<PieceSlotId[]>(() =>
    defaultSelectedSlots("bedroom"),
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const generationRef = useRef(0);
  const skipFilterRegenRef = useRef(true);

  const activeKey = sceneKey(roomType, style, budget, vendorId, countryId);
  const originalImage = uploadedImage ?? previewUrl;
  const previewProducts = useMemo(
    () =>
      getRecommendedProducts(
        roomType,
        style,
        budget,
        catalog,
        vendorId,
        selectedSlots,
      ),
    [roomType, style, budget, catalog, vendorId, selectedSlots],
  );
  const recommendedProducts = renderedProducts ?? previewProducts;
  const selectedStyleLabel = t(`styles.${style}`);
  const showResult = Boolean(renderedImageUrl) || busy;
  const heroSrc = (() => {
    if (heroView === "original" && originalImage) return originalImage;
    if (renderedImageUrl && !imageFailed) return renderedImageUrl;
    if (originalImage && !showResult) return originalImage;
    return "";
  })();

  useEffect(() => {
    setRenderedProducts(null);
  }, [roomType, style, budget, vendorId, selectedSlots]);

  useEffect(() => {
    setSelectedSlots(defaultSelectedSlots(roomType));
  }, [roomType]);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (previewUrlRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  async function measureImage(src: string) {
    return new Promise<{ width: number; height: number } | null>((resolve) => {
      const image = new window.Image();
      image.onload = () =>
        resolve({ width: image.naturalWidth, height: image.naturalHeight });
      image.onerror = () => resolve(null);
      image.src = src;
    });
  }

  async function toSendableImage(src: string) {
    if (!src.startsWith("blob:")) return src;
    const blob = await fetch(src).then((response) => response.blob());
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  }

  async function handleGenerate(event?: { preventDefault?: () => void }) {
    event?.preventDefault?.();
    if (!isMounted) return;

    const sourcePhoto = uploadedImage ?? previewUrl;
    if (!sourcePhoto) {
      setError("Încarcă mai întâi o poză a camerei tale.");
      return;
    }

    const requestId = ++generationRef.current;
    setError(null);
    setBusy(true);
    setHeroView("ai");
    setImageFailed(false);

    try {
      const productsForRender = recommendedProducts;
      const referenceImage = await toSendableImage(sourcePhoto);
      const frame = await measureImage(referenceImage);
      const response = await fetch("/api/ai-render/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "virtual-staging",
          imageUrl: referenceImage,
          image: referenceImage,
          controlnet_image: referenceImage,
          roomType,
          style,
          selectedStyle: style,
          budget,
          selectedBudget: budget,
          keepStructure: true,
          vendorName: activeVendorName,
          vendorId,
          selectedSlots,
          refreshToken: `${activeKey}:${Date.now()}`,
          imageWidth: frame?.width,
          imageHeight: frame?.height,
          products: productsForRender.map((product) => ({
            name: product.name,
            title: product.title || product.name,
            category: product.category,
            promptHint: product.promptHint,
            description: product.description || product.promptHint,
            vendorId: product.vendorId,
            image: product.image || product.imageUrl,
          })),
        }),
      });

      let data: unknown = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (requestId !== generationRef.current) return;

      const payload = data as {
        renderUrl?: unknown;
        imageUrl?: unknown;
        composedImageUrl?: unknown;
        output?: unknown;
        image?: unknown;
        url?: unknown;
        products?: PartnerProduct[];
        error?: string;
      };
      const imageFromApi =
        extractImageUrl(payload.renderUrl) ??
        extractImageUrl(payload.imageUrl) ??
        extractImageUrl(
          Array.isArray(payload.output) ? payload.output[0] : payload.output,
        ) ??
        extractImageUrl(payload.composedImageUrl) ??
        extractImageUrl(payload.image) ??
        extractImageUrl(payload.url);
      if (!imageFromApi) {
        const raw = typeof payload.error === "string" ? payload.error.trim() : "";
        const looksLikeJson =
          raw.startsWith("{") ||
          raw.includes("\"detail\"") ||
          raw.includes("401") ||
          /unauthoriz|unauthenticated/i.test(raw);
        setError(
          looksLikeJson
            ? "Cheia Replicate nu a fost configurată corect în Environment Variables."
            : raw ||
                "Nu am putut genera randarea acum. Încearcă din nou peste puțin timp.",
        );
        return;
      }
      setRenderedImageUrl(imageFromApi);
      if (Array.isArray(payload.products) && payload.products.length > 0) {
        setRenderedProducts(payload.products);
      }
      setHasGeneratedOnce(true);
      setImageFailed(false);
    } catch {
      if (requestId !== generationRef.current) return;
      setError("Randarea a eșuat. Verifică conexiunea și încearcă din nou.");
    } finally {
      if (requestId === generationRef.current) setBusy(false);
    }
  }

  useEffect(() => {
    if (!isMounted || !hasGeneratedOnce) return;
    if (skipFilterRegenRef.current) {
      skipFilterRegenRef.current = false;
      return;
    }
    const timer = window.setTimeout(() => {
      void handleGenerate();
    }, 450);
    return () => window.clearTimeout(timer);
    // Filter-driven regeneration: new vendor/style/budget/room/pieces must request a new image.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorId, style, budget, roomType, selectedSlots, hasGeneratedOnce, isMounted]);

  function revokePreview() {
    if (previewUrlRef.current?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    previewUrlRef.current = null;
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError(t("errorFile"));
      event.target.value = "";
      return;
    }
    setError(null);
    setImageFailed(false);
    revokePreview();
    const objectUrl = URL.createObjectURL(file);
    previewUrlRef.current = objectUrl;
    setPreviewUrl(objectUrl);
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(String(reader.result));
    };
    reader.onerror = () => {
      setError(t("errorFile"));
    };
    reader.readAsDataURL(file);
  }

  function clearUploadedPhoto() {
    revokePreview();
    setPreviewUrl(null);
    setUploadedImage(null);
    setFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function reset() {
    generationRef.current += 1;
    clearUploadedPhoto();
    setRenderedImageUrl(null);
    setHasGeneratedOnce(false);
    skipFilterRegenRef.current = true;
    setHeroView("ai");
    setBusy(false);
    setError(null);
    setImageFailed(false);
  }

  if (!isMounted) {
    return <div className="min-h-screen bg-neutral-950" />;
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-brass">
          {activeVendorName}
        </p>
        <h1 className="mt-3 font-serif text-5xl text-linen">
          {`Virtual Staging ${activeVendorName}`}
        </h1>
        <p className="mt-4 max-w-2xl text-linen/65">
          {`Păstrăm forma, pereții și unghiul, înlocuim mobilierul vechi cu piese reale ${activeVendorName} și îți arătăm prețurile cu link de cumpărare.`}
        </p>
      </div>
      <VendorChipBar />
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-brass">
            {t("styleTitle")}
          </p>
          <p className="font-serif text-sm text-linen">{roomLabels[roomType]}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(Object.keys(roomLabels) as RoomType[]).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setRoomType(type)}
              className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                roomType === type
                  ? "bg-brass text-ink"
                  : "border border-white/15 text-linen/80 hover:border-brass/50"
              }`}
            >
              {roomLabels[type]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {interiorStyles.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setStyle(item)}
            className={`rounded-full px-4 py-2 text-sm ${
              style === item
                ? "bg-brass text-ink"
                : "border border-white/15 text-linen/75"
            }`}
          >
            {t(`styles.${item}`)}
          </button>
        ))}
      </div>

      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-brass">
          {t("budgetTitle")}
        </p>
        <div className="flex flex-wrap gap-2">
          {budgetTiers.map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => setBudget(tier)}
              className={`rounded-2xl px-4 py-2.5 text-left text-sm ${
                budget === tier
                  ? "bg-brass text-ink"
                  : "border border-white/15 text-linen/75"
              }`}
            >
              <span className="block font-medium">{budgetRanges[tier].label}</span>
              <span
                className={`mt-0.5 block text-[11px] ${
                  budget === tier ? "text-ink/70" : "text-linen/50"
                }`}
              >
                {budgetRanges[tier].hint}
              </span>
            </button>
          ))}
        </div>
      </div>

      {pieceOptionsForRoom(roomType).length > 0 ? (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-brass">
            Alege piesele dorite în cameră
          </p>
          <div className="flex flex-wrap gap-2">
            {pieceOptionsForRoom(roomType).map((option) => {
              const checked = selectedSlots.includes(option.id);
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-center gap-2 rounded-full px-4 py-2 text-sm ${
                    checked
                      ? "bg-brass text-ink"
                      : "border border-white/15 text-linen/75"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    className="accent-ink"
                    onChange={() => {
                      setSelectedSlots((current) => {
                        if (current.includes(option.id)) {
                          if (current.length <= 1) return current;
                          return current.filter((slot) => slot !== option.id);
                        }
                        return [...current, option.id];
                      });
                    }}
                  />
                  {option.label}
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {!showResult ? (
      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div>
          <p className="font-serif text-lg text-linen">{t("uploadTitle")}</p>
          <p className="mt-1 text-sm text-linen/70">
            {`Goală sau deja mobilată. Folosim poza ta ca referință de structură și restilăm mobilierul cu catalogul ${activeVendorName}.`}
          </p>
        </div>
        {originalImage ? (
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-ink/40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalImage}
              alt={fileName ?? "Fotografie încărcată"}
              className="h-40 w-full object-cover sm:h-48"
            />
            <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center justify-between gap-2 bg-black/55 px-3 py-2">
              <p className="truncate text-xs text-linen/80">
                {fileName ?? "Fotografie încărcată"}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full bg-brass px-3 py-1 text-[11px] font-medium text-ink"
                >
                  Înlocuiește fotografia
                </button>
                <button
                  type="button"
                  onClick={clearUploadedPhoto}
                  className="rounded-full border border-white/30 px-3 py-1 text-[11px] text-linen"
                >
                  Șterge
                </button>
              </div>
            </div>
          </div>
        ) : null}
        <label htmlFor="room-photo-upload" className="sr-only">
          {t("uploadCta")}
        </label>
        <input
          ref={fileInputRef}
          id="room-photo-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className={`block w-full cursor-pointer text-sm text-linen file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-brass file:px-5 file:py-2.5 file:text-sm file:font-medium file:text-ink ${
            originalImage ? "sr-only" : ""
          }`}
        />
      </div>
      ) : null}

      <form
        className="flex flex-wrap items-center justify-end gap-3"
        onSubmit={(event) => void handleGenerate(event)}
      >
        <button
          type="button"
          onClick={reset}
          className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-linen"
        >
          {locale === "ro" ? "Resetează / Încarcă o altă poză" : t("restart")}
        </button>
        <button
          type="submit"
          disabled={!isMounted || busy || !originalImage}
          className="rounded-full bg-brass px-8 py-3 text-sm font-medium text-ink disabled:opacity-40"
        >
          {busy ? "Se generează..." : "Randează camera"}
        </button>
      </form>

      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#1c1814]">
          {showResult && originalImage && !busy ? (
            <div className="absolute left-4 top-4 z-10 flex rounded-full border border-white/15 bg-black/65 p-1 text-xs">
              <button
                type="button"
                onClick={() => setHeroView("original")}
                className={`rounded-full px-3 py-1.5 ${
                  heroView === "original" ? "bg-brass text-ink" : "text-linen/80"
                }`}
              >
                Original
              </button>
              <button
                type="button"
                onClick={() => setHeroView("ai")}
                className={`rounded-full px-3 py-1.5 ${
                  heroView === "ai" ? "bg-brass text-ink" : "text-linen/80"
                }`}
              >
                Randare AI
              </button>
            </div>
          ) : null}
          {heroSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={heroSrc}
              src={heroSrc}
              alt=""
              onError={() => setImageFailed(true)}
              className="w-full max-h-[600px] rounded-xl bg-ink object-contain"
            />
          ) : (
            <div className="flex h-[360px] w-full items-center justify-center px-6 text-center text-linen/50">
              {imageFailed
                ? "Nu am putut afișa imaginea returnată de Replicate."
                : "Așteptăm randarea camerei"}
            </div>
          )}
          {busy ? (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-black/70 px-6 text-center">
              <span
                className="h-12 w-12 animate-spin rounded-full border-2 border-linen/20 border-t-brass"
                aria-hidden
              />
              <p className="max-w-md font-serif text-xl text-linen sm:text-2xl">
                {`Se generează noul design ${activeVendorName} în stil ${selectedStyleLabel}...`}
              </p>
            </div>
          ) : null}
        </section>

        <DesignProductsSection
          key={`${activeKey}:${recommendedProducts.map((product) => product.id).join("|")}`}
          products={recommendedProducts}
          locale={locale}
          vendorName={activeVendorName}
          selectedBudget={budget}
        />
      </div>
    </div>
  );
}
