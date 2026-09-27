import { useEffect, useRef, useState } from 'react';
import { useNarrativeScroll } from '../v6/useNarrativeScroll';
import { Conversation } from '../v6/Scenes';
import { CHAPTERS, STORY_SECONDS, timeOf } from '../v6/storyPlayer';
import scenesSource from '../v6/Scenes.tsx?raw';
import playerSource from '../v6/storyPlayer.ts?raw';
import motionSource from '../v6/motion.ts?raw';
import staySource from '../v6/stay.ts?raw';
import scrollSource from '../v6/useNarrativeScroll.ts?raw';

// The conversation, annotated: the same scroll-driven ChatGPT scene as on the
// homepage, with a panel beside it that names the beat the scroll is on,
// explains it, and shows the lines of code running at that moment, read live
// from the source files. For the designer: what happens, and how.

type File = 'Scenes.tsx' | 'storyPlayer.ts' | 'motion.ts' | 'stay.ts' | 'useNarrativeScroll.ts';
const SOURCES: Record<File, string> = { 'Scenes.tsx': scenesSource, 'storyPlayer.ts': playerSource, 'motion.ts': motionSource, 'stay.ts': staySource, 'useNarrativeScroll.ts': scrollSource };
type Ref = { file: File; from: string; to?: string; max?: number };
type Beat = { from: number; to: number; title: string; what: string; how: string; code: Ref[] };

// A snippet of a source file, from the first line containing `from` to the first later line containing `to`.
function snippet({ file, from, to, max = 28 }: Ref) {
  const lines = SOURCES[file].split('\n');
  const start = lines.findIndex(l => l.includes(from));
  if (start < 0) return { file, line: 0, text: `// not found: ${from}` };
  let end = start;
  if (to) { const j = lines.findIndex((l, i) => i > start && l.includes(to)); end = j < 0 ? start : j; }
  const out = lines.slice(start, Math.min(end + 1, start + max));
  const indent = Math.min(...out.filter(l => l.trim()).map(l => (l.match(/^\s*/) as RegExpMatchArray)[0].length));
  return { file, line: start + 1, text: out.map(l => l.slice(indent)).join('\n') };
}

