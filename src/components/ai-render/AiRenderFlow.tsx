"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { interiorStyles, type InteriorStyle } from "@/lib/ai-render/catalogPick";
import {
  budgetTiers,
  getDesignScene,
  sceneKey,
  type BudgetTier,
} from "@/lib/ai-render/designSets";
import type { RoomKind } from "@/lib/partner-store/catalog";
import { useProjectDestination } from "@/lib/partner-store/ProjectDestinationProvider";
import {
  MIX_VENDOR_ID,
  getActiveVendorName,
  getVendor,
} from "@/lib/partner-store/vendors";
import { VendorChipBar } from "@/components/layout/VendorSelect";
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
  const vendorName =
    vendorId === MIX_VENDOR_ID
      ? tCommerce("mixMatchShort")
      : getVendor(vendorId)?.brandName ??
        getActiveVendorName(vendorId, tCommerce("mixMatchShort"));
  const [isMounted, setIsMounted] = useState(false);
  const [roomType, setRoomType] = useState<RoomType>("bedroom");
  const [style, setStyle] = useState<InteriorStyle>("scandinavian");
  const [budget, setBudget] = useState<BudgetTier>("medium");
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [rendered, setRendered] = useState<{ key: string; imageUrl: string } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const design = useMemo(
    () => getDesignScene(roomType, style, budget, catalog, vendorId, countryId),
    [roomType, style, budget, catalog, vendorId, countryId],
  );
  const activeKey = sceneKey(roomType, style, budget, vendorId, countryId);
  const heroImage =
    rendered?.key === activeKey
      ? rendered.imageUrl
      : sourceImage ?? design.sceneUrl;
  const displayImage = imageFailed ? design.sceneUrl : heroImage;
  const displayProducts = design.products;

  useEffect(() => {
    setImageFailed(false);
  }, [heroImage]);

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
    const reader = new FileReader();
    reader.onload = () => {
      setSourceImage(String(reader.result));
    };
    reader.onerror = () => {
      setError(t("errorFile"));
    };
    reader.readAsDataURL(file);
  }

  function reset() {
    setSourceImage(null);
    setRendered(null);
    setBusy(false);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
      const imageUrl = await toSendableImage(sourceImage ?? design.sceneUrl);
      const response = await fetch("/api/ai-render/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "virtual-staging",
          imageUrl,
          roomType,
          style,
          keepStructure: Boolean(sourceImage),
          fallbackImageUrl: design.sceneUrl,
          products: displayProducts.map((product) => ({
            name: product.name,
            category: product.category,
            promptHint: product.promptHint,
          })),
        }),
      });

      let data: { composedImageUrl?: string; fallback?: boolean } = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      const imageFromApi =
        typeof data.composedImageUrl === "string" ? data.composedImageUrl : null;
      const shouldFallback = !response.ok || data.fallback || !imageFromApi;

      setRendered({
        key: activeKey,
        imageUrl: shouldFallback ? design.sceneUrl : imageFromApi,
      });
    } catch {
      setRendered({ key: activeKey, imageUrl: design.sceneUrl });
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
          {vendorName}
        </p>
        <h1 className="mt-3 font-serif text-5xl text-linen">
          Virtual Staging {vendorName}
        </h1>
        <p className="mt-4 max-w-2xl text-linen/65">
          {locale === "ro"
            ? `Încarcă o poză cu camera ta (goală sau mobilată). Păstrăm forma, pereții și unghiul, înlocuim mobilierul vechi cu piese reale ${vendorName} și îți arătăm prețurile cu link de cumpărare.`
            : t("intro", { vendor: vendorName })}
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
              className={`rounded-full px-4 py-2 text-sm ${
                budget === tier
                  ? "bg-brass text-ink"
                  : "border border-white/15 text-linen/75"
              }`}
            >
              {t(`budgets.${tier}`)}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
          {error}
        </p>
      ) : null}

      {/* Upload Foto Cameră Proprie */}
      <div className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4">
        <div>
          <p className="font-serif text-lg text-linen">{t("uploadTitle")}</p>
          <p className="mt-1 text-sm text-linen/70">
            {locale === "ro"
              ? `Goală sau deja mobilată. Folosim poza ta ca referință de structură și restilăm mobilierul cu catalogul ${vendorName}.`
              : t("uploadBody", { vendor: vendorName })}
          </p>
        </div>
        <label htmlFor="room-photo-upload" className="sr-only">
          {t("uploadCta")}
        </label>
        <input
          ref={fileInputRef}
          id="room-photo-upload"
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full cursor-pointer text-sm text-linen file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-brass file:px-5 file:py-2.5 file:text-sm file:font-medium file:text-ink"
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
          {t("restart")}
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

      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#1c1814]">
          {displayImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={displayImage}
              alt=""
              onError={() => setImageFailed(true)}
              className="mx-auto block h-auto w-full max-h-[80vh] object-contain"
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

        <DesignProductsSection
          products={displayProducts}
          locale={locale}
          vendorName={vendorName}
        />
      </div>
    </div>
  );
}
