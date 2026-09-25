import { useLayoutEffect, useRef, useState } from 'react';
import { createFold, type FoldController, type FoldState } from './fold';
import { money, PROPERTY } from './data';

// The mark, cut from the brand artwork (two blades meeting at a point).
export function Mark({ tone = 'white', className = '' }: { tone?: 'white' | 'purple'; className?: string }) {
  return <i className={`mark mark-${tone} ${className}`} aria-hidden="true"/>;
}

export function PlaceFace({ compact = false }: { compact?: boolean }) {
  return <div className="face face-front place">
    <figure className="place-photo"><img src={PROPERTY.photo} alt="Stone arches over the dining room of The Pearl of Jaffa" width="1600" height="1067" decoding="async"/></figure>
    <div className="place-caption">
      <span className="place-name">{PROPERTY.name}</span>
      {!compact && <span className="place-meta">{PROPERTY.area}</span>}
    </div>
  </div>;
}

export function LayerFace() {
  return <div className="face face-front layer">
    <i className="layer-anchor" aria-hidden="true"/><i className="layer-anchor-end" aria-hidden="true"/><i className="layer-anchor-foot" aria-hidden="true"/>
    <div className="layer-head"><Mark/><span>Nexa layer</span><span className="layer-live"><i/>Live</span></div>
    <dl className="layer-rows">
      <div><dt>Availability</dt><dd>May 1–5 · open</dd></div>
      <div><dt>Final price</dt><dd>{money(PROPERTY.total)} · {PROPERTY.nights} nights</dd></div>
      <div><dt>Booking route</dt><dd>Property website</dd></div>
    </dl>
    <p className="layer-foot"><span>Source</span>Your PMS</p>
  </div>;
}

// Two states share one face; values roll between them when the fold's data-priced flips.
const Roll = ({ off, on, i = 0 }: { off: React.ReactNode; on: React.ReactNode; i?: number }) =>
  <span className="roll" style={{ '--i': i } as React.CSSProperties}><span className="is-off">{off}</span><span className="is-on">{on}</span></span>;

export function OfferFace() {
  return <div className="face face-front offer">
    <p className="offer-kicker"><span className="cta-answer">In the AI answer</span><span className="cta-site">Your stay · {PROPERTY.website}</span></p>
    <p className="offer-name">{PROPERTY.name}</p>
    <p className="offer-dates">{PROPERTY.dates} · {PROPERTY.nights} nights</p>
    <div className="offer-facts">
      <p><span>Availability</span><b><Roll i={1} off="Unknown" on="Available"/></b></p>
      <p><span>Final price</span><b><Roll i={2} off="—" on={money(PROPERTY.total)}/></b></p>
    </div>
    <span className="offer-cta"><Roll i={3} off="Try a booking site" on={<><span className="cta-answer">Book direct</span><span className="cta-site">Continue to payment</span></>}/><b aria-hidden="true">↗</b></span>
    <small className="offer-foot"><Roll i={4} off="The AI can't confirm this stay" on={<><span className="cta-answer">On the property's own website</span><span className="cta-site">Payment on the property's website</span></>}/></small>
  </div>;
}

type Props = {
  className?: string;
  initial?: Partial<FoldState>;
  priced?: boolean;
  /** The offer is now on the property's own website. */
  site?: boolean;
  label: string;
  onReady?: (fold: FoldController) => void;
};

// Three hinged panels with real thickness, lit from the front left and
// casting their shadows on the floor.
const PHONE = '(max-width: 760px)';

// Desktop folds across (a standing screen); phones fold down (a vertical leaflet).
export function useVertical() {
  const [vertical, setVertical] = useState(() => matchMedia(PHONE).matches);
  useLayoutEffect(() => {
    const query = matchMedia(PHONE), change = () => setVertical(query.matches);
    query.addEventListener('change', change);
    return () => query.removeEventListener('change', change);
  }, []);
  return vertical;
}

export function Fold({ className = '', initial, priced = true, site = false, label, onReady }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const controller = useRef<ReturnType<typeof createFold> | null>(null);
  const vertical = useVertical();
  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const fold = createFold(root);
    controller.current = fold;
    fold.set(initial ?? {});
    onReady?.(fold);
    const observer = new ResizeObserver(() => fold.render());
    observer.observe(root);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useLayoutEffect(() => { controller.current?.render(); }, [vertical]);
  const faces = [<PlaceFace key="place"/>, <LayerFace key="layer"/>, <OfferFace key="offer"/>];
  return <div className={`fold ${className}`} ref={ref} role="img" aria-label={label} data-orientation={vertical ? 'vertical' : 'horizontal'} data-priced={priced} data-site={site}>
    <div className="fold-rig">
      <div className="fold-floor" aria-hidden="true">
        <svg viewBox="-900 -900 1800 1800" preserveAspectRatio="none">
          <defs><filter id="fold-soft" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="18"/></filter><filter id="fold-contact" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs>
          {[0, 1, 2].map(i => <polygon key={i} className="fold-shadow" filter="url(#fold-soft)"/>)}
          {[0, 1, 2].map(i => <line key={i} className="fold-contact" filter="url(#fold-contact)"/>)}
        </svg>
      </div>
      <div className="fold-slot" aria-hidden="true"><span>No live availability</span><span>No final price</span><span>No direct route</span></div>
      {faces.map((face, i) => <div key={i} className={`fold-panel panel-${i + 1}`} aria-hidden="true">
        {face}
        <div className="face face-back"/>
        <i className="edge edge-top"/><i className="edge edge-bottom"/><i className="edge edge-left"/><i className="edge edge-right"/>
        <i className="fold-shade"/>
      </div>)}
    </div>
  </div>;
}