const BEATS: Beat[] = [
  { from: 0, to: .088, title: 'הסקשן נכנס למקום והחלון נפתח', what: 'עוד לפני שהסצנה "נתפסת" על המסך, הגלילה שמביאה אותה למקום פותחת את חלון ChatGPT: שני התריסים (ASK / ANSWER) נפתחים לצדדים, המסגרות בעומק מתיישרות והחלון מסתובב מפרספקטיבה לפרונטלי.', how: 'ScrollTrigger אחד ("opening") מודד את הכניסה של הסקשן מ-75% מהמסך עד לראש המסך ונותן מספר entry בין 0 ל-1. הרנדרר מתרגם אותו ל-open עם פונקציית phase (smoothstep) ומזיז את התריסים והחלון ב-transform בלבד.', code: [
    { file: 'storyPlayer.ts', from: 'const opening = ScrollTrigger.create({', to: '});', max: 6 },
    { file: 'Scenes.tsx', from: 'const open = phase(p, .025, .17)', to: 'styles(halo, { transform: portal });', max: 12 },
  ] },
  { from: .088, to: .145, title: 'השאלה מוקלדת', what: 'החלון פתוח, "Where should we begin?" מוצג, והשאלה של האורח מוקלדת אות-אות בשדה ההקלדה, עם סמן מהבהב.', how: 'הטקסט מחולק מראש לאותיות (<Typed by="char">), כל אות היא span עם class tk. הפונקציה typer מדליקה את n האותיות הראשונות לפי התקדמות הגלילה, כך שגלילה אחורה "מוחקת".', code: [
    { file: 'Scenes.tsx', from: 'typeQuery((p - .18) / .085);', to: 'visible(queryCaret', max: 3 },
    { file: 'Scenes.tsx', from: 'const typer = (el: Element | null) =>', to: '};', max: 12 },
  ] },
  { from: .145, to: .1975, title: 'שליחה: שדה ההקלדה הופך לבועה', what: 'אותו אלמנט שבו הוקלדה השאלה נסגר, עולה למעלה, מתקצר ומקבל רקע אפור: הוא הופך לבועת ההודעה של האורח. אין החלפת אלמנטים, זה "מורף" של אותה תיבה.', how: 'המשתנה send (0→1) שולט על רוחב, translateY, רדיוס, גודל גופן ורקע של .query-morph, ובמקביל מעלים את שורת הכלים ואת שורת הפתיחה. שדה ההקלדה הקבוע (dock) נכנס מלמטה.', code: [
    { file: 'Scenes.tsx', from: 'const surface = Math.round(255 - 14 * send);', to: 'visible(dock,phase(p,.32,.36),false);', max: 8 },
  ] },
  { from: .1975, to: .25, title: 'ChatGPT מבקש תאריכים ומספר אורחים', what: 'התשובה הראשונה של ה-AI נכנסת ומוקלדת מילה-מילה (לא אות-אות, כמו סטרימינג).', how: 'אותו מנגנון typer, הפעם על מילים (<Typed> ברירת המחדל). הטקסט עצמו יושב בקובץ stay.ts.', code: [
    { file: 'Scenes.tsx', from: 'const ask=phase(p,.395,.405)', to: 'typeClarification((p - .40) / .07);', max: 4 },
    { file: 'stay.ts', from: "clarification:", max: 1 },
  ] },
  { from: .25, to: .325, title: 'האורח מקליד תאריכים ושולח', what: 'בשדה ההקלדה התחתון מוקלד "May 1-5, 2027. Two adults." ואז ההודעה נשלחת ומופיעה כבועה.', how: 'הטיוטה (dock-draft) היא Typed נוסף שמוקלד לפי הגלילה; between(...) מציג אותה רק בחלון הזמן של ההקלדה, ואז details מעלה את הבועה.', code: [
    { file: 'Scenes.tsx', from: 'typeDraft[0]?.((p - .50) / .06);', to: 'visible(reply,details);', max: 7 },
  ] },
  { from: .325, to: .3925, title: 'חיפוש ברשת', what: 'שורת "Searching the web" מופיעה ונעלמת: רגע של המתנה לפני התשובה.', how: 'between(p, a, b, c, d) = כניסה בין a ל-b ויציאה בין c ל-d. מספרים אלה הם אחוזי סיפור, לא שניות.', code: [
    { file: 'Scenes.tsx', from: 'visible(search,between(p,.65,.67,.72,.745));', max: 1 },
    { file: 'motion.ts', from: 'export const phase', to: 'export const between', max: 3 },
  ] },
  { from: .3925, to: .54, title: 'התשובה: שתי דירות מתומחרות', what: 'תשובת ה-AI מוקלדת, ואז שני כרטיסי הדירות נכנסים בזה אחר זה, כל תמונה נחשפת מלמעלה למטה.', how: 'הכרטיסים הם DOM קבוע; רק opacity ו-translateY משתנים לכל כרטיס בהפרש של אחוז סיפור, והתמונה נחשפת עם clip-path: inset.', code: [
    { file: 'Scenes.tsx', from: 'visible(response,phase(p,.785,.80));', to: "photos.forEach((el,i)=>styles(el,{'clip-path'", max: 5 },
  ] },
  { from: .54, to: .583, title: '"I\'d also like a pool." מוקלד ונשלח', what: 'האורח מוסיף בקשה; בטלפון ההודעות הקודמות עולות למעלה כדי לפנות מקום.', how: 'מכאן ההתקדמות נמדדת על progress המלא (החצי הראשון של הסיפור עבד על p = progress / 0.5). ה-lift מחושב מגובה התוכן מול גובה החלון ומזיז את כל השרשור ב-translateY.', code: [
    { file: 'Scenes.tsx', from: 'typeDraft[1]?.((progress - .54) / .022);', to: 'visible(followUp, request);', max: 4 },
    { file: 'Scenes.tsx', from: 'let lift = 0;', to: "viewport?.classList.toggle('is-lifted', lift > 2);", max: 12 },
  ] },
  { from: .583, to: .655, title: 'התשובה עם הבריכה, והצ\'אט הופך לאמיתי', what: 'הכרטיס עם הבריכה נכנס, ומכאן שדה ההקלדה חי: אפשר להקליד בקשה משלך, לבחור מהצ\'יפים, לערוך את ההודעה, וה-AI עונה.', how: 'ב-progress ≥ .645 ה-dock מקבל is-live ומפסיק להיות inert. ההקלדה האמיתית היא React state רגיל (ask, openEdit, sendEdit) שמצייר שרשור (.chat-thread) מתחת לסיפור הסקרולי, ומבקש ציור מחדש דרך אירוע scene-redraw.', code: [
    { file: 'Scenes.tsx', from: 'const live = progress >= .645, mode = root.dataset.checkout;', to: 'if (dock) { dock.classList.toggle', max: 3 },
    { file: 'Scenes.tsx', from: 'const ask = (text: string) => {', to: '};', max: 9 },
  ] },
  { from: .655, to: .826, title: 'הסמן נע אל Book direct ולוחץ', what: 'סמן עכבר מדומה נכנס, נע אל כפתור Book direct, "לוחץ" (מתכווץ רגע) והכפתור מקבל הילה.', how: 'הסמן הוא SVG בתוך הכפתור; translate ו-scale שלו נגזרים מ-phase ו-between. אם המשתמש כבר שלח בקשה בעצמו (data-cursor="off"), הסמן לא מוצג.', code: [
    { file: 'Scenes.tsx', from: "visible(cursor,root.dataset.cursor === 'off'", to: 'styles(q(".pool-card .source-link")', max: 3 },
  ] },
  { from: .826, to: .965, title: 'הצ\'קאאוט של הנכס נפתח', what: 'דף התשלום של seanrent.com מחליק פנימה מעל הצ\'אט: אותה דירה, המחיר הסופי, והזמנה ישירה. בסוף נכנסת שורת המסקנה.', how: 'הגיליון (.chat-checkout) מוצג לפי phase(.826, .877). אם המשתמש פתח או סגר אותו ביד (data-checkout = open / closed), הערך ידני עוקף את הגלילה עד שגוללים אחורה לפני הבריכה (story-rewind).', code: [
    { file: 'Scenes.tsx', from: "const checkout = mode === 'open' ? 1", to: "styles(q(\".checkout-takeaway\")", max: 6 },
  ] },
  { from: .965, to: 1.01, title: 'הסקשן משתחרר והדף ממשיך', what: 'הסיפור נגמר; הסצנה מפסיקה להיות מוצמדת והגלילה ממשיכה לסקשנים שמתחת.', how: 'is-pinned יורד כש-u ≥ .965 (u = ההתקדמות בתוך ה-ScrollTrigger המוצמד). גובה הסקשן בכלל הוא 250svh, כלומר 2.5 מסכים של גלילה לכל הסיפור.', code: [
    { file: 'storyPlayer.ts', from: "root.classList.toggle('is-pinned'", max: 1 },
    { file: 'storyPlayer.ts', from: 'const trigger = ScrollTrigger.create({', to: '});', max: 6 },
  ] },
];

