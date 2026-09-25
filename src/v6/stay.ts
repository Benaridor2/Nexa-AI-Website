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
// Bracketed values are visible placeholders until Ben supplies the real listings.
const second = {
  property: "[Second Sea N' Rent listing name]",
  total: '[$ total]',
  photo: 'living',
} as const;
const pool = {
  property: "[Sea N' Rent listing with pool]",
  total: '[$ total]',
  description: '[description]',
  photo: 'interior',
  photos: ['balcony', 'living', 'bedroom', 'interior'],
} as const;

export const STAY = {
  ...details, shortDates: details.dates.split(',')[0], queryChunks, replyChunks, question: queryChunks.join(''),
  clarification: 'What dates would you like to stay, and how many guests will be joining you?',
  photo: 'balcony',
  optionsIntro: "Here are two Sea N' Rent apartments that fit:",
  second,
  followUp: "I'd also like a pool.",
  poolIntro: "Here is a Sea N' Rent option with a pool:",
  pool,
} as const;
