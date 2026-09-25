import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Arrow, Label } from './Scenes';
import { SiteHeader, type Page } from './Header';

// The Get Priced / Sign in dialog, shared by the homepage and the inner pages.
type DialogMode = 'priced' | 'signin';
export function useOnboarding() {
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [mode, setMode] = useState<DialogMode>('priced');
  const open = (next: DialogMode = 'priced') => { opener.current = document.activeElement as HTMLElement; setMode(next); dialog.current?.showModal(); };
  const trapFocus = (event: React.KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== 'Tab') return;
    const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('a[href], button')];
    const first = controls[0], last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
  };
  const element = <dialog ref={dialog} aria-labelledby="get-priced-title" onKeyDown={trapFocus} className="onboarding-dialog" onClose={() => opener.current?.focus()} onClick={e => { if (e.target === dialog.current) dialog.current.close(); }}><div><button className="dialog-close" aria-label="Close" onClick={() => dialog.current?.close()}>×</button>{mode === 'signin' ? <><Label>CUSTOMER PANEL</Label><h2 id="get-priced-title">Welcome back.<br/><em>Your panel opens here.</em></h2><p>Existing customers sign in to the NEXA panel to follow their AI channel and direct bookings.</p><p className="dialog-note">Prototype preview. The customer panel link will be connected here; nothing is collected or submitted.</p></> : <><Label>GET PRICED</Label><h2 id="get-priced-title">A direct connection<br/><em>starts with your property.</em></h2><p>The next step is a conversation about your PMS, your booking website, and the properties you operate.</p><ul><li>Your existing PMS</li><li>Your direct booking website</li><li>Your hotel or rental portfolio</li></ul><p className="dialog-note">Prototype preview. No information is collected or submitted. <a href="/pricing">See what it costs</a>.</p></>}<button className="button button-dark" onClick={() => dialog.current?.close()}>Back to NEXA <Arrow/></button></div></dialog>;
  return { open, element };
}

export function SiteFooter({ home = false }: { home?: boolean }) {
  const at = (hash: string) => home ? hash : `/${hash}`;
  return <footer className="footer wrap">
    <div className="footer-top"><a href={home ? '#' : '/'} aria-label="Nexa home"><img src="/nexa-purple.png" alt="Nexa" width="128" height="28"/></a><p>Be where your next guest is asking, not where they used to search.</p><a href="#main">Back to top ↑</a></div>
    <div className="footer-nav">
      <nav aria-label="Footer"><a href={at('#how-it-works')}>How it works</a><a href="/nexa-ai-connector">NEXA AI Connector</a><a href="/solutions">Solutions</a><a href="/pricing">Pricing</a><a href="/about">About</a><a href={at('#faq')}>FAQ</a><a href="/contact">Contact</a></nav>
      <ul className="footer-promises"><li>Live in days via your PMS</li><li>No developer needed</li></ul>
    </div>
    <div className="footer-bottom"><span>© 2026 NEXA</span><div><a href="/v1">V1</a><a href="/v2">V2</a><a href="/v3">V3</a><a href="/v4">V4</a><a href="/v5">V5</a></div></div>
    <p className="example-note">Sea N' Rent is used as a property example, not a customer endorsement. All booking data shown is illustrative.</p>
  </footer>;
}

// Inner pages: the same header, footer and dialog as the homepage, on a plain scroll.
const Priced = createContext<() => void>(() => undefined);
export function PricedButton({ className = 'button button-dark', children = 'Get Priced' }: { className?: string; children?: React.ReactNode }) {
  const open = useContext(Priced);
  return <button type="button" className={className} onClick={open}>{children} <Arrow diagonal/></button>;
}

// Blocks marked data-rise fade up as they reach the viewport (not with reduced motion).
function useRise() {
  useEffect(() => {
    const blocks = [...document.querySelectorAll<HTMLElement>('[data-rise]')];
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) { blocks.forEach(el => el.classList.add('is-in')); return; }
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-in'); observer.unobserve(entry.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: .12 });
    blocks.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export function PageShell({ page, title, children }: { page: Page; title: string; children: React.ReactNode }) {
  const { open, element } = useOnboarding();
  useRise();
  useEffect(() => { document.title = `${title} | NEXA`; }, [title]);
  return <Priced.Provider value={() => open('priced')}>
    <div className={`v3-page v7-light is-flow inner-page page-${page}`}>
      <a className="skip-link" href="#main">Skip to content</a>
      <SiteHeader current={page} onGetPriced={() => open('priced')} onSignIn={() => open('signin')}/>
      <main id="main">{children}</main>
      <SiteFooter/>
      {element}
    </div>
  </Priced.Provider>;
}

// The closing band every inner page ends with.
export function ClosingCta({ line }: { line?: React.ReactNode }) {
  return <section className="closing section-pad page-closing" aria-labelledby="closing-title"><div className="wrap"><Label>GET PRICED</Label><h2 id="closing-title">Get PRICED<br/><em>before your competitor does.</em></h2><PricedButton className="button button-light"/>{line && <p className="closing-line">{line}</p>}</div></section>;
}

export function PageLabel({ left, right }: { left: string; right?: string }) {
  return <p className="page-label"><span>{left}</span>{right && <span>{right}</span>}</p>;
}
