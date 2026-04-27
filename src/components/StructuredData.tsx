const SITE_URL = 'https://horizonssandhills.com';

const resort = {
  '@context': 'https://schema.org',
  '@type': 'Resort',
  '@id': `${SITE_URL}/#resort`,
  name: 'Horizons Sandhills',
  description:
    'Premium glamping retreat on 126 acres of longleaf pine savanna in the Carolina Sandhills. Private lake, six Forest Villa villas, and The House — 90 minutes from Charlotte.',
  url: SITE_URL,
  telephone: '+18035550180',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '423 Woodmen Rd',
    addressLocality: 'Patrick',
    addressRegion: 'SC',
    postalCode: '29584',
    addressCountry: 'US',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 34.5734,
    longitude: -80.038,
  },
  priceRange: '$609–$1200',
  checkinTime: '15:00',
  checkoutTime: '11:00',
  petsAllowed: true,
  numberOfRooms: 7,
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private lake', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Sauna', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Canoes & paddleboards', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Twelve miles of hiking trails', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Stargazing chairs', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Outdoor firepit', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Starlink Wi-Fi (The House & sauna)', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Welcome pantry box', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Personal host concierge', value: true },
  ],
  image: [
    `${SITE_URL}/images/sandhills/Villa.webp`,
    `${SITE_URL}/images/sandhills/house.webp`,
    `${SITE_URL}/images/sandhills/land.webp`,
  ],
  containsPlace: [
    {
      '@type': 'Accommodation',
      '@id': `${SITE_URL}/stays/boxble-villa#accommodation`,
      name: 'The Forest Villa',
      description:
        'Private lakefront cabin with king bed, outdoor deck, and outdoor shower. Six cabins spaced so you cannot see your neighbor. Intentionally offline.',
      url: `${SITE_URL}/stays/boxble-villa`,
      occupancy: { '@type': 'QuantitativeValue', maxValue: 2 },
      bed: { '@type': 'BedDetails', typeOfBed: 'King size bed', numberOfBeds: 1 },
      numberOfBathroomsTotal: 1,
      numberOfBedrooms: 1,
      petsAllowed: true,
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Private deck', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Outdoor shower', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Lake view', value: true },
      ],
      offers: {
        '@type': 'Offer',
        price: '609',
        priceCurrency: 'USD',
        priceSpecification: { '@type': 'UnitPriceSpecification', price: '609', priceCurrency: 'USD', unitText: 'NIGHT' },
      },
    },
    {
      '@type': 'Accommodation',
      '@id': `${SITE_URL}/stays/the-house#accommodation`,
      name: 'The House',
      description:
        'Flagship lakeside property sleeping eight. Four bedrooms, full kitchen, firepit deck. For families and groups.',
      url: `${SITE_URL}/stays/the-house`,
      occupancy: { '@type': 'QuantitativeValue', maxValue: 8 },
      numberOfBathroomsTotal: 3,
      numberOfBedrooms: 4,
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Full kitchen', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Lakeside deck with firepit', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Starlink Wi-Fi', value: true },
      ],
      offers: {
        '@type': 'Offer',
        price: '1200',
        priceCurrency: 'USD',
        priceSpecification: { '@type': 'UnitPriceSpecification', price: '1200', priceCurrency: 'USD', unitText: 'NIGHT' },
      },
    },
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5',
    reviewCount: '3',
    bestRating: '5',
  },
  review: [
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Hannah M.' },
      datePublished: '2025-10',
      reviewRating: { '@type': 'Rating', ratingValue: '5' },
      reviewBody: "We didn't speak for two days. The sauna, the lake, the pines. Everything they said and nothing they didn't.",
    },
    {
      '@type': 'Review',
      author: { '@type': 'Person', name: 'Daniel K.' },
      datePublished: '2025-03',
      reviewRating: { '@type': 'Rating', ratingValue: '5' },
      reviewBody: "The phone went in a drawer on Friday. Didn't come out until Sunday — felt better than I had in six months.",
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Can we bring our dog?', acceptedAnswer: { '@type': 'Answer', text: 'Dogs are welcome in three of our six Forest Villas for a one-time $75 cleaning fee. The House is not dog-friendly. Trails are all dog-friendly leashed.' } },
    { '@type': 'Question', name: 'What should I pack?', acceptedAnswer: { '@type': 'Answer', text: "Whatever you'd bring to a friend's lake house. A headlamp. Bug spray in summer. A sweater even in July — nights cool fast." } },
    { '@type': 'Question', name: "How's cell reception?", acceptedAnswer: { '@type': 'Answer', text: 'Honest answer: patchy. Verizon works in about half the property. We have Wi-Fi in The House and at the sauna. The Forest Villas are intentionally offline.' } },
    { '@type': 'Question', name: 'When is the best time to come?', acceptedAnswer: { '@type': 'Answer', text: 'October–November for pine gold. March–April for bird migration. July–August for lake swimming. December–February is our quietest — and cheapest.' } },
    { '@type': 'Question', name: "What's your cancellation policy?", acceptedAnswer: { '@type': 'Answer', text: 'Full refund 14 days out. 50% refund 7–13 days. No refund inside 7 days.' } },
    { '@type': 'Question', name: 'Are kids welcome?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. The House sleeps families — four bedrooms, bunks in one. Forest Villas are couples-first but kids over ten are fine.' } },
    { '@type': 'Question', name: 'Can we host an event here?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — weddings up to 40, retreats and buyouts up to 20. We have a dedicated planner.' } },
  ],
};

export default function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(resort) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}

/* Breadcrumb helper for stay detail pages */
export function StayBreadcrumb({ name, slug }: { name: string; slug: string }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Horizons Sandhills', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Stays', item: `${SITE_URL}/#stays` },
      { '@type': 'ListItem', position: 3, name, item: `${SITE_URL}/stays/${slug}` },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
