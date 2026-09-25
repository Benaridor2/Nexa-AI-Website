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
// Totals are illustrative. The second listing's name is still a placeholder.
// focus is the CSS object-position that keeps the subject in view when a photo is cropped.
export type ListingPhoto = { readonly src: string; readonly alt: string; readonly width: number; readonly height: number; readonly focus?: string };
const photo = (name: string, alt: string): ListingPhoto => ({ src: `/seanrent/${name}.jpg`, alt, width: 1080, height: 721 });
const coastal = (name: string, alt: string, focus?: string): ListingPhoto => ({ src: `/seanrent/coastal-panorama/${name}.jpg`, alt, width: 1200, height: 800, focus });
const photos = {
  balcony: photo('balcony', "The Mediterranean-facing balcony of Sea N' Rent's Tel Aviv apartment"),
  living: photo('living', 'An open-plan living room, dining area and kitchen with a sea view'),
};
const second = {
  property: "[Second Sea N' Rent listing name]",
  total: '$2,160',
  photo: photos.living,
} as const;

export type Amenity = 'pool' | 'beach' | 'parking' | 'gym' | 'kitchen' | 'elevator' | 'balcony' | 'wifi' | 'ac' | 'children' | 'coffee' | 'cookware' | 'crib' | 'dishes' | 'dishwasher' | 'dryer';
// Listing text and photos supplied from Sea N' Rent's Coastal Panorama listing.
const coastalPhotos = {
  pool: coastal('pool', 'The rooftop swimming pool with loungers and a view over Tel Aviv', '50% 88%'),
  living: coastal('living', 'The living room opening onto a wide balcony with a panoramic sea view'),
  lounge: coastal('lounge', 'A bright lounge with white sofas and a dining table'),
  bedroom: coastal('bedroom', 'The main bedroom with a king bed and a city view'),
};
const pool = {
  property: "Coastal Panorama Apartment by Sea N' Rent",
  total: '$3,120',
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
    'No smoking',
    'No pets allowed (subject to approval)',
    'No parties allowed',
    'Crib/extra folding bed - available upon request only',
    'Turn off lights and AC/heating when out',
    'Respect neighbors by keeping noise reasonable',
    'Primary guest must be 21 or older',
  ],
  // The guest asked for a pool, so it leads, with the beach it is near.
  amenities: [
    ['pool', 'Swimming pool'], ['beach', 'Near the beach'], ['parking', 'Free parking'], ['gym', 'Gym'],
    ['kitchen', 'Kitchen'], ['elevator', 'Lift/Elevator'], ['balcony', 'Patio or balcony'], ['wifi', 'Wireless Internet'],
    ['ac', 'Air conditioning'], ['children', 'Children allowed'], ['coffee', 'Coffee maker'], ['cookware', 'Cookware'],
    ['crib', 'Crib'], ['dishes', 'Dishes and silverware'], ['dishwasher', 'Dishwasher'], ['dryer', 'Dryer'],
  ] as readonly (readonly [Amenity, string])[],
  highlights: ['pool', 'beach'] as readonly Amenity[],
  photo: coastalPhotos.pool,
  photos: [coastalPhotos.pool, coastalPhotos.living, coastalPhotos.lounge, coastalPhotos.bedroom],
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
