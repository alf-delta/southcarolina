import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { UserCheck, Wifi, Gem } from 'lucide-react';
import Button from '../primitives/Button';
import { sandhillsData } from '../data/sandhills';
import GalleryModal from './GalleryModal';

// ── Card data ─────────────────────────────────────────────────────────────────

const COMFORT_CARDS = [
  {
    image:    '/images/comfort/brooklinen.webp',
    title:    'Cloud Linens',
    note:     'Brooklinen · 480 thread count',
    headline: 'The kind of sheets you try to take home.',
    body:     "Brooklinen's Luxe Sateen — 480 thread count, long-staple cotton, finished to a weight that actually holds you. The kind of linen most hotels promise and few deliver. On every bed, every stay. You will notice when you get back to yours.",
  },
  {
    image:    '/images/comfort/marshall.webp',
    title:    'Private Orchestra',
    note:     'Marshall Acton III · Bluetooth 5.0',
    headline: 'Eighty watts. Nowhere to be.',
    body:     'The Marshall Acton III does not go anywhere. It sits on the shelf and fills the room. Eighty watts through three drivers — two tweeters and a Class D woofer — tuned for the kind of listening you do when you are not in a hurry. Bluetooth 5.0 from the bed, the bath, or the deck through the open door. Analogue inputs for whatever you brought. The knobs are brass. It has been here since opening day.',
  },
  {
    image:    '/images/comfort/appliences.webp',
    title:    'Curated Kitchen',
    note:     'Nespresso · SMEG · design icons',
    headline: 'Everything already here.',
    body:     'Your morning begins with impeccable rituals, surrounded by design icons. A Nespresso machine pulls the perfect shot before you have finished waking up. A SMEG kettle stands beside it — five-star hotel aesthetics on a kitchen counter in the middle of a forest. Every detail here was chosen deliberately. Every detail underscores the quality of the stay.',
  },
  {
    image:    '/images/comfort/weber.webp',
    title:    'Deck & Grill',
    note:     'Weber kettle · lake view',
    headline: 'Your own outdoor kitchen above the water.',
    body:     'The Weber kettle has been on the deck since opening day and still runs clean. Charcoal for the evenings worth slowing down. The table seats four. The view is the lake. Nobody is anywhere near you.',
  },
  {
    image:    '/images/comfort/firepit.webp',
    title:    'The Ember Hour',
    note:     'Fire pit · open sky',
    headline: 'The night starts here.',
    body:     'Wood is split and stacked beside the pit before you arrive. The chairs recline to the angle required for serious stargazing. No light pollution within eight miles — on clear nights you can count satellites. The fire burns for three hours on a standard load. There is no schedule. Stay as long as the wood holds.',
  },
] as const;

const EXPERIENCE_CARDS = [
  {
    image:    '/images/sandhills/sauna_session.webp',
    title:    'Sauna',
    note:     'Wood-fired · lakeside',
    badge:    'Best wild spa ever',
    headline: 'The ritual the Romans knew. You rediscover it here.',
    body:     "Wood-fired to 194 °F. The sauna sits on the water — heat, then cold, then silence. Step off the dock into the lake. Two thousand years of the same ritual, still unmatched.",
    schedule: 'Open daily · 6 am – 11 pm',
    location: 'Lakeside sauna pavilion',
    points:   ['Wood-fired, reaches 194 °F in 40 min', 'Cold plunge in the lake, steps away', 'Seats 6 · towels provided', 'No booking needed'],
  },
  {
    image:    '/qaYcANUQR-PNzw3QPCqKA_uEzp7Ijh.jpg',
    title:    'The lake',
    note:     '18 acres · private · no motor boats',
    badge:    'Your ocean. No salt, no strangers.',
    headline: 'Sixty Olympic pools. Every single one of them yours.',
    body:     'Eighteen acres of still, clean water — private to our guests, always. No jet skis, no strangers, no one doing cannonballs near your kayak. Just you, the herons, and a surface so calm in the morning it reflects the pines like a mirror. Go for a swim. Take a canoe. Sit on the dock and do absolutely nothing. All three are correct answers.',
    schedule: 'Sunrise to sunset',
    location: 'Main dock, north shore',
    points:   ['18 acres of private lake', 'No motor boats — ever', '2 Kevlar canoes · 2 paddleboards on the dock', 'Swimming, fishing, floating — all welcome'],
  },
  {
    image:    '/images/sandhills/twelve_miles.webp',
    title:    'Trail',
    note:     'Twelve miles · marked',
    badge:    '12 miles. Zero treadmills.',
    headline: 'Into the pines.',
    body:     'Twelve miles of marked trail through longleaf pine savanna. Four trailheads across the property. The creek loop is the one worth finding. Illustrated map in your cabin.',
    schedule: 'All day · self-guided',
    location: '4 trailheads across the property',
    points:   ['Illustrated map in your cabin', 'Longleaf pine savanna + creek loop', 'Easy to moderate grade', 'Ends at a creek worth finding'],
  },
  {
    image:    '/images/sandhills/fishing.webp',
    title:    'Fishing',
    note:     'Catch & release · no license',
    badge:    'Still in there. Go get it.',
    headline: 'Cast a line.',
    body:     'Bass, bream, catfish. Rods and tackle at the dock box. No fishing license required on private water. Dawn and dusk are the best windows. Catch-and-release only.',
    schedule: 'Dawn & dusk · best windows',
    location: 'South dock + creek mouth',
    points:   ['Bass, bream, catfish in the lake', 'Rods & tackle available at the dock box', 'Catch-and-release only', 'No license required on private water'],
  },
  {
    image:    '/images/bikes.webp',
    title:    'E-bikes',
    note:     'Gravel & trail · all day',
    badge:    'Tour de Sandhills.',
    headline: 'Twelve miles on two wheels.',
    body:     'Four gravel bikes and two trail bikes on property. Helmets, locks, and a printed route map included. Twelve miles of marked paths. The morning lake loop takes forty minutes.',
    schedule: 'All day · self-guided',
    location: 'Bike rack at the main cabin',
    points:   ['4 gravel bikes + 2 trail bikes on property', 'Helmets, locks, and a printed route map included', '12 miles of marked paths', 'Best morning ride: lake loop before 8 am'],
  },
  {
    image:    '/images/aKbo_jkSiGvo_scLOlbIM_BngwcJ7U.png',
    title:    'Peach orchard',
    note:     'On property · seasonal',
    badge:    'Picked this morning.',
    headline: 'The orchard is yours.',
    body:     'Rows of peach trees inside the property fence. In season, you pick your own — straight from the branch, still warm from the sun. The kind of fruit a grocery store has never stocked. Your host will tell you which rows are ready.',
    schedule: 'June – August · dawn to dusk',
    location: 'East field, five-minute walk from the main cabin',
    points:   ['Private orchard, guests only', 'Pick your own in season', 'Peaches available year-round from the welcome pantry', 'Jam, preserves, and fresh fruit on arrival'],
  },
  {
    image:    '/images/hiveboxx-65icrs88YYs-unsplash.jpg',
    title:    'Apiary',
    note:     '20 hives · 1M+ bees',
    badge:    'A million bees. All ours.',
    headline: 'Twenty hives. One million workers.',
    body:     'Our apiary runs twenty hives — over a million bees foraging the longleaf pine savanna, wildflowers, and clover within the property. The honey in your welcome pantry came from fifty feet away. Ask your host for a hive walk. Nets provided.',
    schedule: 'Hive walks by arrangement',
    location: 'Apiary meadow, south of the lake',
    points:   ['20 active hives on property', '1M+ bees · longleaf pine + wildflower honey', 'Honey in every welcome pantry', 'Guided hive walk available on request'],
  },
  {
    image:    '/images/XkTlrQ8rNu5Jhl58SsHSB_7By5mrT8.png',
    title:    'Farm tours',
    note:     'Local farms · 15–30 min away',
    badge:    'Where your food starts.',
    headline: 'The farms that feed this county.',
    body:     'The Sandhills region has been farming land for three hundred years. We work with a handful of local operations — heritage breed livestock, row crops, a working dairy — and can arrange a morning visit. Nothing curated, nothing performative. Just real people doing the work.',
    schedule: 'Morning visits · by arrangement',
    location: '15–30 min from the property',
    points:   ['Heritage breed livestock farms', 'Working dairy + row crop operations', 'Arranged through your host', 'Half-day or full-day options'],
  },
] as const;

