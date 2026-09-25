const details = {
  property: "Mediterranean Sea Views | 1BR Apt with Balcony",
  operator: "Sea N' Rent",
  address: 'HaYarkon Street 78, Tel Aviv-Yafo, Israel',
  dates: 'May 1-5, 2027', arrival: 'May 1, 2027', departure: 'May 5, 2027',
  guests: '2 adults', nights: '4 nights', total: '$2,480',
  url: 'https://booking.seanrent.com/en-US/l/6a858a0dad291600292181c2/mediterranean-sea-views-1br-apt-with-balcony?currency=USD',
  caption: 'Illustrative conversation. Dates, availability and price are examples.',
} as const;

const queryChunks = ['Find me an apartment ', 'near the sea ', 'in Tel Aviv.'];
const replyChunks = ['May 1-5, 2027. ', 'Two adults.'];

// V7 conversation: two options, a follow-up request, then the listing the guest books.
// Totals are illustrative. The description and photos come from Sea N' Rent's
// verified HaYarkon 78 listing (see SOURCES.md); listing names are still placeholders.
export type ListingPhoto = { readonly src: string; readonly alt: string };
const photo = (name: string, alt: string): ListingPhoto => ({ src: `/seanrent/${name}.jpg`, alt });
const photos = {
  balcony: photo('balcony', "The Mediterranean-facing balcony of Sea N' Rent's Tel Aviv apartment"),
  living: photo('living', 'An open-plan living room, dining area and kitchen with a sea view'),
  bedroom: photo('bedroom', 'A bedroom with a double bed and a sea view'),
  interior: photo('interior', 'A sitting area opening onto a sea-view balcony'),
};
const second = {
  property: "[Second Sea N' Rent listing name]",
  total: '$2,160',
  photo: photos.living,
} as const;
const pool = {
  property: "[Sea N' Rent listing with pool]",
  total: '$3,120',
  description: 'A bright one-bedroom apartment on HaYarkon Street 78, Tel Aviv-Yafo, with a private balcony facing the Mediterranean. Sleeps up to four guests.',
  photo: photos.interior,
  photos: [photos.balcony, photos.living, photos.bedroom, photos.interior],
} as const;

export const STAY = {
  ...details, shortDates: details.dates.split(',')[0], queryChunks, replyChunks, question: queryChunks.join(''),
  clarification: 'What dates would you like to stay, and how many guests will be joining you?',
  photo: photos.balcony,
  optionsIntro: "Here are two Sea N' Rent apartments that fit:",
  second,
  followUp: "I'd also like a pool.",
  poolIntro: "Here is a Sea N' Rent option with a pool:",
  pool,
} as const;