const EXTRAS: { title: string; what: string; code: Ref[] }[] = [
  { title: 'הטיימליין: למה גלילה רגועה מרגישה כמו צפייה', what: 'הגלילה לא ממופה לסיפור באופן ליניארי. טבלת TIMELINE אומרת באיזו שנייה "קורה" כל רגע (הקלדה מהירה, קריאה איטית), והפונקציה storyAt מתרגמת את מיקום הגלילה (u) לשניות ואז לאחוז סיפור. כך גלילה אחידה של המשתמש מייצרת קצב של סרט.', code: [{ file: 'storyPlayer.ts', from: 'const TIMELINE:', to: 'const OPEN = TIMELINE[0][0];', max: 8 }, { file: 'storyPlayer.ts', from: 'const render = () => {', to: 'root.dataset.story = story.toFixed(5);', max: 6 }] },
  { title: 'דילוג: הכדור "Skip the conversation" ותנופת גלגלת', what: 'בזמן שהסצנה מוצמדת מוצע כדור דילוג. בנוסף, "פליק" של גלגלת (הרבה מרחק בזמן קצר, ≥ 760px בפרצים של פחות מ-160ms בתוך חצי שנייה) מריץ את השיחה עד סופה ומחליק את הדף לסקשן הבא, בעוד שגלילה איטית ואחידה, ארוכה ככל שתהיה, נחשבת קריאה. אירוע הגלגלת שסוגר את הפליק נבלע כדי שלא יעצור את הגלישה.', code: [{ file: 'storyPlayer.ts', from: 'const onWheel = (event: WheelEvent) => {', to: 'if (burst >= 760)', max: 16 }] },
  { title: 'הגלילה החלקה: Lenis + השלמה עדינה', what: 'Lenis מחליק גלילת גלגלת (מגע נשאר טבעי). הגלילה אף פעם לא נעצרת או מואטת, אבל בתוך סצנה מוצמדת, עצירה ממש לפני סוף מעבר משלימה אותו כדי שלא נישאר עם כרטיס חצי-מוצג.', code: [{ file: 'useNarrativeScroll.ts', from: '// Lenis smooths wheel scrolling', to: 'export const smoothScroll', max: 10 }] },
  { title: 'איך הרנדרר עובד: פונקציה אחת של progress', what: 'chatRenderer בונה פעם אחת רשימת אלמנטים, ומחזיר פונקציה draw(progress) שמציירת את כל המצב מהמספר הזה בלבד. אין state בין פריימים, ולכן גלילה אחורה, קפיצה לפרק או ציור מחדש אחרי קליק תמיד נותנים את אותה תמונה. העזרים: phase (smoothstep בין שני אחוזים), between (כניסה ויציאה), visible (opacity + aria-hidden + inert), styles (setProperty).', code: [{ file: 'Scenes.tsx', from: 'const chatRenderer = (root: HTMLElement) => {', to: 'return (progress: number) => {', max: 16 }, { file: 'motion.ts', from: 'export function visible', to: '}', max: 8 }] },
  { title: 'טלפון ותנועה מופחתת', what: 'ב-prefers-reduced-motion או במסך נמוך מ-620px הדף עובר ל-is-flow: הסצנה לא מוצמדת, החלון מוצג פתוח ושלם עם התשובה, בלי אנימציה. בטלפון רגיל הסצנה כן מוצמדת, ומה שלא נכנס בחלון מורם למעלה (ה-lift).', code: [{ file: 'Scenes.tsx', from: 'const narrow = matchMedia', max: 1 }] },
];

