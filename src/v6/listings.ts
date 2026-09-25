import data from './listings.json';

// Sea N' Rent listings shown in the guest conversation and its checkout.
// Totals are illustrative 4-night totals; no link leads to the real listings.

export type ListingPhoto = { readonly src: string; readonly alt: string; readonly width: number; readonly height: number; readonly focus?: string };
export type AmenityIcon = 'pool' | 'beach' | 'parking' | 'gym' | 'kitchen' | 'elevator' | 'balcony' | 'wifi' | 'ac' | 'children' | 'coffee' | 'cookware' | 'crib' | 'dishes' | 'dishwasher' | 'dryer' | 'garden' | 'bath' | 'check';
export type Amenity = { readonly icon: AmenityIcon; readonly label: string };
export type Listing = {
  readonly key: string;
  readonly title: string;
  readonly address?: string;
  readonly sizeLabel: string;
  readonly ratingLabel?: string;
  readonly total: string;
  readonly summary: string;
  readonly sections: readonly { readonly title: string; readonly paragraphs: readonly string[] }[];
  readonly rules: readonly string[];
  readonly amenities: readonly Amenity[];
  readonly photos: readonly ListingPhoto[];
};
export type Request = { readonly listing: string; readonly reply: string; readonly extraLine: string; readonly keywords: readonly string[] };
export type Option = Request & { readonly id: string; readonly chip: string; readonly userMessage: string };

// Most specific first: "Hair dryer" must not become a laundry dryer.
const ICONS: [RegExp, AmenityIcon][] = [
  [/hair dryer|iron|essentials|cleaning|hot water|extinguisher|monoxide|heating|babysitter|toys|books/, 'check'],
  [/pool|swim/, 'pool'], [/beach|waterfront|sea view/, 'beach'], [/parking|garage/, 'parking'], [/gym/, 'gym'],
  [/elevator|lift/, 'elevator'], [/balcony|patio|terrace/, 'balcony'], [/internet|wi-?fi/, 'wifi'],
  [/air conditioning|ceiling fan/, 'ac'], [/children allowed|infants|family|kid/, 'children'], [/coffee|kettle/, 'coffee'],
  [/crib|pack and play/, 'crib'], [/dishwasher/, 'dishwasher'], [/dishes|dinnerware/, 'dishes'], [/cookware/, 'cookware'],
  [/dryer|washer|washing/, 'dryer'], [/garden|backyard/, 'garden'], [/bath/, 'bath'],
  [/kitchen|oven|stove|microwave|refrigerator|toaster/, 'kitchen'],
];
const iconFor = (label: string): AmenityIcon => ICONS.find(([pattern]) => pattern.test(label.toLowerCase()))?.[1] ?? 'check';

// The first sentence or two, for the short description beside the photo.
const lead = (text: string) => {
  const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [text];
  let summary = '';
  for (const sentence of sentences) {
    if (summary && (summary + sentence).length > 190) break;
    summary += sentence;
  }
  return summary.trim();
};

type Source = (typeof data.listings)[number];
const fromSite = (item: Source): Listing => {
  const summary = lead(item.description);
  const rest = item.description.slice(summary.length).trim();
  const labels = item.amenities.filter(label =>
    !(label === 'Coffee' && item.amenities.includes('Coffee maker')) && !(label === 'Internet' && item.amenities.includes('Wireless Internet')));
  return {
    key: item.key, title: item.title, address: item.address, sizeLabel: item.sizeLabel, ratingLabel: item.ratingLabel,
    total: `$${item.totalUsd.toLocaleString('en-US')}`,
    summary,
    sections: [...(rest ? [{ title: 'The apartment', paragraphs: [rest] }] : []), { title: 'Location', paragraphs: [item.address] }],
    rules: [],
    amenities: labels.map(label => ({ icon: iconFor(label), label })),
    photos: item.photos.map((_, i) => ({ src: `/seanrent/tel-aviv/${item.key}/${i + 1}.jpg`, alt: `${item.title}, photo ${i + 1} of ${item.photos.length}`, width: 1080, height: 720 })),
  };
};

