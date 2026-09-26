// [01] THE TWO WORDS / PRICED OR UNPRICED, with the baseline that draws itself as the label arrives.
export function SectionLabel({ n, left, right }: { n?: string; left: string; right?: string }) {
  return <p className="s8-label" data-line><span>{n ? `[${n}] ` : ''}{left}</span>{right && <span>/ {right}</span>}</p>;
}
