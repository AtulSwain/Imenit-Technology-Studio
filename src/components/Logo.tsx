/** The IMENIT wordmark with its three-bar E, plus the spaced TECHNOLOGIES line. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`logo${compact ? " logo--compact" : ""}`}>
      <span className="logo__word" aria-hidden>
        IM<span className="logo__e"><i /><i /><i /></span>NIT
      </span>
      {!compact && <span className="logo__sub" aria-hidden>Technologies</span>}
      <span className="sr-only">IMENIT Technologies</span>
    </span>
  );
}
