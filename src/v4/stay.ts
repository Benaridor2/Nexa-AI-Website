const details = {
  property: "Mediterranean Sea Views | 1BR Apt with Balcony",
  operator: "Sea N' Rent",
  address: 'HaYarkon Street 78, Tel Aviv-Yafo, Israel',
  dates: 'May 1-5, 2027', arrival: 'May 1, 2027', departure: 'May 5, 2027',
  guests: '2 adults', nights: '4 nights', total: '₪2,480',
  url: 'https://booking.seanrent.com/en-US/l/6a858a0dad291600292181c2/mediterranean-sea-views-1br-apt-with-balcony?currency=ILS',
  caption: 'Illustrative conversation. Dates, availability and price are examples.',
} as const;

const queryChunks = [`Find me a ${details.operator} apartment `, `in Tel Aviv for ${details.guests}, `, `${details.dates}, `, 'with a balcony ', 'and a sea view.'];
export const STAY = { ...details, shortDates: details.dates.split(',')[0], queryChunks, question: queryChunks.join('') } as const;
