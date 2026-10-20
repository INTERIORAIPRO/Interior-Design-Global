"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { interiorStyles, type InteriorStyle } from "@/lib/ai-render/catalogPick";
import {
  budgetRanges,
  budgetTiers,
  getDesignScene,
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
  const vendorName = activeVendorName;
  const [isMounted, setIsMounted] = useState(false);
  const [roomType, setRoomType] = useState<RoomType>("bedroom");
  const [style, setStyle] = useState<InteriorStyle>("scandinavian");
  const [budget, setBudget] = useState<BudgetTier>("medium");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [rendered, setRendered] = useState<{
    key: string;
    imageUrl: string;
    products: PartnerProduct[];
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const [heroView, setHeroView] = useState<"ai" | "original">("ai");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    return () => {
      if (previewUrlRef.current?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const design = useMemo(
    () => getDesignScene(roomType, style, budget, catalog, vendorId, countryId),
    [roomType, style, budget, catalog, vendorId, countryId],
  );
  const activeKey = sceneKey(roomType, style, budget, vendorId, countryId);
  const originalImage = uploadedImage ?? previewUrl;
  const hasAiResult = Boolean(rendered && rendered.key === activeKey);
  const heroImage =
    hasAiResult && rendered
      ? heroView === "original" && originalImage
        ? originalImage
        : rendered.imageUrl
      : originalImage ?? design.sceneUrl;
  const displayImage = imageFailed ? design.sceneUrl : heroImage;
  const renderedImageUrl =
    extractImageUrl(displayImage) ?? extractImageUrl(design.sceneUrl) ?? "";
  const recommendedProducts =
    hasAiResult && rendered?.products?.length
      ? rendered.products
      : design.products;

  useEffect(() => {
    setImageFailed(false);
  }, [heroImage]);

  useEffect(() => {
    setHeroView("ai");
  }, [rendered?.imageUrl, activeKey]);

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
    setRendered(null);
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

  function resetToUpload() {
    setRendered(null);
    setHeroView("ai");
    setBusy(false);
    setError(null);
    setImageFailed(false);
  }

  function reset() {
    clearUploadedPhoto();
    resetToUpload();
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

    setError(null);
    setBusy(true);

    try {
      const productsForRender = design.products;
      const referenceImage = uploadedImage
        ? await toSendableImage(uploadedImage)
        : await toSendableImage(design.sceneUrl);
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
          keepStructure: Boolean(uploadedImage),
          fallbackImageUrl: design.sceneUrl,
          vendorName: activeVendorName,
          products: productsForRender.map((product) => ({
            name: product.name,
            category: product.category,
            promptHint: product.promptHint,
          })),
        }),
      });

      let data: unknown = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      const payload = data as {
        composedImageUrl?: unknown;
        output?: unknown;
        image?: unknown;
        fallback?: boolean;
      };
      const imageFromApi = extractImageUrl(
        Array.isArray(payload.output) ? payload.output[0] : payload.output,
      ) ?? extractImageUrl(payload.composedImageUrl) ?? extractImageUrl(payload.image);
      const shouldFallback = !response.ok || payload.fallback || !imageFromApi;

      setRendered({
        key: activeKey,
        imageUrl: shouldFallback ? design.sceneUrl : imageFromApi,
        products: productsForRender,
      });
    } catch {
      setRendered({
        key: activeKey,
        imageUrl: design.sceneUrl,
        products: design.products,
      });
    } finally {
      setBusy(false);
    }
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
      {/* Selector Tip Cameră */}
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
              onClick={() => {
                setRoomType(type);
                setRendered(null);
              }}
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

      {/* Selector Stiluri */}
      <div className="flex flex-wrap gap-2">
        {interiorStyles.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setStyle(item);
              setRendered(null);
            }}
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

      {/* Selector Buget (Asigurat vizibil) */}
      <div>
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-brass">
          {t("budgetTitle")}
        </p>
        <div className="flex flex-wrap gap-2">
          {budgetTiers.map((tier) => (
            <button
              key={tier}
              type="button"
              onClick={() => {
                setBudget(tier);
                setRendered(null);
              }}
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

      {error ? (
        <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {!hasAiResult ? (
        <>
          <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div>
              <p className="font-serif text-lg text-linen">{t("uploadTitle")}</p>
              <p className="mt-1 text-sm text-linen/70">
                {`Goală sau deja mobilată. Folosim poza ta ca referință de structură și restilăm mobilierul cu catalogul ${vendorName}.`}
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
              disabled={!isMounted || busy}
              className="rounded-full bg-brass px-8 py-3 text-sm font-medium text-ink disabled:opacity-40"
            >
              {busy
                ? locale === "ro"
                  ? `AI-ul generează spațiul cu mobilier ${vendorName}...`
                  : t("generating", { vendor: vendorName })
                : locale === "ro"
                  ? "Randează camera"
                  : t("generate")}
            </button>
          </form>
        </>
      ) : null}

      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#1c1814]">
          {hasAiResult && originalImage && !busy ? (
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
          {renderedImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={renderedImageUrl}
              alt=""
              onError={() => setImageFailed(true)}
              className="w-full max-h-[600px] object-cover rounded-xl"
            />
          ) : null}
          {busy ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/55 px-6 text-center">
              <p className="max-w-md font-serif text-xl text-linen sm:text-2xl">
                {locale === "ro"
                  ? `AI-ul generează spațiul cu mobilier ${vendorName}...`
                  : t("generating", { vendor: vendorName })}
              </p>
            </div>
          ) : null}
        </section>

        {hasAiResult ? (
          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              type="button"
              onClick={resetToUpload}
              className="rounded-full border border-white/15 px-6 py-2.5 text-sm text-linen"
            >
              {locale === "ro"
                ? "Resetează / Încarcă o altă poză"
                : t("restart")}
            </button>
            <button
              type="button"
              onClick={() => void handleGenerate()}
              disabled={busy}
              className="rounded-full bg-brass px-8 py-3 text-sm font-medium text-ink disabled:opacity-40"
            >
              Randează camera
            </button>
          </div>
        ) : null}

        <DesignProductsSection
          key={activeKey}
          products={recommendedProducts}
          locale={locale}
          vendorName={activeVendorName}
          selectedBudget={budget}
        />
      </div>
    </div>
  );
}
