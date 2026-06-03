import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { UserCheck, Wifi, Gem } from 'lucide-react';
import Img from '../primitives/Img';
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
    image:    '/qaYcANUQR-PNzw3QPCqKA_uEzp7Ijh.webp',
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
    image:    '/images/aKbo_jkSiGvo_scLOlbIM_BngwcJ7U.webp',
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
    image:    '/images/hiveboxx-65icrs88YYs-unsplash.webp',
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
    image:    '/images/sandhills/farm_tour.jpg',
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


// ── B2B / private-hire use cases ──────────────────────────────────────────────

const B2B_CASES = [
  {
    title: 'Strategy offsites',
    short: 'Strategy',
    tag: 'Focused, two days, zero noise',
    image: '/images/villa/02_Interior_Casita/1.webp',
    body: 'Pull the leadership team out of the building and into a room with no glass walls and no calendar. The great-room table seats the core group; the lake and trails are there for the conversations that land better on a walk.',
    meta: [
      { label: 'Ideal size', value: '4–12 people' },
      { label: 'Length',     value: '1–3 nights' },
      { label: 'Setting',    value: 'Villa great room + lake' },
    ],
    highlights: [
      'Private long table with power and a wall to pin work to',
      'Fast estate Wi-Fi where you want it, none where you don\'t',
      'Walking routes for one-on-ones between sessions',
    ],
  },
  {
    title: 'Corporate retreats',
    short: 'Retreats',
    tag: 'The whole team, somewhere they remember',
    image: '/images/villa/03_Terrace/1.webp',
    body: 'Take over the entire estate and give the company a few days that feel nothing like the office. Mornings on the water, afternoons around the firepit, evenings on the deck — structured as much or as little as you like.',
    meta: [
      { label: 'Ideal size', value: '10–24 people' },
      { label: 'Length',     value: '2–4 nights' },
      { label: 'Setting',    value: 'Whole estate, exclusive use' },
    ],
    highlights: [
      'Sauna, canoes, e-bikes and trails included for everyone',
      'Catering and private chefs arranged on request',
      'Bonfire, lawn games and a lake that is entirely yours',
    ],
  },
  {
    title: 'Leadership councils',
    short: 'Councils',
    tag: 'Board-level, completely private',
    image: '/images/villa/02_Interior_Casita/3.webp',
    body: 'Board meetings, partner summits and sensitive conversations, held where no one is listening. The estate is gated and unshared — what is said on the property stays on the property.',
    meta: [
      { label: 'Ideal size', value: '4–10 people' },
      { label: 'Length',     value: '1–2 nights' },
      { label: 'Setting',    value: 'Private interior, no other guests' },
    ],
    highlights: [
      'Gated, single-party access for the full stay',
      'Quiet rooms for breakaway and confidential calls',
      'Discreet service — present when needed, invisible otherwise',
    ],
  },
  {
    title: 'Deep-work sprints',
    short: 'Sprints',
    tag: 'A week to ship something hard',
    image: '/images/sandhills/Forest_bathing_walk.webp',
    body: 'Move a small team out here for a week of real, uninterrupted building. The only distraction is the lake — and that is the point. Long, quiet days; short walks to reset; nothing pulling focus.',
    meta: [
      { label: 'Ideal size', value: '3–8 people' },
      { label: 'Length',     value: '3–7 nights' },
      { label: 'Setting',    value: 'Villa + casita, full kitchen' },
    ],
    highlights: [
      'Stocked pantry and full kitchen — no leaving to eat',
      'Separate sleeping and working spaces for the whole team',
      'Trails and sauna built in for the breaks that matter',
    ],
  },
  {
    title: 'Investor & partner summits',
    short: 'Summits',
    tag: 'Host the people who matter',
    image: '/images/villa/01_Exterior/4.webp',
    body: 'When the agenda is relationships, the setting does half the work. A hundred and twenty-six private acres signal seriousness without saying a word — and give your guests something they will talk about long after.',
    meta: [
      { label: 'Ideal size', value: '6–20 people' },
      { label: 'Length',     value: '1–3 nights' },
      { label: 'Setting',    value: 'Estate grounds + terrace' },
    ],
    highlights: [
      'Arrival, dining and hosting handled end to end',
      'Guided paddle, fishing or sunrise walk as the icebreaker',
      'Terrace and firepit for the conversations after dinner',
    ],
  },
  {
    title: 'Milestone celebrations',
    short: 'Celebrations',
    tag: 'Mark the moment, gather the people',
    image: '/images/sandhills/Guided_sunrise_paddle.webp',
    body: 'Close the round, mark the launch, celebrate the people who built it. Take the estate for a long weekend and turn a milestone into a memory — under the pines, on the water, around the fire.',
    meta: [
      { label: 'Ideal size', value: '10–24 people' },
      { label: 'Length',     value: '2–3 nights' },
      { label: 'Setting',    value: 'Whole estate, exclusive use' },
    ],
    highlights: [
      'Lawn, lakeside and firepit for gatherings of any shape',
      'Catering, bar and private chefs arranged on request',
      'Space to host loudly — there are no neighbours to mind',
    ],
  },
];