const FISH_DATA = [
  {
    image:  '/images/fish/Largemouth Bass.webp',
    name:   'Largemouth Bass',
    type:   'predator',
    trait:  'Ambush hunter. Attacks from cover near snags and weeds, active during the day.',
    layer:  'Surface + shore cover · 0–2 m',
    bio:    '10–15%',
  },
  {
    image:  '/images/fish/Channel Catfish.webp',
    name:   'Channel Catfish',
    type:   'predator',
    trait:  'Nocturnal scavenger and active hunter. Navigates by smell, not sight.',
    layer:  'Bottom · 3–6 m',
    bio:    '8–12%',
  },
  {
    image:  '/images/fish/Bluegill.webp',
    name:   'Bluegill',
    type:   'forage',
    trait:  'Most numerous fish in the lake. Schooling species, primary forage base for bass.',
    layer:  'Mid-water · 1–3 m',
    bio:    '25–35%',
  },
  {
    image:  '/images/fish/Common Carp.webp',
    name:   'Common Carp',
    type:   'forage',
    trait:  'Roots in bottom silt, disturbs clarity, uproots aquatic vegetation.',
    layer:  'Near-bottom · 2–5 m',
    bio:    '15–20%',
  },
  {
    image:  '/images/fish/Creek Chub.webp',
    name:   'Creek Chub',
    type:   'forage',
    trait:  'Small schooling fish near the surface. Important link in the food chain.',
    layer:  'Upper · 0–1 m',
    bio:    '15–20%',
  },
  {
    image:  null,
    name:   'Other species',
    type:   'other',
    trait:  'Sunfish, shiners, and others.',
    layer:  '—',
    bio:    '~5%',
  },
] as const;

// const BEACH_ROWS = [
//   'A concierge who knows your reservation number, not your name.',
//   'Two hundred rooms. Your neighbors audible through the wall.',
//   "Checkout at eleven. Pool hours. A schedule you didn't ask for.",
//   'Resort fee, parking fee, amenity fee. The bill surprises no one more than you.',
// ];

// const HORIZONS_ROWS = [
//   'A host who knew your coffee order before you arrived.',
//   'Six villas. Your nearest neighbor is a rumor.',
//   'Stay as long as the wood holds. No checkout clock.',
//   'One price. Everything in it. No fine print.',
// ];

const PRIVATE_STATS = [
  { num: '6',  label: 'Villas',      desc: 'Never crowded'  },
  { num: '18', label: 'Lake acres',  desc: 'Not a pool'     },
  { num: '126', label: 'Acres',       desc: 'Nobody else.'  },
];

// ── Static bg helpers ─────────────────────────────────────────────────────────

const bgForest: React.CSSProperties = {
  backgroundColor: '#090c07',
  backgroundImage: [
    'radial-gradient(ellipse at 15% 75%, rgba(42,72,28,0.72) 0%, transparent 52%)',
    'radial-gradient(ellipse at 80% 20%, rgba(30,56,20,0.60) 0%, transparent 48%)',
    'radial-gradient(ellipse at 55% 50%, rgba(58,88,38,0.40) 0%, transparent 44%)',
    'radial-gradient(ellipse at 88% 78%, rgba(22,44,14,0.55) 0%, transparent 50%)',
    'radial-gradient(ellipse at 32% 22%, rgba(176,83,41,0.10) 0%, transparent 38%)',
  ].join(', '),
};

const bgComfort: React.CSSProperties = {
  backgroundColor: '#090706',
  backgroundImage: [
    'radial-gradient(ellipse at 18% 72%, rgba(200,80,10,0.42) 0%, transparent 55%)',
    'radial-gradient(ellipse at 78% 18%, rgba(160,55,8,0.36) 0%, transparent 50%)',
    'radial-gradient(ellipse at 52% 44%, rgba(220,110,15,0.26) 0%, transparent 45%)',
  ].join(', '),
};

const bgTerritory: React.CSSProperties = {
  backgroundColor: '#F2EDE3',
  backgroundImage: [
    'radial-gradient(ellipse at 12% 78%, rgba(176,83,41,0.16) 0%, transparent 48%)',
    'radial-gradient(ellipse at 82% 12%, rgba(169,124,82,0.22) 0%, transparent 50%)',
    'radial-gradient(ellipse at 58% 52%, rgba(201,169,110,0.13) 0%, transparent 44%)',
    'radial-gradient(ellipse at 36% 28%, rgba(62,79,58,0.07) 0%, transparent 40%)',
  ].join(', '),
};

const bgRooms: React.CSSProperties = {
  backgroundColor: '#0d0805',
  backgroundImage: [
    'radial-gradient(ellipse at 18% 68%, rgba(215,175,50,0.38) 0%, transparent 55%)',
    'radial-gradient(ellipse at 76% 18%, rgba(200,110,105,0.30) 0%, transparent 50%)',
    'radial-gradient(ellipse at 50% 42%, rgba(230,155,65,0.22) 0%, transparent 45%)',
  ].join(', '),
};

const bgOutdoor: React.CSSProperties = {
  backgroundColor: '#060408',
  backgroundImage: [
    'radial-gradient(ellipse at 18% 68%, rgba(40,30,180,0.22) 0%, transparent 55%)',
    'radial-gradient(ellipse at 76% 18%, rgba(140,20,160,0.18) 0%, transparent 50%)',
    'radial-gradient(ellipse at 50% 42%, rgba(180,25,55,0.15) 0%, transparent 45%)',
  ].join(', '),
};

// ── Main component ────────────────────────────────────────────────────────────

