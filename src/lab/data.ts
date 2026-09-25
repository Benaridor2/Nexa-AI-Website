import fixture from '../v6/listings.json';

// Content for the experimental homepage. Facts come from the approved site copy
// and the Sea N' Rent fixture (collected from booking.seanrent.com); stay prices
// are the fixture's illustrative 4-night totals.

const pearl = fixture.listings.find(listing => listing.key === 'pearl')!;

export const PROPERTY = {
  name: 'The Pearl of Jaffa',
  area: 'Old Jaffa, Tel Aviv',
  kind: '3 bedrooms · up to 6 guests',
  photo: '/lab/pearl-arches.webp',
  gallery: ['/lab/pearl-arches.webp', '/lab/pearl-kitchen.webp', '/lab/pearl-living.webp'],
  nightly: pearl.fromPriceUsd,
  total: pearl.totalUsd,
  dates: 'May 1–5, 2027',
  nights: 4,
  guests: '2 guests',
  host: "Sea N' Rent",
  website: 'seanrent.com',
};

export const money = (usd: number) => `$${usd.toLocaleString('en-US')}`;

export const PMS = ['Guesty', 'Hostaway', 'BoomNow', 'Hospitable', 'Rentals United', 'HotelSync'];

// The approved FAQ, verbatim from the current homepage.
export const FAQ: [string, string][] = [
  ['Where does the guest complete the booking?', "On your property's own website, using your existing booking and payment flow. The reservation then reaches your PMS as a direct website booking."],
  ['Does the guest need to install or activate anything?', 'No. Guests ask the AI assistant they already use. There is no guest installation, account connection, or NEXA activation step.'],
  ['What does my property need to connect?', 'Operator onboarding connects your PMS booking data and your direct booking destination. We review your PMS and website setup with you; guest simplicity does not mean the property has no setup.'],
  ['Can I keep my existing website and channels?', 'Yes. Your own website remains the booking destination. NEXA adds a route from AI discovery to your direct channel, alongside your existing distribution.'],
  ['Are Direct and Agent separate packages?', 'They describe two types of demand through one connection. Direct is a request naming your property or brand. Agent is a destination-led request for a suitable stay.'],
  ['What happens to the guest relationship?', "Booking and payment take place with the property. Your website and PMS continue to handle the reservation. Specific data handling is reviewed during onboarding."],
  ['Does NEXA guarantee a recommendation?', 'No. AI assistants decide which answers and recommendations to show. NEXA makes actionable property data available; it does not promise placement or selection in every answer.'],
  ['How is NEXA priced?', 'A commission on the bookings the AI brings you, and nothing else: no packages, no fixed monthly fees, cancel anytime. Its size depends on whether the guest asked for you by name. The full numbers are on the Pricing page.'],
];