// ── Main component ────────────────────────────────────────────────────────────

export default function VillaCascade() {
  const villa = sandhillsData.stays[0];

  const [galleryStartIdx, setGalleryStartIdx] = useState<number | null>(null);
  const [comfortIdx,    setComfortIdx]    = useState<number | null>(null);
  const [hoverExp,    setHoverExp]    = useState<number | null>(null);
  const [expandedExp, setExpandedExp] = useState<number | null>(null);
  const [nearbyIdx,     setNearbyIdx]     = useState<number | null>(null);
  const [b2bIdx,        setB2bIdx]        = useState(0);

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

  const { scrollYProgress: p1 } = useScroll({ target: act1Ref, offset: ['start end', 'end start'] });
  const { scrollYProgress: p2 } = useScroll({ target: act2Ref, offset: ['start end', 'end start'] });
  const { scrollYProgress: p3 } = useScroll({ target: act3Ref, offset: ['start end', 'end start'] });
  const { scrollYProgress: p4 } = useScroll({ target: act4Ref, offset: ['start end', 'end start'] });

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



  return (
    <>
      {/* Intro strip */}
      <div className="w-full flex items-center justify-center py-5 md:py-0" style={{ height: 'auto', minHeight: 'clamp(80px, 11vh, 120px)', background: '#EAE3D3' }}>
        <p
          className="font-display italic text-center px-6"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0', fontWeight: 360, fontSize: 'clamp(1.7rem, 4vw, 2.9rem)', letterSpacing: '-0.02em', lineHeight: 1.06, color: '#B05329' }}
        >
          Allow us to show you in.
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

          </div>
        </div>

        {/* ── Act 1 — Villa ───────────────────────────────────────────────── */}
        <div
          ref={act1Ref}
          className="relative flex flex-col px-6 pb-6 pt-[72px] md:px-12 md:pb-12 md:pt-[72px] lg:px-16 lg:pb-16"
          style={{ zIndex: 1 }}
        >
          <div className="w-full md:max-w-[82%] mx-auto flex flex-col gap-2">
          {/* Full-bleed exterior photo with reveal animation */}
          <motion.div
            className="w-full rounded-2xl overflow-hidden cursor-pointer relative"
            style={{ height: 'clamp(420px, 80vh, 960px)' }}
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setGalleryStartIdx(0)}
          >
            <Img
              src="/images/villa/01_Exterior/4.webp"
              alt="Forest Villa exterior"
              className="w-full h-full object-cover object-bottom"
              fetchPriority="high"
              decoding="async"
            />
            {/* Gradients: bottom bleed + top-right text backdrop */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,6,4,0.38) 0%, transparent 40%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom-left, rgba(8,6,4,0.62) 0%, rgba(8,6,4,0.18) 38%, transparent 60%)' }} />

            {/* Title overlay — bottom-left, grid-anchored */}
            <motion.div
              style={{
                position: 'absolute',
                left: 'clamp(20px, 4%, 48px)',
                right: 'clamp(20px, 4%, 48px)',
                bottom: 'clamp(24px, 4%, 52px)',
                display: 'grid',
                gridTemplateColumns: 'auto auto',
                justifyContent: 'start',
                gridTemplateRows: 'auto',
                alignItems: 'end',
                gap: '0 clamp(16px, 3vw, 40px)',
                pointerEvents: 'none',
              }}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
            >
              {/* Left col: title block */}
              <div>
                {/* Eyebrow + rule */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 'clamp(8px, 1.2vh, 14px)' }}>
                  <span style={{ display: 'block', width: 28, height: 1, background: '#D4804E', flexShrink: 0 }} />
                  <p style={{
                    fontFamily: 'Inter Tight, Inter, system-ui, sans-serif',
                    fontSize: 'clamp(11px, 1vw, 14px)',
                    fontWeight: 700,
                    letterSpacing: '0.22em',
                    textTransform: 'uppercase',
                    color: 'rgba(242,237,227,0.90)',
                    margin: 0,
                    textShadow: '0 1px 14px rgba(0,0,0,0.85)',
                  }}>
                    Flagship of the wild
                  </p>
                </div>

                {/* Main title */}
                <h2 style={{ margin: 0, lineHeight: 0.86, letterSpacing: '-0.045em' }}>
                  <span
                    className="font-display"
                    style={{
                      display: 'block',
                      fontVariationSettings: '"opsz" 144, "SOFT" 20, "WONK" 0',
                      fontWeight: 320,
                      fontSize: 'clamp(3.36rem, 8.4vw, 7.8rem)',
                      color: 'rgba(242,237,227,1)',
                      textShadow: '0 2px 32px rgba(0,0,0,0.9), 0 1px 8px rgba(0,0,0,0.5)',
                    }}
                  >
                    Forest
                  </span>
                  <span
                    className="font-display"
                    style={{
                      display: 'block',
                      fontVariationSettings: '"opsz" 144, "SOFT" 20, "WONK" 0',
                      fontWeight: 320,
                      fontSize: 'clamp(3.36rem, 8.4vw, 7.8rem)',
                      color: 'rgba(242,237,227,1)',
                      marginTop: '-0.04em',
                      textShadow: '0 2px 32px rgba(0,0,0,0.9), 0 1px 8px rgba(0,0,0,0.5)',
                    }}
                  >
                    Villa
                  </span>
                </h2>
              </div>

              {/* Right col: spec infographic on glass card */}
              <div style={{
                display: 'inline-flex', flexWrap: 'wrap', gap: 'clamp(14px, 2.5vw, 28px)',
                padding: 'clamp(12px, 1.8vh, 20px) clamp(16px, 2vw, 24px)',
                borderRadius: 14,
                background: 'rgba(8,6,4,0.22)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
              }}>
                {/* Guests */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 'clamp(1.1rem, 1.8vw, 1.5rem)', height: 'clamp(1.1rem, 1.8vw, 1.5rem)', color: 'rgba(231,222,199,0.75)', flexShrink: 0 }}>
                      <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 1 1 14 0H3z" />
                    </svg>
                    <span className="font-display" style={{ fontVariationSettings: '"opsz" 48', fontWeight: 380, fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)', lineHeight: 1, letterSpacing: '-0.02em', color: 'rgba(242,237,227,1)', textShadow: '0 1px 12px rgba(0,0,0,0.8)' }}>4</span>
                  </div>
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(231,222,199,0.40)', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>up to<br />Guests</span>
                </div>
                {/* Host */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <UserCheck style={{ width: 'clamp(1.1rem, 1.8vw, 1.5rem)', height: 'clamp(1.1rem, 1.8vw, 1.5rem)', color: 'rgba(231,222,199,0.75)', filter: 'drop-shadow(0 1px 8px rgba(0,0,0,0.7))' }} strokeWidth={1.3} />
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(231,222,199,0.40)', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>Personal<br />host</span>
                </div>
                {/* Wi-Fi */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <Wifi style={{ width: 'clamp(1.1rem, 1.8vw, 1.5rem)', height: 'clamp(1.1rem, 1.8vw, 1.5rem)', color: 'rgba(231,222,199,0.75)', filter: 'drop-shadow(0 1px 8px rgba(0,0,0,0.7))' }} strokeWidth={1.3} />
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(231,222,199,0.40)', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>Starlink<br />Wi-Fi</span>
                </div>
                {/* Premium */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                  <Gem style={{ width: 'clamp(1.1rem, 1.8vw, 1.5rem)', height: 'clamp(1.1rem, 1.8vw, 1.5rem)', color: 'rgba(231,222,199,0.75)', filter: 'drop-shadow(0 1px 8px rgba(0,0,0,0.7))' }} strokeWidth={1.3} />
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(231,222,199,0.40)', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>Premium<br />furnishings</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Thumbnail strip */}
          <div className="flex gap-2 mt-2">
            {[
              { src: '/images/villa/01_Exterior/1.webp', idx: 0 },
              { src: '/images/villa/01_Exterior/2.webp', idx: 1 },
              { src: '/images/villa/02_Interior_Casita/1.webp', idx: 4 },
              { src: '/images/villa/03_Terrace/1.webp', idx: 10 },
              { src: '/images/villa/04_Sauna/1.webp', idx: 12 },
            ].map((thumb, i) => (
              <motion.button
                key={thumb.src}
                className="flex-1 rounded-xl overflow-hidden relative group"
                style={{ height: 'clamp(140px, 22vh, 240px)' }}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.07 }}
                onClick={() => setGalleryStartIdx(thumb.idx)}
              >
                <img
                  src={thumb.src}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-night/0 group-hover:bg-night/20 transition-colors duration-300 rounded-xl" />
              </motion.button>
            ))}
          </div>
          </div>{/* /max-w-[82%] wrapper */}
        </div>

        {/* ── Act 2 — Comfort ─────────────────────────────────────────────── */}
        <div ref={act2Ref} className="relative min-h-screen flex flex-col px-6 pb-6 pt-3 md:px-12 md:pb-12 md:pt-5 lg:px-16 lg:pb-16 lg:pt-6" style={{ zIndex: 1 }}>
          <div className="w-full md:max-w-[82%] mx-auto">
          <div>
            {/* Typographic interlude — mixed scale */}
            <div className="text-center mx-auto" style={{ maxWidth: '68rem', paddingTop: 'clamp(0px, 0.6vh, 8px)', paddingBottom: 'clamp(32px, 6vh, 76px)' }}>
              <h2 className="font-display text-linen" style={{ lineHeight: 1.04, letterSpacing: '-0.02em', margin: 0 }}>
                <span style={{ display: 'block', fontVariationSettings: '"wght" 350, "opsz" 144, "SOFT" 50, "WONK" 0', fontSize: 'clamp(2.7rem, 6.4vw, 5.6rem)', color: 'rgba(242,237,227,0.97)' }}>
                  The very best
                </span>
                <span style={{ display: 'block', fontVariationSettings: '"wght" 360, "opsz" 96, "SOFT" 30, "WONK" 0', fontSize: 'clamp(1.35rem, 2.9vw, 2.4rem)', color: 'rgba(231,222,199,0.82)', marginTop: 'clamp(6px, 1.2vh, 14px)' }}>
                  of everything we could find
                </span>
                <span style={{ display: 'block', fontStyle: 'italic', fontVariationSettings: '"wght" 340, "opsz" 96, "SOFT" 40, "WONK" 0', fontSize: 'clamp(1.5rem, 3.3vw, 2.8rem)', color: 'rgba(231,222,199,0.55)', marginTop: 'clamp(4px, 0.9vh, 12px)' }}>
                  is <span style={{ color: '#B05329' }}>included</span>.
                </span>
              </h2>
            </div>

            <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
              {/* Placeholder cell — full width on mobile */}
              <div className="col-span-2 md:col-span-1 rounded-xl flex flex-col justify-between pt-3 px-6 pb-3 md:p-8 h-[clamp(94px,13vh,133px)] md:h-[clamp(192px,31vh,308px)]" style={{ background: 'rgba(242,237,227,0.06)', border: '1px solid rgba(242,237,227,0.08)' }}>
                <p className="font-eyebrow text-signal uppercase" style={{ fontSize: '13px', letterSpacing: '0.22em' }}>What's included</p>
                <p className="font-display text-linen" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 30', fontWeight: 380, fontStyle: 'italic', fontSize: 'clamp(1.5rem, 2.4vw, 2.2rem)', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
                  The standard<br />you deserve
                </p>
              </div>
              {COMFORT_CARDS.map((card, i) => (
                <button key={card.title} onClick={() => setComfortIdx(i)} className={`rounded-xl overflow-hidden relative group text-left${i === COMFORT_CARDS.length - 1 ? ' col-span-2 md:col-span-1' : ''}`} style={{ height: 'clamp(192px, 31vh, 308px)' }}>
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

        {/* ── B2B — Private hire (frosted matte glass) ────────────────────── */}
        <div className="relative flex flex-col px-6 pb-10 pt-2 md:px-12 md:pb-16 lg:px-16" style={{ zIndex: 1 }}>
          <div className="w-full md:max-w-[82%] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                borderRadius: 28,
                overflow: 'hidden',
                background: 'rgba(242,237,227,0.055)',
                backdropFilter: 'blur(30px) saturate(118%)',
                WebkitBackdropFilter: 'blur(30px) saturate(118%)',
                border: '1px solid rgba(242,237,227,0.12)',
                boxShadow: 'inset 0 1px 0 rgba(242,237,227,0.12), 0 30px 90px rgba(0,0,0,0.45)',
                padding: 'clamp(30px, 5.5vh, 72px) clamp(24px, 4vw, 68px)',
              }}
            >
              {/* warm sheen, top-left */}
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(130% 90% at 0% 0%, rgba(176,83,41,0.12), transparent 55%)' }} />

              <div style={{ position: 'relative' }}>
                {/* Header */}
                <p className="font-eyebrow text-signal uppercase mb-5" style={{ fontSize: '11px', letterSpacing: '0.26em' }}>
                  Beyond leisure
                </p>
                <h2 className="font-display text-linen" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0', fontWeight: 380, fontSize: 'clamp(2.18rem, 4.83vw, 3.91rem)', lineHeight: 1.08, letterSpacing: '-0.02em', maxWidth: '22ch', marginBottom: 'clamp(14px, 2vh, 20px)' }}>
                  If your company needs a place{' '}
                  <span style={{ fontStyle: 'italic', color: 'rgba(231,222,199,0.55)' }}>set apart.</span>
                </h2>
                <p className="text-linen/55" style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui', fontSize: 'clamp(0.88rem, 1.1vw, 1rem)', lineHeight: 1.72, maxWidth: '46rem', marginBottom: 'clamp(26px, 4vh, 48px)' }}>
                  The whole estate, privately yours — no other guests, no schedule but your own. Bring the team somewhere the work actually lands.
                </p>

                {/* Mode switcher — illustrated tabs */}
                <div className="grid grid-cols-3 lg:grid-cols-6" style={{ gap: 'clamp(8px, 1vw, 14px)', marginBottom: 'clamp(18px, 2.6vh, 28px)' }}>
                  {B2B_CASES.map((c, i) => {
                    const active = b2bIdx === i;
                    return (
                      <button
                        key={c.title}
                        onClick={() => setB2bIdx(i)}
                        aria-pressed={active}
                        style={{
                          position: 'relative', borderRadius: 13, overflow: 'hidden',
                          cursor: 'pointer', padding: 0, background: 'transparent',
                          border: active ? '1px solid rgba(176,83,41,0.95)' : '1px solid rgba(242,237,227,0.10)',
                          boxShadow: active ? '0 8px 24px rgba(0,0,0,0.35)' : 'none',
                          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                        }}
                      >
                        <div style={{ position: 'relative', height: 'clamp(58px, 9vh, 86px)' }}>
                          <img
                            src={c.image} alt={c.title} loading="lazy"
                            style={{
                              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                              opacity: active ? 1 : 0.42,
                              filter: active ? 'none' : 'grayscale(45%)',
                              transition: 'opacity 0.35s ease, filter 0.35s ease, transform 0.5s ease',
                              transform: active ? 'scale(1.0)' : 'scale(1.0)',
                            }}
                          />
                          <div style={{ position: 'absolute', inset: 0,
                            background: active
                              ? 'linear-gradient(to top, rgba(8,6,4,0.88) 0%, rgba(8,6,4,0.1) 70%)'
                              : 'linear-gradient(to top, rgba(8,6,4,0.78) 0%, rgba(8,6,4,0.3) 70%)' }} />
                          <span style={{
                            position: 'absolute', left: 10, right: 8, bottom: 8,
                            fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 'clamp(9.5px, 0.95vw, 12px)',
                            fontWeight: 600, letterSpacing: '0.10em', textTransform: 'uppercase',
                            color: active ? '#F2EDE3' : 'rgba(231,222,199,0.62)',
                            transition: 'color 0.3s ease', lineHeight: 1.1,
                          }}>
                            {c.short}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Detail window */}
                <div style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(242,237,227,0.10)', background: 'rgba(8,6,4,0.22)' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={b2bIdx}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.12fr)]"
                    >
                      {/* Image */}
                      <div style={{ position: 'relative', minHeight: 'clamp(200px, 32vh, 360px)' }}>
                        <img
                          src={B2B_CASES[b2bIdx].image}
                          alt={B2B_CASES[b2bIdx].title}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                        />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,6,4,0.55) 0%, transparent 45%)' }} />
                        <div className="md:hidden" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,6,4,0.9) 0%, transparent 55%)' }} />
                      </div>

                      {/* Content */}
                      <div style={{ padding: 'clamp(24px, 3.4vh, 44px) clamp(22px, 3vw, 48px)' }}>
                        <p className="font-eyebrow text-signal uppercase" style={{ fontSize: '10px', letterSpacing: '0.24em', marginBottom: 10 }}>
                          {B2B_CASES[b2bIdx].tag}
                        </p>
                        <h3 className="font-display text-linen" style={{ fontVariationSettings: '"opsz" 72, "SOFT" 30', fontWeight: 380, fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 'clamp(12px, 1.6vh, 18px)' }}>
                          {B2B_CASES[b2bIdx].title}
                        </h3>
                        <p style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui', fontSize: 'clamp(0.86rem, 1.05vw, 0.98rem)', lineHeight: 1.7, color: 'rgba(231,222,199,0.62)', marginBottom: 'clamp(18px, 2.6vh, 26px)' }}>
                          {B2B_CASES[b2bIdx].body}
                        </p>

                        {/* Meta row */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'clamp(16px, 2.4vw, 36px)', paddingBottom: 'clamp(16px, 2.4vh, 22px)', marginBottom: 'clamp(16px, 2.4vh, 22px)', borderBottom: '1px solid rgba(242,237,227,0.12)' }}>
                          {B2B_CASES[b2bIdx].meta.map((m) => (
                            <div key={m.label}>
                              <p className="font-eyebrow uppercase" style={{ fontSize: '9px', letterSpacing: '0.20em', color: 'rgba(231,222,199,0.35)', marginBottom: 4 }}>{m.label}</p>
                              <p className="font-display text-linen" style={{ fontVariationSettings: '"opsz" 24', fontWeight: 380, fontSize: 'clamp(0.95rem, 1.3vw, 1.15rem)', lineHeight: 1.2 }}>{m.value}</p>
                            </div>
                          ))}
                        </div>

                        {/* Highlights */}
                        <ul style={{ display: 'flex', flexDirection: 'column', gap: 10, listStyle: 'none', padding: 0, margin: 0 }}>
                          {B2B_CASES[b2bIdx].highlights.map((h) => (
                            <li key={h} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                              <span style={{ color: '#B05329', flexShrink: 0, marginTop: 1, lineHeight: 1.5 }}>—</span>
                              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.82rem, 1vw, 0.92rem)', lineHeight: 1.5, color: 'rgba(231,222,199,0.7)' }}>{h}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* CTA */}
                <div style={{ marginTop: 'clamp(28px, 4vh, 52px)', display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2vw, 28px)', flexWrap: 'wrap' }}>
                  <a
                    href="#reserve"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      background: '#B05329', color: '#F2EDE3', textDecoration: 'none',
                      padding: 'clamp(12px, 1.6vh, 16px) clamp(22px, 2.4vw, 32px)',
                      borderRadius: 999, flexShrink: 0,
                      fontFamily: 'Inter Tight, Inter, system-ui, sans-serif',
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
                    }}
                  >
                    Get a quote that suits you
                    <span style={{ fontSize: 14, lineHeight: 1 }}>→</span>
                  </a>
                  <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(12px, 1vw, 14px)', color: 'rgba(231,222,199,0.42)', margin: 0, lineHeight: 1.5 }}>
                    Send your dates and headcount — we'll come back fast, no obligation.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Act 3 — Experience ──────────────────────────────────────────── */}
        <div
          ref={act3Ref}
          data-zone="light"
          className="relative min-h-screen flex flex-col p-6 md:p-12 lg:p-16"
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

          {/* ── Experience dock — magnify on hover, expand-to-bento on click ── */}
          {(() => { const expanded = expandedExp !== null; return (
          <div
            className="relative grid grid-cols-2 md:grid-cols-4"
            style={{
              // @ts-expect-error custom CSS vars
              '--tileH': 'clamp(150px, 22vh, 232px)',
              '--tileHalf': 'clamp(86px, 12.5vh, 128px)',
              zIndex: 1,
              gap: 'clamp(10px, 1.4vw, 18px)',
              marginTop: 'clamp(32px, 6vh, 72px)',
              paddingBottom: 'clamp(64px, 9vh, 116px)',
              gridAutoRows: expanded ? 'var(--tileHalf)' : 'var(--tileH)',
              gridAutoFlow: expanded ? 'dense' : 'row',
            }}
            onMouseLeave={() => setHoverExp(null)}
          >
            {EXPERIENCE_CARDS.map((card, i) => {
              const isExpanded = expandedExp === i;
              const isHover    = !expanded && hoverExp === i;
              const dimmed     = !expanded && hoverExp !== null && hoverExp !== i;
              return (
                <motion.div
                  layout
                  key={card.title}
                  onMouseEnter={() => { if (!expanded) setHoverExp(i); }}
                  onClick={() => setExpandedExp(isExpanded ? null : i)}
                  transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
                  style={{
                    position: 'relative', cursor: 'pointer',
                    zIndex: isExpanded ? 40 : (isHover ? 30 : 1),
                    gridColumn: isExpanded ? '1 / span 2' : undefined,
                    gridRow:    isExpanded ? '1 / span 4' : undefined,
                  }}
                >
                  {/* Inner — handles hover magnify without disturbing grid layout */}
                  <motion.div
                    animate={{ scale: isHover ? 1.08 : 1, y: isHover ? -6 : 0, opacity: dimmed ? 0.5 : 1 }}
                    transition={{ type: 'spring', stiffness: 320, damping: 26, mass: 0.6 }}
                    style={{ position: 'relative', width: '100%', height: '100%' }}
                  >
                    {/* Image surface — fills whole tile */}
                    <div
                      style={{
                        position: 'relative', borderRadius: isExpanded ? 18 : 16, overflow: 'hidden',
                        width: '100%', height: '100%',
                        boxShadow: (isExpanded || isHover) ? '0 28px 64px rgba(0,0,0,0.42)' : '0 6px 18px rgba(0,0,0,0.16)',
                        transition: 'box-shadow 0.3s ease',
                      }}
                    >
                      <img src={card.image} alt={card.title} loading="lazy" className="w-full h-full object-cover" style={{ display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: isExpanded
                        ? 'linear-gradient(to top, rgba(8,6,4,0.96) 0%, rgba(8,6,4,0.55) 38%, rgba(8,6,4,0.05) 72%)'
                        : 'linear-gradient(to top, rgba(8,6,4,0.86) 0%, rgba(8,6,4,0.12) 55%, transparent 80%)' }} />

                      {/* Number */}
                      <span style={{ position: 'absolute', top: 10, left: 12, fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: 'rgba(242,237,227,0.7)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      {/* Close button — only when expanded */}
                      {isExpanded && (
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpandedExp(null); }}
                          aria-label="Close"
                          style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 999, border: '1px solid rgba(242,237,227,0.25)', background: 'rgba(8,6,4,0.5)', backdropFilter: 'blur(8px)', color: '#F2EDE3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', lineHeight: 1, fontSize: 16 }}
                        >
                          ×
                        </button>
                      )}

                      {/* Compact title — collapsed/other tiles */}
                      {!isExpanded && (
                        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 10 }}>
                          <p className="font-display text-linen" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 20', fontWeight: 380, fontSize: expanded ? 'clamp(0.78rem, 1vw, 0.95rem)' : 'clamp(0.95rem, 1.5vw, 1.25rem)', lineHeight: 1.1, letterSpacing: '-0.01em' }}>
                            {card.title}
                          </p>
                        </div>
                      )}

                      {/* Expanded detail content */}
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.4, delay: 0.22 }}
                          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: 'clamp(16px, 2vw, 28px)', overflow: 'hidden' }}
                        >
                          <p className="font-eyebrow uppercase" style={{ fontSize: '10px', letterSpacing: '0.24em', color: 'rgba(176,83,41,0.95)', marginBottom: 8 }}>
                            {card.badge}
                          </p>
                          <h3 className="font-display text-linen" style={{ fontVariationSettings: '"opsz" 72, "SOFT" 30', fontWeight: 380, fontSize: 'clamp(1.3rem, 2.4vw, 2rem)', lineHeight: 1.08, letterSpacing: '-0.02em', marginBottom: 'clamp(8px, 1.2vh, 14px)' }}>
                            {card.headline}
                          </h3>
                          <p style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui', fontSize: 'clamp(12px, 1vw, 14px)', lineHeight: 1.6, color: 'rgba(231,222,199,0.72)', marginBottom: 'clamp(10px, 1.6vh, 16px)', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {card.body}
                          </p>
                          {/* Meta tags */}
                          <div className="flex flex-wrap gap-2" style={{ marginBottom: 'clamp(10px, 1.4vh, 14px)' }}>
                            {[card.schedule, card.location].filter(Boolean).map((t) => (
                              <span key={t} style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(242,237,227,0.7)', background: 'rgba(242,237,227,0.1)', borderRadius: 6, padding: '4px 9px' }}>
                                {t}
                              </span>
                            ))}
                          </div>
                          {/* Points — hidden on very short tiles */}
                          <ul className="hidden sm:flex" style={{ listStyle: 'none', padding: 0, margin: 0, flexDirection: 'column', gap: 5 }}>
                            {card.points.slice(0, 3).map((pt: string) => (
                              <li key={pt} style={{ display: 'flex', alignItems: 'baseline', gap: 8, fontFamily: 'Inter, system-ui', fontSize: 'clamp(11px, 0.95vw, 12.5px)', color: 'rgba(231,222,199,0.6)', lineHeight: 1.45 }}>
                                <span style={{ color: '#B05329', flexShrink: 0, fontSize: 7 }}>●</span>
                                {pt}
                              </li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </div>

                    {/* Thesis card grows below — hover only (collapsed state) */}
                    <AnimatePresence>
                      {isHover && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                          style={{ position: 'absolute', top: '100%', left: 0, right: 0, overflow: 'hidden', zIndex: 30 }}
                        >
                          <div style={{
                            marginTop: 8, borderRadius: 14,
                            padding: 'clamp(12px, 1.6vh, 16px) clamp(13px, 1.4vw, 18px)',
                            background: 'rgba(8,6,4,0.92)',
                            backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
                            border: '1px solid rgba(242,237,227,0.12)',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.45)',
                          }}>
                            <p className="font-display italic" style={{ fontVariationSettings: '"opsz" 32, "SOFT" 40', fontWeight: 420, fontSize: 'clamp(0.95rem, 1.4vw, 1.15rem)', lineHeight: 1.25, letterSpacing: '-0.01em', color: '#F2EDE3' }}>
                              {card.badge}
                            </p>
                            <p className="font-eyebrow uppercase" style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(176,83,41,0.92)', marginTop: 7 }}>
                              {card.note}
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
          ); })()}
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
            <div className="flex flex-col md:flex-row gap-3">
              {sandhillsData.nearby.map((poi, i) => (
                <button key={poi.name} onClick={() => setNearbyIdx(i)} className="w-full md:flex-1 md:min-w-0 rounded-xl overflow-hidden relative group text-left h-[clamp(140px,38vw,180px)] md:h-[clamp(280px,44vh,440px)]">
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
          {nearbyIdx !== null && <NearbyModal pois={sandhillsData.nearby} startIdx={nearbyIdx} onClose={() => setNearbyIdx(null)} />}
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

