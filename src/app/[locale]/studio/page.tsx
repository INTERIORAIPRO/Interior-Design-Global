import { setRequestLocale } from "next-intl/server";
import { RoomStudio } from "@/components/engine3d/RoomStudio";
import { createRendererSettings } from "@/engine/renderer/createRenderer";
import { primaryPartnerStore } from "@/lib/partner-store/catalog";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function StudioPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const settings = createRendererSettings();

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-28">
      <p className="text-xs uppercase tracking-[0.28em] text-brass">Engine</p>
      <h1 className="mt-3 font-serif text-5xl text-linen">3D Studio</h1>
      <p className="mt-4 max-w-2xl text-linen/65">
        Demo pieces from {primaryPartnerStore.brandName} are placed in the room
        from catalog photos and dimensions. Click an object to order via the
        affiliate link. Quality: {settings.quality}.
      </p>
      <div className="mt-8">
        <RoomStudio showList canvasHeightClass="h-[520px] min-h-[320px]" />
      </div>
    </main>
  );
}
