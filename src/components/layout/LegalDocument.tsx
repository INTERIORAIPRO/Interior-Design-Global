type LegalSection = {
  title: string;
  body: string;
};

type LegalDocumentProps = {
  kicker: string;
  title: string;
  updated: string;
  sections: LegalSection[];
};

export function LegalDocument({
  kicker,
  title,
  updated,
  sections,
}: LegalDocumentProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-28">
      <p className="text-xs uppercase tracking-[0.28em] text-brass">{kicker}</p>
      <h1 className="mt-3 font-serif text-4xl text-linen sm:text-5xl">{title}</h1>
      <p className="mt-3 text-sm text-linen/50">{updated}</p>
      <div className="mt-10 space-y-8">
        {sections.map((section) => (
          <section key={section.title}>
            <h2 className="font-serif text-2xl text-linen">{section.title}</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-linen/70">
              {section.body}
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
