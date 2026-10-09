export const dynamic = 'force-dynamic';

import { getTranslations } from "next-intl/server";
import { AiRenderFlow } from "@/components/ai-render/AiRenderFlow";

export default async function AiStudioPage() {
  const t = await getTranslations("aiRender");

  return (
    <main className="mx-auto max-w-6xl px-6 pb-24 pt-28">
      <p className="text-xs uppercase tracking-[0.28em] text-brass">The Home</p>
      <h1 className="mt-3 font-serif text-5xl text-linen">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-linen/65">{t("intro")}</p>
      <div className="mt-10">
        <AiRenderFlow />
      </div>
    </main>
  );
}