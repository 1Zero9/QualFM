export function LegalPage({
  hero,
  sections,
}: {
  hero: { title: string; subtitle: string };
  sections: Array<{ id: string; title: string; body: string }>;
}) {
  return (
    <div className="mx-auto max-w-[760px] px-4 py-14 md:px-6">
      <h1 className="text-3xl font-bold uppercase italic text-navy">{hero.title}</h1>
      <p className="mt-2 text-ink/70">{hero.subtitle}</p>
      <div className="mt-8 space-y-8">
        {sections.map((section) => (
          <section key={section.id}>
            <h2 className="text-lg font-bold text-navy">{section.title}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-ink/85">{section.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
