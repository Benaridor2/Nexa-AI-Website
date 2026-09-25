import { useEffect } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const beats: Record<string, number[]> = {
  'guest-story': [.12,.20,.25,.33,.44,.63,.81,.94,1],
  'priced': [.12,.34,.50,.66,.77,.87,.99,1],
  'how-it-works': [.08,.25,.43,.60,.78,.91,.99,1],
  'connector': [.15,.43,.63,.84,.99,1],
};

// Wheel gestures advance one narrative beat. Native touch and keyboard scrolling
// remain continuous, as do the portal entrance and the spaces between chapters.
export function useNarrativeScroll(enabled: boolean){
 useEffect(()=>{
  if(!enabled)return;
  let animating=false, settledUntil=0, lastInput=0, accumulated=0, direction=0;
  const lenis=new Lenis({lerp:.14,smoothWheel:true,syncTouch:false,anchors:true,
   prevent:node=>Boolean(node.closest('dialog')),
   virtualScroll:({deltaY,event})=>{
    if(event.type!=='wheel'||(event as WheelEvent).ctrlKey||document.querySelector('dialog[open]'))return true;
    const now=performance.now(),fresh=now-lastInput>180;
    lastInput=now;
    const sign=Math.sign(deltaY);
    if(!sign)return true;
    if(sign!==direction){animating=false;settledUntil=0;}
    if(animating||now<settledUntil){event.preventDefault();return false;}
    if(fresh||direction!==sign)accumulated=0;
    direction=sign;
    const trigger=ScrollTrigger.getAll().find(t=>{
     const el=t.trigger as HTMLElement|undefined;
     return el?.id && beats[el.id] && t.progress<1 && ((t.progress>0 && el.getBoundingClientRect().top<=1) || (sign>0 && t.start>=lenis.scroll && t.start-lenis.scroll<innerHeight*.5 && lenis.scroll+Math.abs(deltaY)>=t.start));
    });
    if(!trigger)return true;
    accumulated+=Math.abs(deltaY);
    if(accumulated<4){event.preventDefault();return false;}
    accumulated=0;
    const stops=beats[(trigger.trigger as HTMLElement).id];
    const p=trigger.progress;
    const target=sign>0?stops.find(n=>n>p+.012):[0,...stops].reverse().find(n=>n<p-.012);
    if(target===undefined)return true;
    event.preventDefault();
    animating=true;
    lenis.scrollTo(trigger.start+(trigger.end-trigger.start)*target,{
     duration:Math.min(.72,.45+Math.abs(target-p)),
     easing:t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2,
     onComplete:()=>{animating=false;settledUntil=performance.now()+90;},
    });
    return false;
   },
  });
  lenis.on('scroll',ScrollTrigger.update);
  const tick=(seconds:number)=>lenis.raf(seconds*1000);
  gsap.ticker.add(tick);
  return()=>{gsap.ticker.remove(tick);lenis.destroy();};
 },[enabled]);
}