const FILES: [string, string][] = [
  ['src/v6/Scenes.tsx', 'הקומפוננטה Conversation (ה-DOM של החלון, האינטראקטיביות: הקלדה, עריכה, הזמנה, גלריה) והרנדרר chatRenderer (הציור לפי progress). גם typer ו-<Typed>.'],
  ['src/v6/storyPlayer.ts', 'useStoryPlayer: שני ה-ScrollTriggers, טבלת TIMELINE, הפרקים, Play/Skip, כדור הדילוג ופליק הגלגלת. useFilmPlayer: אותו סיפור לפי זמן (לא בשימוש בדף הבית).'],
  ['src/v6/motion.ts', 'עזרי התנועה: clamp, phase, between, visible, styles, ו-useScene לסצנות אחרות.'],
  ['src/v6/useNarrativeScroll.ts', 'Lenis והכללים העדינים של הגלילה בתוך סצנות מוצמדות.'],
  ['src/v6/stay.ts', 'הטקסטים: השאלה, בקשת התאריכים, התשובה, הבקשה הנוספת.'],
  ['src/v6/listings.ts', 'הדירות, התמונות והטקסטים של הכרטיסים והצ\'קאאוט.'],
  ['src/v6/style.css', 'העיצוב של החלון: .chat-window, .query-morph, .chat-dock, .chat-checkout, וכל השאר.'],
  ['src/v8/App.tsx', 'דף הבית מרכיב את <Conversation motion controls={false}/> מתחת להירו.'],
];

