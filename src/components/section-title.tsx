export function SectionTitle({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--color-gold)]">{eyebrow}</p>
      <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">{title}</h2>
      {description ? <p className="mt-4 text-base leading-7 text-[var(--color-mist)]">{description}</p> : null}
      <div className="section-divider mt-6 w-40" />
    </div>
  );
}
