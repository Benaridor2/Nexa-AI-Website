import { useEffect, useState } from 'react';
import { BookingJourney } from './Scenes';
import { useNarrativeScroll } from './useNarrativeScroll';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
export default function HowItWorks(){
 const [flow,setFlow]=useState(()=>matchMedia('(prefers-reduced-motion: reduce), (max-height: 619px)').matches);
 useNarrativeScroll(!flow);
 useEffect(()=>{const media=matchMedia('(prefers-reduced-motion: reduce), (max-height: 619px)');const update=()=>setFlow(media.matches);media.addEventListener('change',update);void document.fonts.ready.then(()=>ScrollTrigger.refresh());return()=>media.removeEventListener('change',update);},[]);
 return <div className={`v3-page walkthrough-page ${flow?'is-flow':'is-motion'}`}><header className="main-header wrap"><a href="/" aria-label="Nexa home"><img src="/nexa-white.png" width="128" height="28" alt="Nexa"/></a><a href="/">Back to homepage ↗</a></header><main><BookingJourney motion={!flow}/><section className="walkthrough-notes wrap"><h2>One conversation.<br/><em>A direct relationship.</em></h2><ol><li><strong>The guest asks.</strong><p>Their existing AI assistant turns to your website, backed by the NEXA AI Connector.</p></li><li><strong>NEXA AI answers.</strong><p>Availability, final price and your direct booking route are returned through AI-to-AI communication.</p></li><li><strong>The AI recommends you.</strong><p>Your property by name, with your final price and your best-price guarantee.</p></li><li><strong>The guest books with you.</strong><p>Booking and payment happen on your website. The reservation reaches your PMS as a direct website booking.</p></li></ol><p>The guest installs nothing. No application or plugin activation is required.</p><a className="button button-dark" href="/">Back to NEXA ↗</a></section></main></div>;
}
