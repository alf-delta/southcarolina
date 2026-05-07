const SITE_URL = 'https://horizonssandhills.com';

const resort = {
  '@context': 'https://schema.org',
  '@type': ['Resort', 'LodgingBusiness'],
  '@id': `${SITE_URL}/#resort`,
  name: 'Horizons Sandhills',
  description:
    'Premium nature retreat on 126 private acres of longleaf pine savanna in the Carolina Sandhills. Private 18-acre lake, wood-fired sauna, six Forest Villas, and The House — 90 minutes from Charlotte.',
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
  smokingAllowed: false,
  numberOfRooms: 7,
  currenciesAccepted: 'USD',
  paymentAccepted: 'Credit Card, Cash',
  tourBookingPage: `${SITE_URL}/#reserve`,
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Private 18-acre lake', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Wood-fired lakeside sauna', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Canoes & paddleboards', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Twelve miles of hiking trails', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Outdoor firepit', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Stargazing chairs', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'E-bikes', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Peach orchard on property', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Welcome pantry box', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Starlink Wi-Fi (The House & sauna)', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Personal host concierge', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Private fishing lake', value: true },
  ],
  image: [
    `${SITE_URL}/images/sandhills/Villa.webp`,
    `${SITE_URL}/images/sandhills/house.webp`,
    `${SITE_URL}/images/sandhills/land.webp`,
    `${SITE_URL}/images/sandhills/canoes.webp`,
    `${SITE_URL}/images/sandhills/sauna_session.webp`,
  ],
  containsPlace: [
    {
      '@type': 'Accommodation',
      '@id': `${SITE_URL}/stays/boxble-villa#accommodation`,
      name: 'The Forest Villa',
      description:
        'Private lakefront villa with king bed, en-suite bathroom, outdoor deck, Marshall speaker, and Weber grill. Six villas spaced so you cannot see your neighbor. Intentionally offline — no Wi-Fi.',
      url: `${SITE_URL}/stays/boxble-villa`,
      image: [
        `${SITE_URL}/images/villa/01_Exterior/1.webp`,
        `${SITE_URL}/images/villa/02_Interior_Casita/1.webp`,
        `${SITE_URL}/images/villa/03_Terrace/1.webp`,
      ],
      occupancy: { '@type': 'QuantitativeValue', maxValue: 2 },
      bed: { '@type': 'BedDetails', typeOfBed: 'King size bed', numberOfBeds: 1 },
      numberOfBathroomsTotal: 1,
      numberOfBedrooms: 1,
      petsAllowed: true,
      smokingAllowed: false,
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Private deck with lake view', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'En-suite bathroom', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Marshall Bluetooth speaker', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Weber grill on deck', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Brooklinen linens', value: true },
      ],
      offers: {
        '@type': 'Offer',
        price: '609',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '609',
          priceCurrency: 'USD',
          unitText: 'NIGHT',
        },
      },
    },
    {
      '@type': 'Accommodation',
      '@id': `${SITE_URL}/stays/the-house#accommodation`,
      name: 'The House',
      description:
        'Flagship lakeside property sleeping eight. Four bedrooms, full kitchen, firepit deck, Starlink Wi-Fi. For families and groups. Exclusive buyout of the entire main property.',
      url: `${SITE_URL}/stays/the-house`,
      image: [
        `${SITE_URL}/images/sandhills/house.webp`,
      ],
      occupancy: { '@type': 'QuantitativeValue', maxValue: 8 },
      numberOfBathroomsTotal: 3,
      numberOfBedrooms: 4,
      smokingAllowed: false,
      amenityFeature: [
        { '@type': 'LocationFeatureSpecification', name: 'Full kitchen', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Lakeside deck with firepit', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Starlink Wi-Fi', value: true },
        { '@type': 'LocationFeatureSpecification', name: 'Dining for 8+', value: true },
      ],
      offers: {
        '@type': 'Offer',
        price: '1200',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: '1200',
          priceCurrency: 'USD',
          unitText: 'NIGHT',
        },
      },
    },
  ],
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Can we bring our dog?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Dogs are welcome in three of our six Forest Villas for a one-time $75 cleaning fee. The House is not dog-friendly. Trails are all dog-friendly leashed.',
      },
    },
    {
      '@type': 'Question',
      name: 'What should I pack?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: "Whatever you'd bring to a friend's lake house. A headlamp. Bug spray in summer. A sweater even in July — nights cool fast.",
      },
    },
    {
      '@type': 'Question',
      name: "How's cell reception?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Honest answer: patchy. Verizon works in about half the property. We have Wi-Fi in The House and at the sauna. The Forest Villas are intentionally offline.',
      },
    },
    {
      '@type': 'Question',
      name: 'When is the best time to visit Horizons Sandhills?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'October–November for pine gold. March–April for bird migration. July–August for lake swimming. December–February is our quietest — and cheapest.',
      },
    },
    {
      '@type': 'Question',
      name: "What's your cancellation policy?",
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Full refund 14 days out. 50% refund 7–13 days. No refund inside 7 days.',
      },
    },
    {
      '@type': 'Question',
      name: 'Are kids welcome?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes. The House sleeps families — four bedrooms, bunks in one. Forest Villas are couples-first but kids over ten are fine.',
      },
    },
    {
      '@type': 'Question',
      name: 'Can we host a wedding or retreat at Horizons Sandhills?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Yes — weddings up to 40, retreats and buyouts up to 20. We have a dedicated planner. Contact us to discuss your event.',
      },
    },
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
