type Props = { index: string; label: string; title: string; id: string; intro?: string };

/** Consistent section opener: numbered label, headline, optional intro. */
export function SectionHead({ index, label, title, id, intro }: Props) {
  return (
    <div className="section-head" data-reveal>
      <p className="label">
        <span className="mono label__index">{index}</span>
        <span className="label__rule" aria-hidden />
        {label}
      </p>
      <div className="section-head__row">
        <h2 id={id} className="h2">{title}</h2>
        {intro && <p className="section-head__intro">{intro}</p>}
      </div>
    </div>
  );
}