export default function VillaCascade() {
  const villa = sandhillsData.stays[0];

  const [galleryStartIdx, setGalleryStartIdx] = useState<number | null>(null);
  const [comfortIdx,    setComfortIdx]    = useState<number | null>(null);
  const [experienceIdx, setExperienceIdx] = useState<number | null>(null);
  const [nearbyIdx,     setNearbyIdx]     = useState<number | null>(null);
  const [contactOpen,   setContactOpen]   = useState(false);

  useEffect(() => {
    const handler = () => setGalleryStartIdx(0);
    window.addEventListener('open-gallery', handler);
    return () => window.removeEventListener('open-gallery', handler);
  }, []);

  // ── Scroll-linked background crossfade ──────────────────────────────────────
  const act1Ref = useRef<HTMLDivElement>(null);
  const act2Ref = useRef<HTMLDivElement>(null);
  const act3Ref = useRef<HTMLDivElement>(null);
  const act4Ref = useRef<HTMLDivElement>(null);
  const act5Ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress: p1 } = useScroll({ target: act1Ref, offset: ['start end', 'end start'] });
  const { scrollYProgress: p2 } = useScroll({ target: act2Ref, offset: ['start end', 'end start'] });
  const { scrollYProgress: p3 } = useScroll({ target: act3Ref, offset: ['start end', 'end start'] });
  const { scrollYProgress: p4 } = useScroll({ target: act4Ref, offset: ['start end', 'end start'] });
  const { scrollYProgress: p5 } = useScroll({ target: act5Ref, offset: ['start end', 'end start'] });

  // Act 1: visible from the start, fades out as act 2 takes over
  const o1 = useTransform(p1, [0, 0.80, 1], [1, 1, 0]);
  // Acts 2–4: crossfade in and out
  const o2 = useTransform(p2, [0, 0.14, 0.86, 1], [0, 1, 1, 0]);
  const o3 = useTransform(p3, [0.10, 0.26, 1], [0, 1, 1]);
  const o4 = useTransform(p4, [0, 0.56, 0.86, 1], [0, 1, 1, 0]);
  // Act 4 heading: dark on light bg → linen as bg darkens
  const act4HeadingColor = useTransform(p4, [0, 0.34, 0.49], ['rgba(31,36,32,0.96)', 'rgba(31,36,32,0.96)', 'rgba(231,222,199,0.96)']);
  const act4SubColor     = useTransform(p4, [0, 0.34, 0.49], ['rgba(31,36,32,0.55)', 'rgba(31,36,32,0.55)', 'rgba(231,222,199,0.45)']);

  // Act 3 heading: linen on dark bg → ink as bone bg fades in
  const act3HeadingColor = useTransform(p3, [0.10, 0.28], ['rgba(231,222,199,0.96)', 'rgba(31,36,32,0.96)']);
  const act3SubColor     = useTransform(p3, [0.10, 0.28], ['rgba(231,222,199,0.55)', 'rgba(31,36,32,0.55)']);

  // Act 5: fades in, stays visible till end of section
  const o5 = useTransform(p5, [0, 0.14, 1], [0, 1, 1]);


  return (
    <>
      {/* Intro strip */}
      <div className="w-full flex items-center justify-center" style={{ height: '100px', background: '#EAE3D3' }}>
        <p className="flex items-baseline gap-[10px] flex-wrap justify-center px-6">
          <span style={{ fontFamily: 'Montserrat, ui-sans-serif', fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)', fontWeight: 300, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(20,16,10,0.38)' }}>
            Where the
          </span>
          <span className="font-display italic" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50', fontWeight: 380, fontSize: 'clamp(2.2rem, 3.8vw, 3.2rem)', letterSpacing: '-0.02em', lineHeight: 1, color: '#B05329' }}>
            longleaf pines
          </span>
          <span style={{ fontFamily: 'Montserrat, ui-sans-serif', fontSize: 'clamp(0.85rem, 1.3vw, 1.05rem)', fontWeight: 300, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(20,16,10,0.38)' }}>
            run out of road.
          </span>
        </p>
      </div>

      <section id="stays" data-zone="dark" className="text-linen relative" style={{ backgroundColor: '#090706' }}>

        {/* ── Scroll-linked gradient background ───────────────────────────── */}
        {/* sticky height-0 holder stays at top of viewport; abs child fills 100vh */}
        <div style={{ position: 'sticky', top: 0, height: 0, zIndex: 0, overflow: 'visible', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh' }}>
            <motion.div style={{ position: 'absolute', inset: 0, opacity: o1, ...bgForest }} />
            <motion.div style={{ position: 'absolute', inset: 0, opacity: o2, ...bgComfort }} />
            <motion.div style={{ position: 'absolute', inset: 0, opacity: o3, ...bgTerritory }} />
            <motion.div style={{ position: 'absolute', inset: 0, opacity: o4, ...bgRooms }} />
            <motion.div style={{ position: 'absolute', inset: 0, opacity: o5, ...bgOutdoor }} />

          </div>
        </div>

        {/* ── Act 1 — Villa ───────────────────────────────────────────────── */}
        <div
          ref={act1Ref}
          className="relative h-screen flex flex-col px-6 pb-6 pt-[72px] md:px-12 md:pb-12 md:pt-[72px] lg:px-16 lg:pb-16 lg:pt-[72px]"
          style={{ zIndex: 1 }}
        >
          <div className="flex flex-col md:flex-row items-stretch flex-1 min-h-0" style={{ maxWidth: '82%', marginLeft: 'auto', marginRight: 'auto', width: '100%' }}>
          {/* Photo frame */}
          <div className="flex-1 min-w-0 rounded-2xl overflow-hidden" style={{ minHeight: 0 }}>
            <div className="relative w-full h-full overflow-hidden rounded-xl cursor-pointer group" onClick={() => setGalleryStartIdx(0)}>
              <img src="/qGBP68_WYGc6iPdsayAE4_EqosgDho.jpg" alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" fetchPriority="high" decoding="async" />
            </div>
          </div>

          {/* Right column: info card + photo tile */}
          <div className="w-full md:w-[38%] lg:w-[34%] shrink-0 flex flex-col gap-[5px] pl-0 md:pl-[5px] pt-[5px] md:pt-0" style={{ minHeight: 0 }}>

            {/* Info card */}
            <div className="flex-1 rounded-2xl flex flex-col justify-between p-6 md:p-8" style={{ background: 'rgba(242,237,227,0.06)', border: '1px solid rgba(242,237,227,0.08)', minHeight: 0 }}>
              <div className="mb-5 md:mb-6">
                <h2 className="font-display text-linen" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0', fontWeight: 380, fontSize: 'clamp(1.6rem, 3.5vw, 2.8rem)', lineHeight: 1.0, letterSpacing: '-0.025em' }}>
                  {villa.name}
                </h2>
                <p className="font-eyebrow text-signal uppercase mt-2" style={{ fontSize: '13px', letterSpacing: '0.24em' }}>Flagship of the wild</p>
              </div>
              <div>
                <div className="flex flex-wrap items-end gap-x-6 gap-y-4 mb-6">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-[5px]">
                      <svg viewBox="0 0 20 20" fill="currentColor" className="text-linen/60 shrink-0" style={{ width: '1.2rem', height: '1.2rem' }}>
                        <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 1 1 14 0H3z" />
                      </svg>
                      <span className="font-display text-linen" style={{ fontVariationSettings: '"opsz" 48', fontWeight: 380, fontSize: 'clamp(1.4rem, 2.2vw, 1.9rem)', lineHeight: 1, letterSpacing: '-0.02em' }}>4</span>
                    </div>
                    <span className="font-eyebrow text-linen/40 uppercase" style={{ fontSize: '9px', letterSpacing: '0.22em' }}>up to<br />Guests</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <UserCheck aria-hidden className="text-linen/80" style={{ width: 'clamp(1.4rem, 2.2vw, 1.9rem)', height: 'clamp(1.4rem, 2.2vw, 1.9rem)' }} strokeWidth={1.25} />
                    <span className="font-eyebrow text-linen/40 uppercase" style={{ fontSize: '9px', letterSpacing: '0.22em' }}>Personal<br />host</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Wifi aria-hidden className="text-linen/80" style={{ width: 'clamp(1.4rem, 2.2vw, 1.9rem)', height: 'clamp(1.4rem, 2.2vw, 1.9rem)' }} strokeWidth={1.25} />
                    <span className="font-eyebrow text-linen/40 uppercase" style={{ fontSize: '9px', letterSpacing: '0.22em' }}>Starlink<br />Wi-Fi</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Gem aria-hidden className="text-linen/80" style={{ width: 'clamp(1.4rem, 2.2vw, 1.9rem)', height: 'clamp(1.4rem, 2.2vw, 1.9rem)' }} strokeWidth={1.25} />
                    <span className="font-eyebrow text-linen/40 uppercase" style={{ fontSize: '9px', letterSpacing: '0.22em' }}>High-End<br />Appointments</span>
                  </div>
                </div>
                <p className="text-linen/55 mb-5" style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui', fontSize: 'clamp(0.75rem, 0.9vw, 0.85rem)', lineHeight: 1.68 }}>
                  {villa.description}
                </p>
                <div className="flex flex-wrap gap-3 items-center">
                  <Button href="#reserve" variant="primary">Check availability</Button>
                  <button onClick={() => setGalleryStartIdx(0)} className="group font-eyebrow text-[10px] uppercase tracking-[0.22em] text-linen/65 hover:text-linen transition-colors flex items-center gap-1.5 pb-px border-b border-linen/20 hover:border-linen/50">
                    View gallery
                    <span className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" style={{ fontSize: 9 }}>↗</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Photo tile */}
            <div className="flex-[1] rounded-2xl overflow-hidden relative cursor-pointer group" style={{ minHeight: 0 }}
              onClick={() => setGalleryStartIdx(villa.rooms.slice(0, 2).reduce((a, r) => a + r.photos.length, 0))}>
              <img src={villa.rooms[2]?.photos[0] ?? '/images/sandhills/canoes.webp'} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" loading="lazy" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,6,4,0.5) 0%, transparent 50%)' }} />
            </div>

          </div>
          </div>
        </div>

        {/* ── Act 2 — Comfort ─────────────────────────────────────────────── */}
        <div ref={act2Ref} className="relative min-h-screen flex flex-col p-6 md:p-12 lg:p-16" style={{ zIndex: 1 }}>
          <div style={{ maxWidth: '82%', marginLeft: 'auto', marginRight: 'auto' }}>
          <div className="pt-4 md:pt-6 max-w-[52rem]">
            <p className="font-eyebrow text-signal uppercase mb-5 md:mb-6" style={{ fontSize: '11px', letterSpacing: '0.26em' }}>The standard you deserve</p>
            <h2 className="font-display text-linen mb-6 md:mb-8" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0', fontWeight: 380, fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
              A five-star hotel.<br />Except the hotel is a{' '}
              <img src="/images/f-orest.webp" alt="forest" className="inline-block" style={{ height: '1.2em', width: 'auto', verticalAlign: '0em', borderRadius: '0.12em' }} />.
            </h2>
            <p className="text-linen/60 max-w-[46rem]" style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui', fontSize: 'clamp(0.88rem, 1.1vw, 1rem)', lineHeight: 1.72 }}>
              We took everything a great hotel does well — the linens, the espresso, the speakers, the grill on the deck — and placed it somewhere no hotel could afford to be. A hundred and twenty-six acres of longleaf pine. A private lake with nobody else on it. The kind of quiet that makes you realize how much noise you were carrying.
            </p>
          </div>
          <div style={{ marginTop: '40px' }}>
            <div className="grid gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {/* Placeholder cell */}
              <div className="rounded-xl flex flex-col justify-between p-6 md:p-8" style={{ height: 'clamp(192px, 31vh, 308px)', background: 'rgba(242,237,227,0.06)', border: '1px solid rgba(242,237,227,0.08)' }}>
                <p className="font-eyebrow text-signal uppercase" style={{ fontSize: '13px', letterSpacing: '0.22em' }}>What's included</p>
                <p className="font-display text-linen" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 30', fontWeight: 380, fontStyle: 'italic', fontSize: 'clamp(1.5rem, 2.4vw, 2.2rem)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
                  The standard<br />you deserve
                </p>
              </div>
              {COMFORT_CARDS.map((card, i) => (
                <button key={card.title} onClick={() => setComfortIdx(i)} className="rounded-xl overflow-hidden relative group text-left" style={{ height: 'clamp(192px, 31vh, 308px)' }}>
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-12" style={{ background: 'linear-gradient(to top, rgba(8,6,4,0.97) 0%, rgba(8,6,4,0.65) 55%, transparent 100%)' }}>
                    <p className="font-eyebrow text-signal uppercase mb-[5px]" style={{ fontSize: '9px', letterSpacing: '0.24em' }}>{card.note}</p>
                    <p className="font-display text-linen leading-tight" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 20', fontWeight: 380, fontStyle: 'italic', fontSize: 'clamp(1.05rem, 1.9vw, 1.4rem)', letterSpacing: '-0.01em' }}>{card.title}</p>
                  </div>
                  <div className="absolute inset-0 ring-1 ring-inset ring-linen/0 group-hover:ring-linen/20 rounded-xl transition-all duration-300" />
                </button>
              ))}
            </div>
          </div>
          </div>
        </div>

        {/* ── Act 3 — Experience ──────────────────────────────────────────── */}
        <div
          ref={act3Ref}
          data-zone="light"
          className="relative min-h-screen flex flex-col justify-between p-6 md:p-12 lg:p-16"
          style={{ zIndex: 1 }}
        >

          <div className="relative pt-4 md:pt-6 max-w-[52rem]" style={{ zIndex: 1 }}>
            <p className="font-eyebrow text-signal uppercase mb-5 md:mb-6" style={{ fontSize: '11px', letterSpacing: '0.26em' }}>What's outside</p>
            <motion.h2 className="font-display mb-6 md:mb-8" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0', fontWeight: 380, fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: act3HeadingColor }}>
              126 acres.<br />All of it yours.
            </motion.h2>
            <motion.p className="max-w-[46rem]" style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui', fontSize: 'clamp(0.88rem, 1.1vw, 1rem)', lineHeight: 1.72, color: act3SubColor }}>
              We built on eleven of the hundred and twenty-six acres. The rest is longleaf pine savanna, a private lake, twelve miles of trail, and the kind of silence that takes a day to stop feeling strange. Everything below is included. Nothing requires a guide or a reservation.
            </motion.p>
          </div>

          <div className="relative" style={{ zIndex: 1 }}>
            <p className="font-eyebrow text-signal uppercase mb-5" style={{ fontSize: '11px', letterSpacing: '0.26em' }}>What's included</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
              {([
                { kind: 'placeholder' as const },
                ...EXPERIENCE_CARDS.slice(0, 4).map((card, i) => ({ kind: 'card' as const, card, idx: i })),
                { kind: 'card' as const, card: EXPERIENCE_CARDS[4], idx: 4 },
                { kind: 'placeholder' as const },
                ...EXPERIENCE_CARDS.slice(5).map((card, i) => ({ kind: 'card' as const, card, idx: i + 5 })),
              ]).map((slot, si) => slot.kind === 'placeholder' ? (
                <div key={`ph-${si}`} className="flex flex-col">
                  <div className="rounded-xl flex flex-col justify-end p-5" style={{ position: 'relative', overflow: 'hidden', height: 'clamp(259px, calc(35vh + 39px), 399px)', background: si === 0 ? 'linear-gradient(135deg, rgba(176,83,41,0.38) 0%, rgba(201,169,110,0.22) 55%, rgba(212,192,155,0.12) 100%)' : 'linear-gradient(160deg, #3A5218 0%, #4A6820 45%, #2E4A18 100%)', border: si === 0 ? '1px solid rgba(31,36,32,0.12)' : '1px solid rgba(60,40,16,0.5)' }}>
                    {si === 0 ? (<>
                      {/* Sun watermark */}
                      <svg viewBox="0 0 160 160" aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -52%)', width: '85%', height: '85%', opacity: 0.1, pointerEvents: 'none' }}>
                        {/* Rays */}
                        {Array.from({ length: 16 }, (_, i) => {
                          const angle = (i / 16) * Math.PI * 2;
                          const r1 = 52, r2 = 76;
                          return (
                            <line key={i}
                              x1={80 + Math.cos(angle) * r1} y1={80 + Math.sin(angle) * r1}
                              x2={80 + Math.cos(angle) * r2} y2={80 + Math.sin(angle) * r2}
                              stroke="#1F2420" strokeWidth={i % 2 === 0 ? 2 : 1.2} strokeLinecap="round"
                            />
                          );
                        })}
                        {/* Core circle */}
                        <circle cx="80" cy="80" r="42" fill="#1F2420" />
                        {/* Inner highlight ring */}
                        <circle cx="80" cy="80" r="42" fill="none" stroke="#1F2420" strokeWidth="3" />
                      </svg>
                      <p className="font-eyebrow uppercase" style={{ position: 'relative', fontSize: '10px', letterSpacing: '0.24em', color: '#B05329', marginBottom: '10px' }}>No tab. No clock.</p>
                      <p className="font-display italic" style={{ position: 'relative', fontVariationSettings: '"opsz" 48, "SOFT" 30', fontWeight: 500, fontSize: 'clamp(1.25rem, 1.8vw, 1.7rem)', lineHeight: 1.12, letterSpacing: '-0.02em', color: '#1F2420' }}>Everything here<br />is already yours.</p>
                    </>) : (<>
                      {/* Leaf watermark */}
                      <svg
                        viewBox="0 0 160 260"
                        aria-hidden="true"
                        style={{
                          position: 'absolute', top: '50%', left: '50%',
                          transform: 'translate(-44%, -52%) rotate(-18deg)',
                          width: '88%', height: '88%',
                          opacity: 0.08, pointerEvents: 'none',
                        }}
                      >
                        {/* Stem */}
                        <line x1="80" y1="248" x2="80" y2="262" stroke="rgba(231,222,199,1)" strokeWidth="2.5" strokeLinecap="round" />
                        {/* Leaf body */}
                        <path
                          d="M80,8 C110,20 145,65 148,118 C151,172 128,222 80,244 C32,222 9,172 12,118 C15,65 50,20 80,8 Z"
                          fill="rgba(231,222,199,1)"
                        />
                        {/* Central midrib */}
                        <line x1="80" y1="8" x2="80" y2="244" stroke="rgba(20,28,16,0.45)" strokeWidth="2.2" />
                        {/* Lateral veins — left */}
                        <path d="M80,60  Q58,72  36,78"  fill="none" stroke="rgba(20,28,16,0.35)" strokeWidth="1.6" />
                        <path d="M80,90  Q55,105 30,112" fill="none" stroke="rgba(20,28,16,0.35)" strokeWidth="1.6" />
                        <path d="M80,122 Q55,138 28,146" fill="none" stroke="rgba(20,28,16,0.35)" strokeWidth="1.6" />
                        <path d="M80,154 Q56,170 32,178" fill="none" stroke="rgba(20,28,16,0.35)" strokeWidth="1.6" />
                        <path d="M80,186 Q60,200 40,206" fill="none" stroke="rgba(20,28,16,0.35)" strokeWidth="1.6" />
                        {/* Lateral veins — right */}
                        <path d="M80,60  Q102,72 124,78"  fill="none" stroke="rgba(20,28,16,0.35)" strokeWidth="1.6" />
                        <path d="M80,90  Q105,105 130,112" fill="none" stroke="rgba(20,28,16,0.35)" strokeWidth="1.6" />
                        <path d="M80,122 Q105,138 132,146" fill="none" stroke="rgba(20,28,16,0.35)" strokeWidth="1.6" />
                        <path d="M80,154 Q104,170 128,178" fill="none" stroke="rgba(20,28,16,0.35)" strokeWidth="1.6" />
                        <path d="M80,186 Q100,200 120,206" fill="none" stroke="rgba(20,28,16,0.35)" strokeWidth="1.6" />
                      </svg>
                      <p className="font-eyebrow uppercase" style={{ position: 'relative', fontSize: '10px', letterSpacing: '0.24em', color: 'rgba(212,128,78,0.85)', marginBottom: '10px' }}>Grown here</p>
                      <p className="font-display italic" style={{ position: 'relative', fontVariationSettings: '"opsz" 48, "SOFT" 30', fontWeight: 500, fontSize: 'clamp(1.25rem, 1.8vw, 1.7rem)', lineHeight: 1.12, letterSpacing: '-0.02em', color: 'rgba(231,222,199,0.95)' }}>The land feeds<br />the table.</p>
                    </>)}
                  </div>
                </div>
              ) : (
                <div key={slot.card.title} className="flex flex-col">
                  <div className="mb-[6px] w-full flex items-center justify-center" style={{ height: '33px', borderRadius: '8px', background: 'rgba(31,36,32,0.11)', border: '1px solid rgba(31,36,32,0.14)' }}>
                    <span className="font-display italic" style={{ fontVariationSettings: '"opsz" 20, "SOFT" 30', fontWeight: 520, fontSize: '15px', letterSpacing: '-0.01em', color: '#B05329', lineHeight: 1 }}>{slot.card.badge}</span>
                  </div>
                  <button onClick={() => setExperienceIdx(slot.idx)} className="w-full rounded-xl overflow-hidden relative group text-left" style={{ height: 'clamp(220px, 35vh, 360px)' }}>
                    <img src={slot.card.image} alt={slot.card.title} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" />
                    <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-12" style={{ background: 'linear-gradient(to top, rgba(8,6,4,0.97) 0%, rgba(8,6,4,0.65) 55%, transparent 100%)' }}>
                      <p className="font-eyebrow text-signal uppercase mb-[5px]" style={{ fontSize: '9px', letterSpacing: '0.24em' }}>{slot.card.note}</p>
                      <p className="font-display text-linen leading-tight" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 20', fontWeight: 380, fontStyle: 'italic', fontSize: 'clamp(1.05rem, 1.9vw, 1.4rem)', letterSpacing: '-0.01em' }}>{slot.card.title}</p>
                    </div>
                    <div className="absolute inset-0 ring-1 ring-inset ring-linen/0 group-hover:ring-linen/20 rounded-xl transition-all duration-300" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Act 4 — Discovery ───────────────────────────────────────────── */}
        <div ref={act4Ref} className="relative min-h-screen flex flex-col justify-between p-6 md:p-12 lg:p-16" style={{ zIndex: 1 }}>
          <div className="pt-4 md:pt-6 max-w-[52rem]">
            <p className="font-eyebrow text-signal uppercase mb-5 md:mb-6" style={{ fontSize: '11px', letterSpacing: '0.26em' }}>What's nearby</p>
            <motion.h2 className="font-display mb-6 md:mb-8" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0', fontWeight: 380, fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: act4HeadingColor }}>
              Thirty minutes from here,<br />the world opens up.
            </motion.h2>
            <motion.p className="max-w-[46rem]" style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui', fontSize: 'clamp(0.88rem, 1.1vw, 1rem)', lineHeight: 1.72, color: act4SubColor }}>
              Camden, Cheraw, the Peedee River. A wildlife refuge the size of a small country. All within half an hour. Leave the property not because you have to — but because you want to.
            </motion.p>
          </div>
          <div>
            <p className="font-eyebrow text-signal uppercase mb-5" style={{ fontSize: '11px', letterSpacing: '0.26em' }}>Around you</p>
            <div className="flex gap-3">
              {sandhillsData.nearby.map((poi, i) => (
                <button key={poi.name} onClick={() => setNearbyIdx(i)} className="flex-1 min-w-0 rounded-xl overflow-hidden relative group text-left" style={{ height: 'clamp(280px, 44vh, 440px)' }}>
                  <img src={poi.image} alt={poi.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-12" style={{ background: 'linear-gradient(to top, rgba(8,6,4,0.97) 0%, rgba(8,6,4,0.65) 55%, transparent 100%)' }}>
                    <p className="font-eyebrow text-signal uppercase mb-[5px]" style={{ fontSize: '9px', letterSpacing: '0.24em' }}>{poi.distance}</p>
                    <p className="font-display text-linen leading-tight" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 20', fontWeight: 380, fontStyle: 'italic', fontSize: 'clamp(1.05rem, 1.9vw, 1.4rem)', letterSpacing: '-0.01em' }}>{poi.name}</p>
                  </div>
                  <div className="absolute inset-0 ring-1 ring-inset ring-linen/0 group-hover:ring-linen/20 rounded-xl transition-all duration-300" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Act 5 — The Sandhills Logic ─────────────────────────────────── */}
        <div ref={act5Ref} className="relative min-h-screen p-6 md:p-10 lg:p-12 flex flex-col justify-center" style={{ zIndex: 1 }}>

          {/* Grid texture */}
          <div aria-hidden="true" style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
            maskImage: 'radial-gradient(circle at 50% 45%, black, transparent 72%)',
            WebkitMaskImage: 'radial-gradient(circle at 50% 45%, black, transparent 72%)',
            opacity: 0.35,
          }} />

          {/* Stage card */}
          <div style={{
            position: 'relative', zIndex: 1,
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 0.72fr)',
            gap: 'clamp(24px, 4vw, 64px)',
            minHeight: 'calc(100vh - 96px)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '24px',
            padding: 'clamp(24px, 3.5vw, 52px)',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(0,0,0,0.08) 100%)',
            backdropFilter: 'blur(28px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(28px) saturate(1.4)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18)',
            overflow: 'hidden',
          }}>
            {/* Glass shine */}
            <div aria-hidden="true" style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0.03) 28%, transparent 52%)',
              borderRadius: '24px',
            }} />

            {/* ── Left column ── */}
            <div style={{ display: 'grid', gridTemplateRows: 'auto 1fr auto', gap: 'clamp(16px, 2.5vh, 32px)', minHeight: 0, paddingBottom: 'clamp(52px, 7vh, 84px)' }}>

              {/* Kicker */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#D4804E', textTransform: 'uppercase', letterSpacing: '0.38em', fontSize: '11px' }}>
                <span style={{ width: '38px', height: '1px', background: '#D4804E', flexShrink: 0 }} />
                The Sandhills Logic
              </div>

              {/* Hero type */}
              <div style={{ alignSelf: 'center', padding: 'clamp(16px,2.5vh,32px) 0 clamp(14px,2vh,24px)' }}>
                <h2 className="font-display" style={{
                  margin: 0,
                  fontVariationSettings: '"opsz" 144, "SOFT" 30, "WONK" 0',
                  fontWeight: 380,
                  fontSize: 'clamp(31px, 6.4vw, 104px)',
                  lineHeight: 0.84,
                  letterSpacing: '-0.055em',
                  color: 'rgba(231,222,199,0.96)',
                }}>
                  The beach got busy.
                  <span style={{ display: 'block', marginTop: '0.06em', color: 'rgba(231,222,199,0.32)', fontStyle: 'italic' }}>
                    The pines stayed quiet.
                  </span>
                </h2>

                <button
                  onClick={() => setContactOpen(true)}
                  className="group flex items-end justify-between gap-6 transition-all duration-300 hover:bg-signal w-full text-left"
                  style={{
                    marginTop: 'clamp(14px, 2.5vh, 28px)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    borderRadius: '14px',
                    padding: 'clamp(14px, 2vh, 22px) clamp(16px, 2vw, 28px)',
                    cursor: 'pointer',
                  }}
                >
                  <p className="font-display italic text-linen/60 group-hover:text-linen/90 transition-colors duration-300" style={{ fontVariationSettings: '"opsz" 24, "SOFT" 30', fontWeight: 380, fontSize: 'clamp(18px, 1.8vw, 28px)', lineHeight: 1.15, letterSpacing: '-0.03em', margin: 0 }}>
                    Six private villas on 126&nbsp;acres of pine, lake, and distance from the crowd.
                  </p>
                  <span className="font-eyebrow text-signal group-hover:text-linen transition-colors duration-300 shrink-0" style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', paddingBottom: '0.2em', whiteSpace: 'nowrap' }}>
                    Ready? Let's talk →
                  </span>
                </button>
              </div>

              {/* Proof strip */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', borderTop: '1px solid rgba(231,222,199,0.10)', borderBottom: '1px solid rgba(231,222,199,0.10)', background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}>
                {PRIVATE_STATS.map((s, i) => (
                  <div key={s.label} style={{ padding: 'clamp(22px, 3.2vh, 38px) clamp(20px, 2.4vw, 36px)', borderRight: i < 2 ? '1px solid rgba(231,222,199,0.10)' : undefined }}>
                    <span className="font-display" style={{ display: 'block', marginBottom: '10px', fontVariationSettings: '"opsz" 48', fontWeight: 380, fontSize: 'clamp(36px, 4.8vw, 76px)', lineHeight: 0.82, letterSpacing: '-0.055em', color: '#D4804E' }}>{s.num}</span>
                    <span style={{ display: 'block', color: 'rgba(231,222,199,0.45)', fontSize: '12px', letterSpacing: '0.26em', textTransform: 'uppercase', lineHeight: 1.5, fontFamily: 'Inter, system-ui, sans-serif' }}>{s.label}</span>
                    <span className="font-display italic" style={{ display: 'block', marginTop: '8px', color: i % 2 === 0 ? '#D4804E' : 'rgba(231,222,199,0.82)', fontVariationSettings: '"opsz" 20', fontWeight: 380, fontSize: 'clamp(17px, 1.5vw, 24px)', lineHeight: 1.1, letterSpacing: '-0.03em', fontStyle: 'italic' }}>{s.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right column ── */}
            <div style={{ minHeight: 0, borderRadius: '20px', overflow: 'hidden' }}>
              <img
                src="/tQujJzxhwVManasll_NAR_ggQ1SVvm.jpg"
                alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>

            {/* Footer note */}
            <p className="font-display italic hidden lg:block" style={{ position: 'absolute', left: 'clamp(24px, 3.5vw, 52px)', bottom: 'clamp(20px, 2.5vw, 36px)', maxWidth: '540px', fontVariationSettings: '"opsz" 18, "SOFT" 30', fontWeight: 380, fontSize: 'clamp(12px, 0.95vw, 15px)', lineHeight: 1.5, letterSpacing: '-0.01em', color: 'rgba(231,222,199,0.28)', margin: 0, pointerEvents: 'none' }}>
              People are not tired of water. They are tired of what the coast became: traffic, crowds, concrete, and commerce. The Sandhills keeps the water and removes the noise.
            </p>
          </div>
        </div>

      </section>

      {createPortal(
        <AnimatePresence>
          {galleryStartIdx !== null && <GalleryModal rooms={villa.rooms} startIndex={galleryStartIdx} onClose={() => setGalleryStartIdx(null)} />}
        </AnimatePresence>,
        document.body
      )}
      {createPortal(
        <AnimatePresence>
          {comfortIdx !== null && <ComfortModal cards={COMFORT_CARDS} startIdx={comfortIdx} onClose={() => setComfortIdx(null)} />}
        </AnimatePresence>,
        document.body
      )}
      {createPortal(
        <AnimatePresence>
          {experienceIdx !== null && <ExperienceModal cards={EXPERIENCE_CARDS} startIdx={experienceIdx} onClose={() => setExperienceIdx(null)} />}
        </AnimatePresence>,
        document.body
      )}
      {createPortal(
        <AnimatePresence>
          {nearbyIdx !== null && <NearbyModal pois={sandhillsData.nearby} startIdx={nearbyIdx} onClose={() => setNearbyIdx(null)} />}
        </AnimatePresence>,
        document.body
      )}
      {createPortal(
        <AnimatePresence>
          {contactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

// ── Shared nav bar ────────────────────────────────────────────────────────────

function ModalNavBar({ current, total, onPrev, onNext }: { current: number; total: number; onPrev: () => void; onNext: () => void }) {
  const ChevronL = () => (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M10.78 3.22a.75.75 0 010 1.06L7.06 8l3.72 3.72a.75.75 0 11-1.06 1.06L2.47 8.53a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z" />
    </svg>
  );
  const ChevronR = () => (
    <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
      <path d="M5.22 3.22a.75.75 0 011.06 0l4.25 4.25a.75.75 0 010 1.06l-4.25 4.25a.75.75 0 11-1.06-1.06L8.94 8 5.22 4.28a.75.75 0 010-1.06z" />
    </svg>
  );
  return (
    <div className="flex items-center justify-between border-t border-linen/[0.08] px-5 py-3 shrink-0">
      <button onClick={onPrev} disabled={current === 0} aria-label="Previous" className="flex items-center justify-center w-8 h-8 rounded-full bg-linen/[0.07] hover:bg-linen/15 text-linen/50 hover:text-linen disabled:opacity-20 disabled:pointer-events-none transition-all"><ChevronL /></button>
      <span className="font-eyebrow text-linen/35" style={{ fontSize: '10px', letterSpacing: '0.24em' }}>{String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      <button onClick={onNext} disabled={current === total - 1} aria-label="Next" className="flex items-center justify-center w-8 h-8 rounded-full bg-linen/[0.07] hover:bg-linen/15 text-linen/50 hover:text-linen disabled:opacity-20 disabled:pointer-events-none transition-all"><ChevronR /></button>
    </div>
  );
}

// ── Experience Modal ──────────────────────────────────────────────────────────

function ExperienceModal({ cards, startIdx, onClose }: { cards: typeof EXPERIENCE_CARDS; startIdx: number; onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(startIdx);
  const [fishOpen, setFishOpen] = useState(false);
  const card = cards[currentIdx];
  const isFishing = card.title === 'Fishing';

  function go(newIdx: number) { setFishOpen(false); setCurrentIdx(newIdx); }

  return (
    <motion.div className="fixed inset-0 z-[300] flex items-center justify-center gap-4 p-5 md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} onClick={onClose}>
      <div className="absolute inset-0 bg-night/80 backdrop-blur-md" />
      <motion.div layout="position" className="relative z-10 w-full max-w-3xl bg-nightWarm rounded-2xl overflow-hidden shadow-2xl shrink-0 flex flex-col" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 10 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div key={currentIdx} className="flex flex-col md:flex-row" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.2 } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
            <div className="w-full md:w-[42%] shrink-0 overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col p-8 md:p-10 overflow-y-auto" style={{ maxHeight: '70vh' }}>
              <p className="font-eyebrow text-signal uppercase mb-4" style={{ fontSize: '10px', letterSpacing: '0.26em' }}>{card.note}</p>
              <h2 className="font-display text-linen mb-5" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 30', fontWeight: 380, fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', lineHeight: 1.1, letterSpacing: '-0.015em' }}>{card.headline}</h2>
              <p className="text-linen/65 mb-6" style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui', fontSize: 'clamp(0.82rem, 1vw, 0.92rem)', lineHeight: 1.72 }}>{card.body}</p>
              <div className="grid grid-cols-2 gap-px mb-5" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="bg-nightWarm px-3 py-2.5"><p className="font-eyebrow text-linen/30 mb-1" style={{ fontSize: '8px', letterSpacing: '0.25em' }}>SCHEDULE</p><p className="text-linen" style={{ fontFamily: 'Montserrat', fontSize: '12px', fontWeight: 300, lineHeight: 1.4 }}>{card.schedule}</p></div>
                <div className="bg-nightWarm px-3 py-2.5"><p className="font-eyebrow text-linen/30 mb-1" style={{ fontSize: '8px', letterSpacing: '0.25em' }}>LOCATION</p><p className="text-linen" style={{ fontFamily: 'Montserrat', fontSize: '12px', fontWeight: 300, lineHeight: 1.4 }}>{card.location}</p></div>
              </div>
              <ul>
                {card.points.map((pt, i) => (
                  <li key={i} className={`flex items-center gap-3 py-2 ${i < card.points.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
                    <span className="w-1 h-1 rounded-full bg-signal shrink-0" />
                    <span className="flex-1" style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: 300, lineHeight: 1.5, color: 'rgba(210,200,185,0.85)' }}>{pt}</span>
                    {isFishing && i === 0 && (
                      <button onClick={() => setFishOpen((v) => !v)} className="shrink-0 hover:opacity-75 transition-opacity duration-300">
                        <img src="/images/fish/Largemouth Bass.webp" alt="What lives in the water" className="block" style={{ height: '2rem', width: 'auto' }} />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </AnimatePresence>
        <ModalNavBar current={currentIdx} total={cards.length} onPrev={() => go(currentIdx - 1)} onNext={() => go(currentIdx + 1)} />
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-linen/10 hover:bg-linen/20 text-linen/60 hover:text-linen transition-all z-10">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M2.22 2.22a.75.75 0 011.06 0L8 6.94l4.72-4.72a.75.75 0 111.06 1.06L9.06 8l4.72 4.72a.75.75 0 11-1.06 1.06L8 9.06l-4.72 4.72a.75.75 0 01-1.06-1.06L6.94 8 2.22 3.28a.75.75 0 010-1.06z" /></svg>
        </button>
      </motion.div>
      <AnimatePresence>
        {fishOpen && <FishCatalogPanel onClose={() => setFishOpen(false)} />}
      </AnimatePresence>
    </motion.div>
  );
}

// ── Fish Catalog Panel ────────────────────────────────────────────────────────

function FishCatalogPanel({ onClose }: { onClose: () => void }) {
  return (
    <motion.div className="relative z-10 w-full max-w-md bg-nightWarm rounded-2xl overflow-hidden shadow-2xl shrink-0 flex flex-col" initial={{ opacity: 0, x: 48 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 48 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center gap-3 px-5 py-4 border-b border-linen/[0.08] shrink-0">
        <button onClick={onClose} className="flex items-center justify-center w-7 h-7 rounded-full bg-linen/10 hover:bg-linen/20 text-linen/60 hover:text-linen transition-all">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3"><path d="M10.78 3.22a.75.75 0 010 1.06L7.06 8l3.72 3.72a.75.75 0 11-1.06 1.06l-4.25-4.25a.75.75 0 010-1.06l4.25-4.25a.75.75 0 011.06 0z" /></svg>
        </button>
        <p className="font-eyebrow text-linen/50 uppercase" style={{ fontSize: '10px', letterSpacing: '0.24em' }}>What lives in the water</p>
      </div>
      <div className="grid px-5 pt-3 pb-2 shrink-0" style={{ gridTemplateColumns: '6.8rem 1fr auto' }}>
        {['', 'Species', 'Biomass'].map((label) => (
          <p key={label} className="font-eyebrow text-linen/25 uppercase" style={{ fontSize: '10px', letterSpacing: '0.22em' }}>{label}</p>
        ))}
      </div>
      <div className="overflow-y-auto">
        {FISH_DATA.map((fish, i) => (
          <div key={fish.name} className={`grid items-center gap-x-3 px-5 py-2 ${i < FISH_DATA.length - 1 ? 'border-b border-linen/[0.06]' : ''}`} style={{ gridTemplateColumns: '6.8rem 1fr auto' }}>
            <div className="flex items-center justify-center h-[4.5rem]">
              {fish.image ? <img src={fish.image} alt={fish.name} style={{ height: '4rem', width: 'auto', maxWidth: '5rem', objectFit: 'contain' }} /> : <span className="font-eyebrow text-linen/20 text-xl">·</span>}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-linen font-medium" style={{ fontFamily: 'Montserrat', fontSize: '14px' }}>{fish.name}</span>
                {fish.type !== 'other' && (
                  <span className="font-eyebrow uppercase px-[7px] py-[3px] rounded-full" style={{ fontSize: '9px', letterSpacing: '0.18em', background: fish.type === 'predator' ? 'rgba(176,83,41,0.25)' : 'rgba(255,255,255,0.07)', color: fish.type === 'predator' ? 'rgba(200,120,80,0.9)' : 'rgba(210,200,185,0.4)' }}>
                    {fish.type === 'predator' ? 'Predator' : 'Forage'}
                  </span>
                )}
              </div>
              <p className="text-linen/45 leading-snug mb-1" style={{ fontFamily: 'Montserrat', fontSize: '13px', fontWeight: 300 }}>{fish.trait}</p>
              <p className="font-eyebrow text-linen/25 uppercase" style={{ fontSize: '10px', letterSpacing: '0.16em' }}>{fish.layer}</p>
            </div>
            <div className="text-right">
              <span className="font-display text-linen/70" style={{ fontVariationSettings: '"opsz" 20', fontWeight: 380, fontSize: '16px' }}>{fish.bio}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Nearby Modal ──────────────────────────────────────────────────────────────

function NearbyModal({ pois, startIdx, onClose }: { pois: typeof sandhillsData.nearby; startIdx: number; onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(startIdx);
  const poi = pois[currentIdx];
  return (
    <motion.div className="fixed inset-0 z-[300] flex items-center justify-center p-5 md:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} onClick={onClose}>
      <div className="absolute inset-0 bg-night/80 backdrop-blur-md" />
      <motion.div className="relative z-10 w-full max-w-3xl bg-nightWarm rounded-2xl overflow-hidden shadow-2xl flex flex-col" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 10 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div key={currentIdx} className="flex flex-col md:flex-row" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.2 } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
            <div className="w-full md:w-[42%] shrink-0 overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img src={poi.image} alt={poi.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center p-8 md:p-10">
              <p className="font-eyebrow text-signal uppercase mb-4" style={{ fontSize: '10px', letterSpacing: '0.26em' }}>{poi.distance}</p>
              <h2 className="font-display text-linen mb-5" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 30', fontWeight: 380, fontSize: 'clamp(1.4rem, 2.4vw, 2rem)', lineHeight: 1.1, letterSpacing: '-0.015em' }}>{poi.name}</h2>
              <p className="text-linen/65 mb-6" style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui', fontSize: 'clamp(0.82rem, 1vw, 0.92rem)', lineHeight: 1.72 }}>{poi.why}</p>
              <div className="grid grid-cols-4 gap-px" style={{ background: 'rgba(255,255,255,0.06)' }}>
                {poi.stats.map((s) => (
                  <div key={s.label} className="bg-nightWarm px-2 py-3 text-center">
                    <p className="font-eyebrow text-linen/30 mb-1.5" style={{ fontSize: '8px', letterSpacing: '0.22em' }}>{s.label}</p>
                    <p className="font-display text-linen" style={{ fontVariationSettings: '"opsz" 20', fontWeight: 380, fontSize: 'clamp(12px,1.1vw,14px)', letterSpacing: '-0.01em', lineHeight: 1.2 }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
        <ModalNavBar current={currentIdx} total={pois.length} onPrev={() => setCurrentIdx(currentIdx - 1)} onNext={() => setCurrentIdx(currentIdx + 1)} />
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-linen/10 hover:bg-linen/20 text-linen/60 hover:text-linen transition-all z-10">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M2.22 2.22a.75.75 0 011.06 0L8 6.94l4.72-4.72a.75.75 0 111.06 1.06L9.06 8l4.72 4.72a.75.75 0 11-1.06 1.06L8 9.06l-4.72 4.72a.75.75 0 01-1.06-1.06L6.94 8 2.22 3.28a.75.75 0 010-1.06z" /></svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Comfort Modal ─────────────────────────────────────────────────────────────

function ComfortModal({ cards, startIdx, onClose }: { cards: typeof COMFORT_CARDS; startIdx: number; onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(startIdx);
  const card = cards[currentIdx];
  return (
    <motion.div className="fixed inset-0 z-[300] flex items-center justify-center p-5 md:p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }} onClick={onClose}>
      <div className="absolute inset-0 bg-night/80 backdrop-blur-md" />
      <motion.div className="relative z-10 w-full max-w-3xl bg-nightWarm rounded-2xl overflow-hidden flex flex-col shadow-2xl" initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 10 }} transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }} onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.div key={currentIdx} className="flex flex-col md:flex-row" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.2 } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
            <div className="w-full md:w-[42%] shrink-0 overflow-hidden" style={{ aspectRatio: '4/3' }}>
              <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-center p-8 md:p-10 lg:p-12">
              <p className="font-eyebrow text-signal uppercase mb-4" style={{ fontSize: '10px', letterSpacing: '0.26em' }}>{card.note}</p>
              <h2 className="font-display text-linen mb-6" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 30', fontWeight: 380, fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', lineHeight: 1.1, letterSpacing: '-0.015em' }}>{card.headline}</h2>
              <p className="text-linen/65" style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui', fontSize: 'clamp(0.85rem, 1.05vw, 0.95rem)', lineHeight: 1.75 }}>{card.body}</p>
            </div>
          </motion.div>
        </AnimatePresence>
        <ModalNavBar current={currentIdx} total={cards.length} onPrev={() => setCurrentIdx(currentIdx - 1)} onNext={() => setCurrentIdx(currentIdx + 1)} />
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 flex items-center justify-center w-8 h-8 rounded-full bg-linen/10 hover:bg-linen/20 text-linen/60 hover:text-linen transition-all">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M2.22 2.22a.75.75 0 011.06 0L8 6.94l4.72-4.72a.75.75 0 111.06 1.06L9.06 8l4.72 4.72a.75.75 0 11-1.06 1.06L8 9.06l-4.72 4.72a.75.75 0 01-1.06-1.06L6.94 8 2.22 3.28a.75.75 0 010-1.06z" /></svg>
        </button>
      </motion.div>
    </motion.div>
  );
}

// ── Contact Modal ──────────────────────────────────────────────────────────────

function ContactModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<'pick' | 'callback' | 'email'>('pick');
  const [done, setDone] = useState(false);

  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [email, setEmail]       = useState('');
  const [question, setQuestion] = useState('');
  const [err, setErr]           = useState(false);

  const submitCallback = () => {
    if (!name || !phone) { setErr(true); setTimeout(() => setErr(false), 1200); return; }
    setDone(true);
  };
  const submitEmail = () => {
    if (!name || !email || !question) { setErr(true); setTimeout(() => setErr(false), 1200); return; }
    setDone(true);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[400] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
      style={{ background: 'rgba(20,18,14,0.72)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="relative w-full bg-bone"
        style={{ maxWidth: mode === 'pick' ? 640 : 440, borderRadius: 4 }}
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 text-ink2 hover:text-ink transition-colors" style={{ fontSize: 22, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>

        <AnimatePresence mode="wait">
          {done ? (
            <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center px-10 py-14">
              <p className="font-display italic text-signal mb-2" style={{ fontSize: '1.5rem' }}>
                {mode === 'callback' ? "We'll call you shortly." : 'Answer on its way.'}
              </p>
              <p className="font-eyebrow font-light text-ink2" style={{ fontSize: 12, letterSpacing: '0.1em' }}>
                {mode === 'callback' ? 'The pines can wait a minute.' : 'We respond within 24 hours.'}
              </p>
            </motion.div>

          ) : mode === 'pick' ? (
            <motion.div key="pick" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              <div className="px-8 pt-10 pb-4">
                <p className="font-display italic text-ink" style={{ fontSize: '1.4rem', lineHeight: 1.25 }}>How would you like to connect?</p>
                <p className="font-eyebrow font-light text-ink2 mt-1" style={{ fontSize: 12, letterSpacing: '0.1em' }}>Pick what works for you.</p>
              </div>
              <div className="grid grid-cols-2 gap-px m-8 mt-5" style={{ background: 'rgba(31,36,32,0.10)', border: '1px solid rgba(31,36,32,0.10)', borderRadius: 3 }}>
                <button onClick={() => setMode('callback')} className="group flex flex-col items-start p-7 bg-bone hover:bg-signal transition-colors duration-300 text-left" style={{ borderRadius: '2px 0 0 2px', border: 'none', cursor: 'pointer' }}>
                  <span style={{ fontSize: 28, marginBottom: 16, display: 'block' }}>📞</span>
                  <span className="font-display group-hover:text-linen transition-colors duration-300" style={{ fontSize: '1.05rem', lineHeight: 1.3, display: 'block', marginBottom: 8, color: '#1F2420' }}>
                    Call me back<br />in 60 seconds
                  </span>
                  <span className="font-eyebrow font-light group-hover:text-linen/60 transition-colors duration-300" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(90,86,80,0.55)' }}>
                    Leave your number →
                  </span>
                </button>
                <button onClick={() => setMode('email')} className="group flex flex-col items-start p-7 bg-bone hover:bg-signal transition-colors duration-300 text-left" style={{ borderRadius: '0 2px 2px 0', border: 'none', cursor: 'pointer' }}>
                  <span style={{ fontSize: 28, marginBottom: 16, display: 'block' }}>✉️</span>
                  <span className="font-display group-hover:text-linen transition-colors duration-300" style={{ fontSize: '1.05rem', lineHeight: 1.3, display: 'block', marginBottom: 8, color: '#1F2420' }}>
                    Ask a question,<br />get an answer by email
                  </span>
                  <span className="font-eyebrow font-light group-hover:text-linen/60 transition-colors duration-300" style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(90,86,80,0.55)' }}>
                    We reply within 24 h →
                  </span>
                </button>
              </div>
            </motion.div>

          ) : mode === 'callback' ? (
            <motion.div key="callback" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="px-8 py-10">
              <button onClick={() => setMode('pick')} className="font-eyebrow font-light text-ink2/50 hover:text-signal transition-colors mb-6" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                ← Back
              </button>
              <p className="font-display italic text-ink mb-1" style={{ fontSize: '1.4rem', lineHeight: 1.25 }}>We'll call you back.</p>
              <p className="font-eyebrow font-light text-ink2 mb-7" style={{ fontSize: 12, letterSpacing: '0.1em' }}>Available Mon–Sun · 8 am–8 pm EST</p>
              {([
                { label: 'Your name',    type: 'text', ph: 'First name',          val: name,  set: setName },
                { label: 'Phone number', type: 'tel',  ph: '+1 (___) ___-____',   val: phone, set: setPhone },
              ] as const).map(f => (
                <div key={f.label} className="mb-4">
                  <label className="block font-eyebrow font-light text-ink2 mb-1" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)}
                    className={`w-full bg-boneWarm text-ink font-eyebrow font-light text-sm px-3 py-2.5 outline-none border transition-colors ${err && !f.val ? 'border-signal' : 'border-divider focus:border-signal'}`}
                    style={{ borderRadius: 0 }} />
                </div>
              ))}
              <button onClick={submitCallback} className="w-full font-eyebrow font-light text-linen bg-signal hover:bg-signal2 transition-colors py-3 mt-2" style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', borderRadius: 0, border: 'none', cursor: 'pointer' }}>
                Call me in 60 seconds →
              </button>
            </motion.div>

          ) : (
            <motion.div key="email" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }} className="px-8 py-10">
              <button onClick={() => setMode('pick')} className="font-eyebrow font-light text-ink2/50 hover:text-signal transition-colors mb-6" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                ← Back
              </button>
              <p className="font-display italic text-ink mb-1" style={{ fontSize: '1.4rem', lineHeight: 1.25 }}>Ask us anything.</p>
              <p className="font-eyebrow font-light text-ink2 mb-7" style={{ fontSize: 12, letterSpacing: '0.1em' }}>We respond within 24 hours.</p>
              {([
                { label: 'Your name',     type: 'text',  ph: 'First name',       val: name,  set: setName },
                { label: 'Email address', type: 'email', ph: 'you@example.com',  val: email, set: setEmail },
              ] as const).map(f => (
                <div key={f.label} className="mb-4">
                  <label className="block font-eyebrow font-light text-ink2 mb-1" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{f.label}</label>
                  <input type={f.type} placeholder={f.ph} value={f.val} onChange={e => f.set(e.target.value)}
                    className={`w-full bg-boneWarm text-ink font-eyebrow font-light text-sm px-3 py-2.5 outline-none border transition-colors ${err && !f.val ? 'border-signal' : 'border-divider focus:border-signal'}`}
                    style={{ borderRadius: 0 }} />
                </div>
              ))}
              <div className="mb-4">
                <label className="block font-eyebrow font-light text-ink2 mb-1" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Your question</label>
                <textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="What would you like to know?" rows={4}
                  className={`w-full bg-boneWarm text-ink font-eyebrow font-light text-sm px-3 py-2.5 outline-none border transition-colors resize-none ${err && !question ? 'border-signal' : 'border-divider focus:border-signal'}`}
                  style={{ borderRadius: 0 }} />
              </div>
              <button onClick={submitEmail} className="w-full font-eyebrow font-light text-linen bg-signal hover:bg-signal2 transition-colors py-3 mt-1" style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', borderRadius: 0, border: 'none', cursor: 'pointer' }}>
                Send my question →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