type Live = { story: number; seconds: number; pinned: boolean; skipping: boolean; portal: string; send: string; query: string; clar: string; answer: string; live: boolean; checkout: string; sheet: string };
const readLive = (): Live | null => {
  const root = document.getElementById('guest-story');
  if (!root) return null;
  const q = (s: string) => root.querySelector<HTMLElement>(s);
  const typed = (s: string) => { const el = q(s); return el ? `${el.querySelectorAll('.tk.on').length} / ${el.querySelectorAll('.tk').length}` : '-'; };
  const story = Number(root.dataset.story || 0);
  const stage = q('.scene-stage');
  return {
    story, seconds: timeOf(story), pinned: root.classList.contains('is-pinned'), skipping: root.classList.contains('is-skipping'),
    portal: stage ? (stage.style.getPropertyValue('--portal-open') || '0').slice(0, 5) : '-', send: (q('.query-morph')?.style.getPropertyValue('--send') || '0').slice(0, 5),
    query: typed('.query-morph p'), clar: typed('.chat-clarification'), answer: typed('.answer-reply'),
    live: Boolean(q('.chat-dock')?.classList.contains('is-live')), checkout: root.dataset.checkout || 'auto', sheet: (q('.chat-checkout')?.style.opacity || '0').slice(0, 4),
  };
};

function Code({ refs }: { refs: Ref[] }) {
  return <>{refs.map((r, i) => { const s = snippet(r); return <figure className="an-code" key={i}><figcaption>{s.file}<span>:{s.line}</span></figcaption><pre dir="ltr"><code>{s.text}</code></pre></figure>; })}</>;
}

