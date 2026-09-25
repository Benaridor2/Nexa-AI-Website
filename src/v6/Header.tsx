import { useEffect, useRef, useState } from 'react';
import { Arrow } from './Scenes';

// Site navigation, following the menu in the website plan. Pages that are not
// built yet appear as "Soon" rather than as links that lead nowhere.
type Item = { title: string; text: string; icon: string; href?: string; soon?: boolean };
const MENUS: { label: string; items: Item[] }[] = [
  { label: 'Product', items: [
    { title: 'How it works', text: 'From a guest’s question to a booking on your site.', href: '#how-it-works', icon: 'M4 6h16M4 12h10M4 18h6' },
    { title: 'NEXA AI Connector', text: 'Live availability and final prices, ready for the AI.', href: '/nexa-ai-connector', icon: 'M9 7H6a5 5 0 0 0 0 10h3M15 7h3a5 5 0 0 1 0 10h-3M8 12h8' },
    { title: 'Direct and Agent', text: 'One connection. Two kinds of guests.', href: '#connector', icon: 'M5 6c5 0 5 6 9 6h5M5 18c5 0 5-6 9-6M16 9l3 3-3 3' },
    { title: 'Watch a booking happen', text: 'The complete journey, step by step.', href: '/how-it-works', icon: 'M8 5.5v13l10-6.5-10-6.5Z' },
  ] },
  { label: 'Solutions', items: [
    { title: 'NEXA Booking Engine', text: 'A direct booking website the AI can read, trust and quote.', soon: true, icon: 'M4 5h16v14H4zM4 9h16M8 13h5' },
    { title: 'Multi Website', text: 'A separate website for every brand you run.', soon: true, icon: 'M3 8h12v11H3zM9 4h12v11h-2' },
    { title: 'Keep your website', text: 'The connector works with the site you already run.', href: '/nexa-ai-connector', icon: 'M5 12.5l4.5 4.5L19 7.5' },
  ] },
];

function Chevron() {
  return <svg className="nav-chevron" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m7 10 5 5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>;
}

function MenuItem({ item, onPick }: { item: Item; onPick: () => void }) {
  const inner = <><span className="menu-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d={item.icon} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></span><span className="menu-copy"><strong>{item.title}{item.soon && <em>Soon</em>}</strong><small>{item.text}</small></span></>;
  return item.href ? <a className="menu-item" href={item.href} onClick={onPick}>{inner}</a> : <div className="menu-item is-soon" aria-disabled="true">{inner}</div>;
}

export function SiteHeader({ onGetPriced, onSignIn }: { onGetPriced: () => void; onSignIn: () => void }) {
  const [open, setOpen] = useState<string | null>(null);
  const [mobile, setMobile] = useState(false);
  const bar = useRef<HTMLElement>(null), leave = useRef<number | undefined>(undefined);
  useEffect(() => {
    const outside = (event: PointerEvent) => { if (!bar.current?.contains(event.target as Node)) { setOpen(null); setMobile(false); } };
    const escape = (event: KeyboardEvent) => { if (event.key === 'Escape') { setOpen(null); setMobile(false); } };
    document.addEventListener('pointerdown', outside);
    document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, []);
  const close = () => { setOpen(null); setMobile(false); };
  const hover = (label: string | null) => {
    window.clearTimeout(leave.current);
    if (label) setOpen(label); else leave.current = window.setTimeout(() => setOpen(null), 160);
  };
  return <header className={`main-header site-header wrap${mobile ? ' is-mobile-open' : ''}`} ref={bar} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(null); }}>
    <a href="#" className="site-logo" aria-label="Nexa home" onClick={close}><img src="/nexa-purple.png" width="128" height="28" alt="Nexa"/></a>
    <nav aria-label="Main navigation" className="site-nav">
      <ul>
        {MENUS.map(menu => <li key={menu.label} className={open === menu.label ? 'is-open' : ''} onPointerEnter={event => { if (event.pointerType === 'mouse') hover(menu.label); }} onPointerLeave={event => { if (event.pointerType === 'mouse') hover(null); }}>
          <button type="button" className="nav-trigger" aria-expanded={open === menu.label} aria-controls={`menu-${menu.label}`} onClick={() => setOpen(open === menu.label ? null : menu.label)}>{menu.label}<Chevron/></button>
          <div className="nav-menu" id={`menu-${menu.label}`}>{menu.items.map(item => <MenuItem key={item.title} item={item} onPick={close}/>)}</div>
        </li>)}
        <li><button type="button" className="nav-link" onClick={() => { close(); onGetPriced(); }}>Pricing</button></li>
        <li><a className="nav-link" href="#faq" onClick={close}>FAQ</a></li>
      </ul>
    </nav>
    <div className="site-actions">
      <button type="button" className="header-signin" onClick={() => { close(); onSignIn(); }}>Sign in</button>
      <button type="button" className="header-cta" onClick={() => { close(); onGetPriced(); }}>Get Priced <Arrow diagonal/></button>
      <button type="button" className="menu-toggle" aria-expanded={mobile} aria-controls="mobile-menu" aria-label={mobile ? 'Close menu' : 'Open menu'} onClick={() => setMobile(!mobile)}><span/><span/></button>
    </div>
    <div className="mobile-menu" id="mobile-menu" hidden={!mobile}>
      {MENUS.map(menu => <section key={menu.label}><p>{menu.label}</p>{menu.items.map(item => <MenuItem key={item.title} item={item} onPick={close}/>)}</section>)}
      <div className="mobile-links"><button type="button" onClick={() => { close(); onGetPriced(); }}>Pricing</button><a href="#faq" onClick={close}>FAQ</a><button type="button" onClick={() => { close(); onSignIn(); }}>Sign in</button></div>
    </div>
  </header>;
}
