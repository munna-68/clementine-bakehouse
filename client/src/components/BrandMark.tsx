/** Pantry Modernism: a hand-stamped citrus mark adds a small, functional point of warmth. */
type BrandMarkProps = { className?: string; label?: boolean };

export function BrandMark({ className = "", label = true }: BrandMarkProps) {
  return (
    <div className={`brand-lockup ${className}`} aria-label="Clementine Bakehouse">
      <span className="citrus-mark" aria-hidden="true"><i /><i /><i /><i /><i /><i /><i /><i /></span>
      {label && <span className="brand-wordmark">clementine<span> bakehouse</span></span>}
    </div>
  );
}