const coastalPhoto = (name: string, alt: string, focus?: string): ListingPhoto => ({ src: `/seanrent/coastal-panorama/${name}.jpg`, alt, width: 1200, height: 800, focus });
// Listing text and photos supplied by Ben from Sea N' Rent's Coastal Panorama listing. The total is illustrative.
const coastal: Listing = {
  key: 'coastal',
  title: "Coastal Panorama Apartment by Sea N' Rent",
  sizeLabel: '2 bedrooms · up to 4 guests',
  total: '$740',
  summary: 'Welcome to a spacious two-bedroom apartment with breathtaking Mediterranean sea views from the 26th floor. Enjoy uninterrupted vistas in a calm, light-filled space designed for comfort, relaxation, and a strong connection to the coastline.',
  sections: [
    { title: 'The space', paragraphs: [
      'The open living area features comfortable seating, a large dining table, and a 55-inch Smart TV with Netflix. Floor-to-ceiling windows lead to a wide private balcony, perfect for morning coffee or sunsets with panoramic sea views.',
      'The kitchen is fully equipped for short or extended stays, including oven, stove, dishwasher, microwave, Nespresso machine, kettle, and complete cookware—practical, functional, and ready to use.',
      'Both bedrooms ensure rest and privacy: the main bedroom has a king bed, while the second bedroom offers a double bed. Two modern bathrooms with walk-in showers comfortably serve up to four guests.',
      'Guests can enjoy shared building amenities such as a swimming pool, gym, elevator, free private parking, and 24/7 security.',
      'Located within walking distance of the beach, restaurants, and bars, this apartment offers a perfect combination of convenience, comfort, and a truly panoramic sea-view experience.',
    ] },
    { title: 'The neighborhood', paragraphs: [
      "This apartment by Sea N' Rent is in a prime Tel Aviv location, just steps from the beach. Offering the perfect blend of city life and seaside relaxation, you’ll find yourself surrounded by everything Tel Aviv has to offer.",
      'Take a morning stroll along the famous promenade, where you can soak in stunning sea views, enjoy beachside cafés, or rent a bike for a scenic ride. The vibrant streets nearby are lined with trendy restaurants, lively bars, and boutique shops, ensuring you always have something to explore.',
      'A short walk brings you to the bustling Carmel Market, where you can experience fresh local flavors and the energy of Tel Aviv’s street food scene. Cultural landmarks, museums, and art galleries are also within easy reach, offering a glimpse into the city’s rich history and creativity.',
      "Whether you're here to unwind by the sea, discover the nightlife, or explore the city’s hidden gems, this apartment places you right in the heart of it all.",
    ] },
  ],
  rules: [
    'No smoking', 'No pets allowed (subject to approval)', 'No parties allowed', 'Crib/extra folding bed - available upon request only',
    'Turn off lights and AC/heating when out', 'Respect neighbors by keeping noise reasonable', 'Primary guest must be 21 or older',
  ],
  amenities: ['Swimming pool', 'Near the beach', 'Free parking', 'Gym', 'Kitchen', 'Lift/Elevator', 'Patio or balcony', 'Wireless Internet', 'Air conditioning',
    'Children allowed', 'Coffee maker', 'Cookware', 'Crib', 'Dishes and silverware', 'Dishwasher', 'Dryer'].map(label => ({ icon: iconFor(label), label })),
  photos: [
    coastalPhoto('pool', 'The rooftop swimming pool with loungers and a view over Tel Aviv', '50% 88%'),
    coastalPhoto('living', 'The living room opening onto a wide balcony with a panoramic sea view'),
    coastalPhoto('lounge', 'A bright lounge with white sofas and a dining table'),
    coastalPhoto('bedroom', 'The main bedroom with a king bed and a city view'),
  ],
};

export const LISTINGS: Record<string, Listing> = Object.fromEntries([coastal, ...data.listings.map(fromSite)].map(listing => [listing.key, listing]));
export const FIRST_ANSWER = { reply: data.firstAnswer.reply, listings: data.firstAnswer.listings.map(key => LISTINGS[key]) };
// Ben's pool result: the Coastal Panorama apartment, which the demo cursor books.
export const POOL_ANSWER: Request = { listing: 'coastal', reply: "Here is a Sea N' Rent option with a pool:", extraLine: 'Rooftop pool · 26th-floor sea views', keywords: ['pool', 'swimming', 'beach'] };
export const OPTIONS: readonly Option[] = data.options;
const EXTRAS: readonly Request[] = data.extraKeywords;
export const FALLBACK_REPLY = data.fallback.reply;

// Highlighted amenities answer the guest's request (a pool, parking, Wi-Fi...), and lead the list.
export const highlightsFor = (listing: Listing, request?: Request) => {
  const words = (request?.keywords ?? []).filter(word => word.length > 2);
  return listing.amenities.filter(item => item.label === 'Near the beach' && request?.listing === 'coastal' || words.some(word => item.label.toLowerCase().includes(word))).map(item => item.label);
};

const escape = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const mentions = (text: string, keyword: string) => new RegExp(`(^|[^\\p{L}\\p{N}])${escape(keyword)}s?(?=$|[^\\p{L}\\p{N}])`, 'u').test(text);

// Free text: every keyword that appears as a whole word or phrase (a trailing s allowed);
// the longest wins, and on a tie the entry listed first (options before the extra keywords).
export function matchRequest(input: string): Request | null {
  const text = input.toLowerCase();
  let best: Request | null = null, length = 0;
  for (const entry of [...OPTIONS, ...EXTRAS]) for (const keyword of entry.keywords) {
    if (keyword.length > length && mentions(text, keyword)) { best = entry; length = keyword.length; }
  }
  return best;
}

// Autocomplete: the request is typed after "I also want", so that phrase is ignored when ranking.
const stripLead = (text: string) => text.toLowerCase().replace(/^\s*(and\s+)?(i\s+)?(also\s+)?(want|would like|'d like|d like|need|like)?\s*/, '').replace(/\s+/g, ' ').trimStart();
export function suggest(input: string): readonly Option[] {
  const query = stripLead(input);
  if (!query.trim()) return OPTIONS;
  const last = query.trim().split(' ').at(-1) ?? '';
  const rank = (option: Option) => {
    const chip = option.chip.toLowerCase();
    if (chip.startsWith(query)) return 0;
    if (chip.includes(query.trim())) return 1;
    if (last.length > 1 && option.keywords.some(keyword => keyword.startsWith(last))) return 2;
    return matchRequest(input) === option ? 2 : 9;
  };
  return OPTIONS.map(option => [option, rank(option)] as const).filter(([, score]) => score < 9).sort((a, b) => a[1] - b[1]).map(([option]) => option);
}

// Inline completion: the rest of the top suggestion, when the text so far begins
// the full request or any word of it ("chea" completes to "cheapest option").
export function completion(input: string, option: Option | undefined) {
  const typed = input.toLowerCase();
  if (!option || !typed.trim()) return '';
  const message = option.userMessage.replace(/\.$/, '');
  const starts = [message, ...[...option.chip.matchAll(/\S+/g)].map(word => option.chip.slice(word.index))];
  for (const target of starts) if (target.toLowerCase().startsWith(typed) && target.length > typed.length) return target.slice(typed.length);
  return '';
}