export default function Anatomy() {
  const [flow] = useState(() => matchMedia('(prefers-reduced-motion: reduce), (max-height: 619px)').matches);
  const [live, setLive] = useState<Live | null>(null);
  const last = useRef('');
  useNarrativeScroll(!flow);
  useEffect(() => { document.title = 'NEXA · The conversation, annotated'; }, []);
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const next = readLive();
      const key = JSON.stringify(next);
      if (key !== last.current) { last.current = key; setLive(next); }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);
  const story = live?.story ?? 0;
  const beat = BEATS.find(b => story >= b.from && story < b.to) ?? BEATS[BEATS.length - 1];
  const seek = (b: Beat) => document.getElementById('guest-story')?.dispatchEvent(new CustomEvent('story-seek', { detail: { story: Math.min(.999, b.from + .004) } }));
  const toTop = () => document.getElementById('guest-story')?.dispatchEvent(new CustomEvent('story-seek', { detail: { story: 0 } }));

  return <div className={`v3-page v7-light v8 anatomy ${flow ? 'is-flow' : 'is-motion'}`}>
    <header className="an-top" dir="rtl">
      <div><b>NEXA</b> · השיחה עם ChatGPT, מפורקת</div>
      <p>זו אותה סצנה כמו בדף הבית. גללו לאט: הפאנל מימין מספר באיזה רגע אנחנו, מה קורה על המסך, ואיזה שורות קוד רצות ברגע הזה (נקראות ישירות מקבצי המקור). לחיצה על רגע ברשימה קופצת אליו.</p>
      <a href="/">לדף הבית ↗</a>
    </header>
    <Conversation motion={!flow} controls={false}/>
    <section className="an-doc wrap" dir="rtl">
      <h2>איך זה בנוי</h2>
      <p className="an-lead">סצנה מוצמדת (sticky) בגובה 2.5 מסכים. כל פריים מחושב מתוך מספר אחד, אחוז ההתקדמות של הסיפור, ולכן כל גלילה, קפיצה או ציור מחדש נותנים תמיד את אותה תמונה. אין וידאו, אין ספרייה של אנימציות: DOM אחד קבוע, ופונקציה אחת שמזיזה אותו.</p>
      {EXTRAS.map(x => <article className="an-block" key={x.title}><h3>{x.title}</h3><p>{x.what}</p><Code refs={x.code}/></article>)}
      <article className="an-block"><h3>כל הרגעים, לפי אחוז הסיפור</h3>
        <ol className="an-beats-doc">{BEATS.map(b => <li key={b.title}><span className="an-range">{(b.from * 100).toFixed(1)}% – {(Math.min(1, b.to) * 100).toFixed(1)}%</span><b>{b.title}</b><p>{b.what}</p><p className="an-how">{b.how}</p><Code refs={b.code}/></li>)}</ol>
      </article>
      <article className="an-block"><h3>הפרקים של הנגן (לפי שניות)</h3><ul className="an-chapters">{CHAPTERS.map(c => <li key={c.label}><span>{c.start.toFixed(1)}s – {c.end.toFixed(1)}s</span>{c.title}</li>)}</ul><p className="an-how">סך הכול {STORY_SECONDS}s של "זמן סיפור" על פני 250svh של גלילה.</p></article>
      <article className="an-block"><h3>הקבצים</h3><ul className="an-files">{FILES.map(([f, d]) => <li key={f}><code dir="ltr">{f}</code><span>{d}</span></li>)}</ul></article>
    </section>
    <aside className="an-panel" dir="rtl" aria-live="polite">
      <div className="an-panel-head"><span className="an-kicker">מה קורה עכשיו</span><button type="button" className="an-reset" onClick={toTop}>להתחלה</button></div>
      <div className="an-progress" aria-hidden="true"><i style={{ width: `${(story * 100).toFixed(1)}%` }}/></div>
      <div className="an-stats"><span><b>{(story * 100).toFixed(1)}%</b> מהסיפור</span><span><b>{(live?.seconds ?? 0).toFixed(1)}s</b> מתוך {STORY_SECONDS}s</span><span className={live?.pinned ? 'is-on' : ''}>{live?.pinned ? 'מוצמד למסך' : 'לא מוצמד'}</span>{live?.skipping && <span className="is-on">מדלג</span>}</div>
      <div className="an-now">
        <span className="an-kicker">רגע {BEATS.indexOf(beat) + 1} מתוך {BEATS.length}</span>
        <h3>{beat.title}</h3>
        <p>{beat.what}</p>
        <p className="an-how">{beat.how}</p>
        <Code refs={beat.code}/>
      </div>
      <div className="an-live">
        <span className="an-kicker">ה-DOM ברגע זה</span>
        <table dir="ltr"><tbody>
          <tr><td>data-story</td><td>{story.toFixed(4)}</td></tr>
          <tr><td>--portal-open</td><td>{live?.portal}</td></tr>
          <tr><td>--send (query-morph)</td><td>{live?.send}</td></tr>
          <tr><td>.query-morph .tk.on</td><td>{live?.query}</td></tr>
          <tr><td>.chat-clarification .tk.on</td><td>{live?.clar}</td></tr>
          <tr><td>.answer-reply .tk.on</td><td>{live?.answer}</td></tr>
          <tr><td>.chat-dock.is-live</td><td>{String(live?.live ?? false)}</td></tr>
          <tr><td>data-checkout</td><td>{live?.checkout}</td></tr>
          <tr><td>.chat-checkout opacity</td><td>{live?.sheet}</td></tr>
        </tbody></table>
      </div>
      <ol className="an-beats">{BEATS.map((b, i) => <li key={b.title} className={b === beat ? 'is-current' : story >= b.to ? 'is-done' : ''}><button type="button" onClick={() => seek(b)}><span>{String(i + 1).padStart(2, '0')}</span>{b.title}</button></li>)}</ol>
    </aside>
  </div>;
}
