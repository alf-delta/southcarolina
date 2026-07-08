import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { Wifi, Bath, Utensils, Armchair, Users, Flame, Snowflake, Clock, Ban, Sailboat, Waves, Route, MapPin, TreePine, Compass, ShieldCheck, Gift, Bug, Sprout, Handshake, ArrowLeft, ArrowRight } from 'lucide-react';
import Img from '../primitives/Img';
import { sandhillsData } from '../data/sandhills';
import { openPrivateEvent } from './PrivateEventModal';
import GalleryModal from './GalleryModal';

// ── Card data ─────────────────────────────────────────────────────────────────

// Act 1 hero — crossfading slideshow on the "Forest Villa" image
const HERO_IMAGES = [
  '/images/villa/hero/1.webp',
  '/images/villa/hero/2.webp',
  '/images/villa/hero/3.webp',
  '/images/villa/hero/4.webp',
  '/images/villa/hero/5.webp',
] as const;

const COMFORT_CARDS = [
  {
    image:    '/images/comfort/king-bed.webp',
    title:    'King Bed + Sofa Bed',
    subtitle: 'Brooklinen linens, soft pillows and space to sleep up to 4 guests in comfort.',
  },
  {
    image:    '/images/comfort/kitchen.webp',
    title:    'A Kitchen That’s Actually Ready',
    subtitle: 'SMEG appliances, Nespresso coffee and everything you need for slow breakfasts or dinner after the lake.',
  },
  {
    image:    '/images/comfort/bathroom.webp',
    title:    'Everything-You-Need Bathroom',
    subtitle: 'A clean, comfortable bathroom stocked with the essentials, so you can pack lighter.',
  },
  {
    image:    '/images/comfort/marshall.webp',
    title:    'Marshall Soundtrack',
    subtitle: 'A Marshall speaker for your cabin playlist — in case the sounds of nature need a little backup.',
  },
  {
    image:    '/images/comfort/deck-firepit.webp',
    title:    'Deck, Grill & Firepit',
    subtitle: 'Your private outdoor setup with a Weber grill, Adirondack chairs and everything you need for long dinners and slow nights by the fire.',
  },
  {
    image:    '/images/bikes.webp',
    title:    'E-Bikes at Your Door',
    subtitle: 'Private e-bikes ready when you are — built for exploring the trails, the lake and everything beyond.',
  },
] as const;

const EXPERIENCE_CARDS = [
  {
    image:    '/images/sandhills/sauna.webp',
    title:    'The Sauna Ritual',
    note:     'Wood-fired heat, panoramic lake views and the kind of reset you feel immediately.',
    badge:    'Best wild spa ever',
    badgeShort: 'Best wild spa',
    headline: 'The ritual the Romans knew. You rediscover it here.',
    body:     "Wood-fired to 194 °F. The sauna sits on the water — heat, then cold, then silence. Step off the dock into the lake. Two thousand years of the same ritual, still unmatched.",
    bodyShort: 'Wood-fired to 194 °F on the water. Heat, cold plunge, silence — the same ritual, two thousand years on.',
    schedule: 'Open daily · 6 am – 11 pm',
    location: 'Lakeside sauna pavilion',
    points:   ['Wood-fired, reaches 194 °F in 40 min', 'Cold plunge in the lake, steps away', 'Seats 6 · towels provided', 'No booking needed'],
    accent:   'it here.',
    facts: [
      { icon: Flame, label: '194°F, wood-fired' },
      { icon: Snowflake, label: 'Cold plunge, lakeside' },
      { icon: Users, label: 'Seats 6' },
      { icon: Clock, label: 'No booking needed' },
    ],
  },
  {
    image:    '/qaYcANUQR-PNzw3QPCqKA_uEzp7Ijh.webp',
    title:    'The Lake',
    note:     'An 18-acre lake for swimming, fishing, floating and slow days by the water.',
    badge:    'Your ocean. No salt, no strangers.',
    badgeShort: 'Your private ocean',
    headline: 'Sixty Olympic pools. Every single one of them yours.',
    body:     'Eighteen acres of still, clean water — private to our guests, always. No jet skis, no strangers, no one doing cannonballs near your kayak. Just you, the herons, and a surface so calm in the morning it reflects the pines like a mirror. Go for a swim. Take a canoe. Sit on the dock and do absolutely nothing. All three are correct answers.',
    bodyShort: 'Eighteen acres of still, private water. Swim, canoe, or do nothing on the dock — all correct answers.',
    schedule: 'Sunrise to sunset',
    location: 'Main dock, north shore',
    points:   ['18 acres of private lake', 'No motor boats — ever', '2 Kevlar canoes · 2 paddleboards on the dock', 'Swimming, fishing, floating — all welcome'],
    accent:   'of them yours.',
    facts: [
      { icon: Waves, label: '18 private acres' },
      { icon: Ban, label: 'No motor boats' },
      { icon: Sailboat, label: '2 canoes · 2 boards' },
      { icon: Clock, label: 'Sunrise to sunset' },
    ],
  },
  {
    image:    '/images/sandhills/twelve_miles.webp',
    title:    'Trails & Rides',
    note:     'Open land, forest paths and e-bikes for exploring the property at your own pace.',
    badge:    '12 miles. Zero treadmills.',
    badgeShort: '12 miles of trails',
    headline: 'Into the pines.',
    body:     'Twelve miles of marked trail through longleaf pine savanna. Four trailheads across the property. The creek loop is the one worth finding. Illustrated map in your cabin.',
    bodyShort: 'Twelve miles of marked trail through longleaf pine. Four trailheads, map in your cabin.',
    schedule: 'All day · self-guided',
    location: '4 trailheads across the property',
    points:   ['Illustrated map in your cabin', 'Longleaf pine savanna + creek loop', 'Easy to moderate grade', 'Ends at a creek worth finding'],
    accent:   'the pines.',
    facts: [
      { icon: Route, label: '12 miles marked' },
      { icon: MapPin, label: '4 trailheads' },
      { icon: TreePine, label: 'Pine savanna + creek' },
      { icon: Compass, label: 'Self-guided, all day' },
    ],
  },
  {
    image:    '/images/experience/ready-for-the-water.webp',
    title:    'Ready for the Water',
    note:     'Kayaks, paddleboards and boats ready for quiet mornings or full-group lake adventures.',
    badge:    'The dock is stocked.',
    badgeShort: 'The dock is stocked',
    headline: 'Push off. The lake is waiting.',
    body:     'Canoes, kayaks and paddleboards live at the dock — no rental counter, no schedule. Push off into eighteen acres of still water and trace the shoreline at whatever speed the morning allows. Life jackets in every size, right where you’d look for them.',
    bodyShort: 'Canoes, kayaks and boards live at the dock. Push off whenever — life jackets in every size.',
    schedule: 'Sunrise to sunset · no booking',
    location: 'The main dock',
    points:   ['Canoes, kayaks and paddleboards at the dock', 'Life jackets in every size', '18 acres of private, calm water', 'No booking — just push off'],
    accent:   'is waiting.',
    facts: [
      { icon: Sailboat, label: 'Canoes, kayaks & boards' },
      { icon: Waves, label: '18 acres of calm water' },
      { icon: ShieldCheck, label: 'Life jackets, all sizes' },
      { icon: Clock, label: 'Sunrise to sunset' },
    ],
  },
  {
    image:    '/images/bikes.webp',
    title:    'The Open Field',
    note:     'Volleyball, soccer and open-air games for families, friends and teams.',
    badge:    'Bring your A-game.',
    badgeShort: 'Bring your A-game',
    headline: 'Room to run wild.',
    body:     'A flat stretch of open grass made for volleyball, soccer, frisbee — or whatever your group invents by day three. Nets and balls are in the shed, setup takes five minutes, and the pines keep the score to themselves.',
    bodyShort: 'Open grass for volleyball, soccer, frisbee. Nets and balls in the shed — setup takes five minutes.',
    schedule: 'Open play · all day',
    location: 'The open lawn, mid-property',
    points:   ['Volleyball and soccer setups', 'Nets and balls in the shed', 'Room for the whole group', 'Open all day'],
    accent:   'run wild.',
    facts: [
      { icon: Users, label: 'Volleyball, soccer, frisbee' },
      { icon: Sprout, label: 'Flat, open grass' },
      { icon: MapPin, label: 'Mid-property lawn' },
      { icon: Clock, label: 'Open all day' },
    ],
  },
  {
    image:    '/images/experience/pool-days.webp',
    title:    'Pool Days',
    note:     'A large outdoor pool made for long afternoons, sun, water and good company.',
    badge:    'The water is fine.',
    badgeShort: 'The water is fine',
    headline: 'Long afternoons, solved.',
    body:     'A proper outdoor pool with loungers around it and towels stacked poolside. Swim before breakfast, float through the afternoon, let the kids wear themselves out before dinner. Bring sunscreen — the rest is handled.',
    bodyShort: 'A proper outdoor pool, loungers and towels waiting. Bring sunscreen — the rest is handled.',
    schedule: 'Open daily · dawn to dusk',
    location: 'Pool terrace, by the main cabin',
    points:   ['Large outdoor pool', 'Loungers and towels poolside', 'Swim laps or just float', 'Open dawn to dusk'],
    accent:   'solved.',
    facts: [
      { icon: Waves, label: 'Big outdoor pool' },
      { icon: Armchair, label: 'Loungers for everyone' },
      { icon: Gift, label: 'Towels provided' },
      { icon: Clock, label: 'Dawn to dusk' },
    ],
  },
  {
    image:    '/images/experience/honey-from-the-land.webp',
    title:    'Honey From the Land',
    note:     'Our own beehives on property — a small taste of Sandhills, straight from nature.',
    badge:    'A million bees. All ours.',
    badgeShort: 'A million bees',
    headline: 'Twenty hives. One million workers.',
    body:     'Our apiary runs twenty hives — over a million bees foraging the longleaf pine savanna, wildflowers, and clover within the property. The honey in your welcome pantry came from fifty feet away. Ask your host for a hive walk. Nets provided.',
    bodyShort: 'Twenty hives, a million bees, honey from fifty feet away. Ask your host for a hive walk.',
    schedule: 'Hive walks by arrangement',
    location: 'Apiary meadow, south of the lake',
    points:   ['20 active hives on property', '1M+ bees · longleaf pine + wildflower honey', 'Honey in every welcome pantry', 'Guided hive walk available on request'],
    accent:   'One million workers.',
    facts: [
      { icon: Bug, label: '20 active hives' },
      { icon: Sprout, label: 'Pine + wildflower forage' },
      { icon: Gift, label: 'Honey in every pantry' },
      { icon: Handshake, label: 'Hive walk by arrangement' },
    ],
  },
  {
    image:    '/images/sandhills/fire_pit2.webp',
    title:    'By the Outdoor Fireplace',
    note:     'A large deck, warm fire, open sky and the conversations that make the trip.',
    badge:    'Where evenings land.',
    badgeShort: 'Evenings land here',
    headline: 'The fire does the hosting.',
    body:     'A wide deck, a circle of chairs and a fire that catches on the first match. The wood is stacked and dry, the sky does something cities forgot how to do, and the conversations take care of themselves. This is where the trip’s best hour happens, every night.',
    bodyShort: 'A wide deck, a ring of chairs, a fire that catches on the first match. The trip’s best hour, nightly.',
    schedule: 'Every night · wood provided',
    location: 'Fire deck, above the lake',
    points:   ['Fire pit lit every evening', 'Dry firewood stacked and ready', 'Chairs around the ring', 'Stars you can actually see'],
    accent:   'the hosting.',
    facts: [
      { icon: Flame, label: 'Lit every evening' },
      { icon: Armchair, label: 'Chairs for the whole crew' },
      { icon: TreePine, label: 'Open sky, tall pines' },
      { icon: Clock, label: 'Best after dark' },
    ],
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

// Six use-case cards, one shared design: paper card with an inset photo strip
// (rounded on all sides) above the title + benefit.
const B2B_SCENARIOS = [
  { title: 'Corporate Retreats', benefit: 'The team actually connects when no one is watching the door.', strip: '/images/sandhills/fire_pit2.webp' },
  { title: 'Family Reunions', benefit: 'Every generation under one roof, finally in the same place.', strip: '/images/sandhills/house.webp' },
  { title: 'Wellness Retreats', benefit: 'Space to slow down, with nothing pulling you back.', strip: '/images/sandhills/sauna.webp' },
  { title: 'Birthday Weekends', benefit: 'Celebrate on your own clock — no last call, no rush home.', strip: '/images/b2b/birthday-weekends.webp' },
  { title: 'Bachelor & Bachelorette', benefit: 'Your crew, your rules, complete privacy.', strip: '/images/b2b/bachelor-bachelorette.webp' },
  { title: 'Private Celebrations', benefit: 'Mark the moment without sharing the room.', strip: '/images/b2b/private-celebrations.webp' },
] as const;


// ── Main component ────────────────────────────────────────────────────────────

export default function VillaCascade() {
  const villa = sandhillsData.stays[0];

  const [galleryStartIdx, setGalleryStartIdx] = useState<number | null>(null);
  const [comfortIdx,    setComfortIdx]    = useState<number | null>(null);
  const [experienceIdx, setExperienceIdx] = useState(0);
  const [nearbyIdx,     setNearbyIdx]     = useState<number | null>(null);
  // When the B2B bone bg is showing, the whole section reads as a light zone so the
  // sticky header flips its logo/nav to dark — kept in sync with the actual bg (o5).
  const [b2bBgLight, setB2bBgLight] = useState(false);

  // Act 1 hero slideshow — auto-advancing crossfade (paused for reduced-motion)
  const reduceMotion = useReducedMotion();
  const [heroIdx, setHeroIdx] = useState(0);
  useEffect(() => {
    if (reduceMotion) return;
    const id = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(id);
  }, [reduceMotion]);

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
  const b2bRef  = useRef<HTMLDivElement>(null);

  const { scrollYProgress: p1 } = useScroll({ target: act1Ref, offset: ['start end', 'end start'] });
  const { scrollYProgress: p2 } = useScroll({ target: act2Ref, offset: ['start end', 'end start'] });
  const { scrollYProgress: p3 } = useScroll({ target: act3Ref, offset: ['start end', 'end start'] });
  const { scrollYProgress: p4 } = useScroll({ target: act4Ref, offset: ['start end', 'end start'] });
  // B2B has its own progress so its dark→bone transition tracks the block itself, not act4
  const { scrollYProgress: pB2B } = useScroll({ target: b2bRef, offset: ['start end', 'end start'] });

  // Act 1: visible from the start, fades out as act 2 takes over
  const o1 = useTransform(p1, [0, 0.80, 1], [1, 1, 0]);
  // Acts 2–4: crossfade in and out
  const o2 = useTransform(p2, [0, 0.14, 0.86, 1], [0, 1, 1, 0]);
  const o3 = useTransform(p3, [0.10, 0.26, 1], [0, 1, 1]);
  // Act 4 dark bg fades in and STAYS dark through act 4 (no early fade-out)
  const o4 = useTransform(p4, [0, 0.32, 1], [0, 1, 1]);
  // Act 4 heading: dark on light bg → linen as bg darkens
  const act4HeadingColor = useTransform(p4, [0, 0.18, 0.30], ['rgba(31,36,32,0.96)', 'rgba(31,36,32,0.96)', 'rgba(231,222,199,0.96)']);

  // Act 3 heading: linen on dark bg → ink as bone bg fades in
  const act3HeadingColor = useTransform(p3, [0.10, 0.28], ['rgba(231,222,199,0.96)', 'rgba(31,36,32,0.96)']);

  // B2B reveal: a bone layer fades IN over the dark act-4 bg as the B2B block scrolls
  // into view — anchored to the block's own progress, so the change lands while the
  // block is actually on screen. o5 = 0 → dark bg shows; o5 = 1 → bone shows.
  const o5 = useTransform(pB2B, [0.02, 0.16], [0, 1]);
  // Content lightness is the exact inverse of o5 — synced and smooth at every step.
  const b2bText  = useTransform(o5, [0, 1], ['rgba(231,222,199,0.96)', 'rgba(31,36,32,0.96)']);
  const b2bMuted = useTransform(o5, [0, 1], ['rgba(231,222,199,0.55)', 'rgba(31,36,32,0.52)']);
  const b2bLine  = useTransform(o5, [0, 1], ['rgba(231,222,199,0.16)', 'rgba(31,36,32,0.13)']);
  const b2bPanel = useTransform(o5, [0, 1], ['rgba(231,222,199,0.05)', 'rgba(31,36,32,0.028)']);

  // Flip the section's header-zone once the bone bg dominates, so the sticky header
  // logo/nav switch to dark exactly when the visible background turns light.
  useMotionValueEvent(o5, 'change', (v) => setB2bBgLight(v > 0.5));



  return (
    <>
      {/* Intro strip */}
      <div className="w-full flex items-center justify-center py-5 md:py-0" style={{ height: 'auto', minHeight: 'clamp(80px, 11vh, 120px)', background: '#EAE3D3' }}>
        <p
          className="font-display italic text-center px-6"
          style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0', fontWeight: 360, fontSize: 'clamp(1.7rem, 4vw, 2.9rem)', letterSpacing: '-0.02em', lineHeight: 1.06, color: 'rgba(31,36,32,0.9)' }}
        >
          Step inside.{' '}
          <span style={{ color: '#B05329' }}>Stay outside.</span>
        </p>
      </div>

      <section id="stays" data-zone={b2bBgLight ? 'light' : 'dark'} className="text-linen relative" style={{ backgroundColor: '#090706' }}>

        {/* ── Scroll-linked gradient background ───────────────────────────── */}
        {/* sticky height-0 holder stays at top of viewport; abs child fills 100vh */}
        <div style={{ position: 'sticky', top: 0, height: 0, zIndex: 0, overflow: 'visible', pointerEvents: 'none' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh' }}>
            <motion.div style={{ position: 'absolute', inset: 0, opacity: o1, ...bgForest }} />
            <motion.div style={{ position: 'absolute', inset: 0, opacity: o2, ...bgComfort }} />
            <motion.div style={{ position: 'absolute', inset: 0, opacity: o3, ...bgTerritory }} />
            <motion.div style={{ position: 'absolute', inset: 0, opacity: o4, ...bgRooms }} />
            {/* Bone layer that reappears over the dark act-4 bg as the B2B block scrolls in */}
            <motion.div style={{ position: 'absolute', inset: 0, opacity: o5, ...bgTerritory }} />

          </div>
        </div>

        {/* ── Act 1 — Villa ───────────────────────────────────────────────── */}
        <div
          ref={act1Ref}
          className="relative flex flex-col px-6 pb-6 pt-[72px] md:px-12 md:pb-12 md:pt-[72px] lg:px-16 lg:pb-16"
          style={{ zIndex: 1 }}
        >
          <div className="w-full max-w-content mx-auto flex flex-col gap-2">

          {/* ── Mobile listing — full-bleed photo fading out, title + spec grid + swipe gallery ── */}
          <div className="md:hidden">
            {/* Photo slideshow, edge-to-edge; alpha mask dissolves it into whatever bg is behind */}
            <div
              className="relative overflow-hidden -mx-6"
              style={{
                height: '54vh', minHeight: 380,
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 9%, black 52%, transparent 99%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 9%, black 52%, transparent 99%)',
              }}
              onClick={() => setGalleryStartIdx(0)}
            >
              {HERO_IMAGES.map((src, i) => (
                <motion.div
                  key={src}
                  style={{ position: 'absolute', inset: 0 }}
                  initial={false}
                  animate={{ opacity: i === heroIdx ? 1 : 0 }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Img src={src} alt="Forest Villa exterior" className="w-full h-full object-cover" decoding="async" />
                </motion.div>
              ))}
            </div>

            {/* Title block — sits in the photo's faded zone */}
            <div style={{ position: 'relative', zIndex: 1, marginTop: 'clamp(-140px, -18vh, -100px)' }}>
              <h2 className="font-display" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 20, "WONK" 0', fontWeight: 340, fontSize: 'clamp(3rem, 14vw, 4rem)', lineHeight: 1, letterSpacing: '-0.03em', color: 'rgba(242,237,227,1)', marginBottom: 10, textShadow: '0 2px 24px rgba(0,0,0,0.8)' }}>
                Forest Villa
              </h2>
              <p className="font-eyebrow uppercase" style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: '#D4804E', marginBottom: 12 }}>
                Five-Star Comfort, Forest Edition
              </p>
              <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, lineHeight: 1.55, color: 'rgba(231,222,199,0.82)' }}>
                Surrounded by pines and lake views. Your private retreat for rest, reset and real connection.
              </p>
            </div>

            {/* Spec grid — glass panel, icon left + label */}
            <div className="rounded-2xl" style={{ marginTop: 18, padding: '2px 16px', background: 'rgba(120,116,110,0.14)', border: '1px solid rgba(242,237,227,0.14)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
              <div className="grid grid-cols-3">
                {[
                  { Icon: Users, label: 'Up to 4\nGuests' },
                  { Icon: Bath, label: '1\nBathroom' },
                  { Icon: Utensils, label: 'Equipped\nKitchen' },
                ].map(({ Icon, label }, i) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0', paddingLeft: i > 0 ? 12 : 0, borderLeft: i > 0 ? '1px solid rgba(242,237,227,0.12)' : 'none' }}>
                    <Icon style={{ width: 22, height: 22, color: '#D4804E', flexShrink: 0 }} strokeWidth={1.5} />
                    <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1.4, color: 'rgba(242,237,227,0.88)', whiteSpace: 'pre-line' }}>{label}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2" style={{ borderTop: '1px solid rgba(242,237,227,0.12)' }}>
                {[
                  { Icon: Wifi, label: 'Wi-Fi' },
                  { Icon: Armchair, label: 'Private\nDeck' },
                ].map(({ Icon, label }, i) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 0', paddingLeft: i > 0 ? 12 : 0, borderLeft: i > 0 ? '1px solid rgba(242,237,227,0.12)' : 'none' }}>
                    <Icon style={{ width: 22, height: 22, color: '#D4804E', flexShrink: 0 }} strokeWidth={1.5} />
                    <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 10, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase', lineHeight: 1.4, color: 'rgba(242,237,227,0.88)', whiteSpace: 'pre-line' }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Gallery header */}
            <div className="flex items-end justify-between" style={{ marginTop: 26, marginBottom: 12 }}>
              <p className="font-display" style={{ fontVariationSettings: '"opsz" 72, "SOFT" 30', fontWeight: 380, fontSize: '1.7rem', letterSpacing: '-0.015em', color: 'rgba(242,237,227,0.97)', margin: 0 }}>
                Gallery
              </p>
              <button onClick={() => setGalleryStartIdx(0)} className="flex items-center" style={{ gap: 6, background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 14, color: '#D4804E' }}>
                See all
                <ArrowRight style={{ width: 15, height: 15 }} strokeWidth={1.8} />
              </button>
            </div>

            {/* Swipeable mini-gallery — active thumb framed, synced with the slideshow */}
            <div className="vc-mob-gal flex overflow-x-auto" style={{ gap: 10, paddingBottom: 4, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style>{`.vc-mob-gal::-webkit-scrollbar { display: none; }`}</style>
              {HERO_IMAGES.map((src, i) => {
                const active = i === heroIdx;
                return (
                  <button
                    key={src}
                    onClick={() => setHeroIdx(i)}
                    aria-pressed={active}
                    className="relative shrink-0 overflow-hidden"
                    style={{ width: '33vw', maxWidth: 150, height: '46vw', maxHeight: 215, borderRadius: 18 }}
                  >
                    <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: 18, boxShadow: active ? 'inset 0 0 0 2px #D4804E' : 'inset 0 0 0 1px rgba(231,222,199,0.14)', background: active ? 'transparent' : 'rgba(8,6,4,0.25)', transition: 'box-shadow 0.3s ease, background 0.3s ease' }} />
                  </button>
                );
              })}
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center" style={{ gap: 7, marginTop: 14 }}>
              {HERO_IMAGES.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setHeroIdx(i)}
                  aria-label={`Photo ${i + 1}`}
                  style={{ width: 7, height: 7, borderRadius: 999, padding: 0, border: 'none', background: i === heroIdx ? '#D4804E' : 'rgba(242,237,227,0.3)', transition: 'background 0.2s ease' }}
                />
              ))}
            </div>
          </div>

          {/* Full-bleed exterior photo with reveal animation */}
          <motion.div
            className="hidden md:block w-full rounded-2xl overflow-hidden cursor-pointer relative"
            style={{ height: 'clamp(420px, 80vh, 960px)' }}
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.15, ease: [0.22, 1, 0.36, 1] }}
            onClick={() => setGalleryStartIdx(0)}
          >
            {/* Crossfading slideshow */}
            {HERO_IMAGES.map((src, i) => (
              <motion.div
                key={src}
                style={{ position: 'absolute', inset: 0 }}
                initial={false}
                animate={{ opacity: i === heroIdx ? 1 : 0 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Img
                  src={src}
                  alt="Forest Villa exterior"
                  className="w-full h-full object-cover object-bottom"
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  decoding="async"
                />
              </motion.div>
            ))}
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
                justifyContent: 'space-between',
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
                    Five-Star Comfort, Forest Edition
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
                display: 'inline-flex', flexWrap: 'wrap', gap: 'clamp(9px, 1.58vw, 18px)',
                padding: 'clamp(14px, 2.07vh, 23px) clamp(18px, 2.3vw, 28px)',
                borderRadius: 16,
                background: 'rgba(120,116,110,0.30)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(242,237,227,0.22)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30), inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 -8px 18px rgba(0,0,0,0.16), 0 12px 32px rgba(0,0,0,0.30)',
              }}>
                {/* Guests */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 'clamp(62px, 7.48vw, 90px)' }}>
                  <Users style={{ width: 'clamp(1.52rem, 2.48vw, 2.07rem)', height: 'clamp(1.52rem, 2.48vw, 2.07rem)', color: '#D4804E', filter: 'drop-shadow(0 1px 8px rgba(0,0,0,0.7))' }} strokeWidth={1.3} />
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(231,222,199,0.62)', textAlign: 'center', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>Up to<br />4 Guests</span>
                </div>
                {/* Bathroom */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 'clamp(62px, 7.48vw, 90px)' }}>
                  <Bath style={{ width: 'clamp(1.52rem, 2.48vw, 2.07rem)', height: 'clamp(1.52rem, 2.48vw, 2.07rem)', color: '#D4804E', filter: 'drop-shadow(0 1px 8px rgba(0,0,0,0.7))' }} strokeWidth={1.3} />
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(231,222,199,0.62)', textAlign: 'center', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>Bathroom</span>
                </div>
                {/* Equipped Kitchen */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 'clamp(62px, 7.48vw, 90px)' }}>
                  <Utensils style={{ width: 'clamp(1.52rem, 2.48vw, 2.07rem)', height: 'clamp(1.52rem, 2.48vw, 2.07rem)', color: '#D4804E', filter: 'drop-shadow(0 1px 8px rgba(0,0,0,0.7))' }} strokeWidth={1.3} />
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(231,222,199,0.62)', textAlign: 'center', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>Equipped<br />Kitchen</span>
                </div>
                {/* Wi-Fi */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 'clamp(62px, 7.48vw, 90px)' }}>
                  <Wifi style={{ width: 'clamp(1.52rem, 2.48vw, 2.07rem)', height: 'clamp(1.52rem, 2.48vw, 2.07rem)', color: '#D4804E', filter: 'drop-shadow(0 1px 8px rgba(0,0,0,0.7))' }} strokeWidth={1.3} />
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(231,222,199,0.62)', textAlign: 'center', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>Wi-Fi</span>
                </div>
                {/* Private Deck */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, width: 'clamp(62px, 7.48vw, 90px)' }}>
                  <Armchair style={{ width: 'clamp(1.52rem, 2.48vw, 2.07rem)', height: 'clamp(1.52rem, 2.48vw, 2.07rem)', color: '#D4804E', filter: 'drop-shadow(0 1px 8px rgba(0,0,0,0.7))' }} strokeWidth={1.3} />
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 10, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(231,222,199,0.62)', textAlign: 'center', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>Private<br />Deck</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Thumbnail strip — mirrors the hero slideshow, active one framed */}
          <div className="hidden md:flex gap-2 mt-2">
            {HERO_IMAGES.map((src, i) => {
              const active = i === heroIdx;
              return (
                <motion.button
                  key={src}
                  className="flex-1 rounded-xl overflow-hidden relative group"
                  style={{ height: 'clamp(140px, 22vh, 240px)' }}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 + i * 0.07 }}
                  onClick={() => setHeroIdx(i)}
                  aria-label={`Show Forest Villa photo ${i + 1}`}
                  aria-pressed={active}
                >
                  <img
                    src={src}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Dim inactive thumbs slightly so the active one reads clearly */}
                  <div
                    className="absolute inset-0 transition-colors duration-300 rounded-xl"
                    style={{ background: active ? 'rgba(8,6,4,0)' : 'rgba(8,6,4,0.32)' }}
                  />
                  {/* Active frame */}
                  <div
                    className="absolute inset-0 rounded-xl pointer-events-none transition-all duration-300"
                    style={{
                      boxShadow: active
                        ? 'inset 0 0 0 2px #D4804E, 0 4px 18px rgba(176,83,41,0.35)'
                        : 'inset 0 0 0 1px rgba(231,222,199,0)',
                    }}
                  />
                </motion.button>
              );
            })}
          </div>
          </div>{/* /max-w-content wrapper */}
        </div>

        {/* ── Act 2 — Comfort ─────────────────────────────────────────────── */}
        <div ref={act2Ref} className="relative flex flex-col px-6 pb-6 pt-3 md:px-12 md:pb-12 md:pt-5 lg:px-16 lg:pb-16 lg:pt-6" style={{ zIndex: 1 }}>
          <div className="w-full max-w-content mx-auto">
          <div>
            {/* Typographic interlude — mixed scale */}
            <div className="text-center mx-auto" style={{ maxWidth: '68rem', paddingTop: 'clamp(0px, 0.6vh, 8px)', paddingBottom: 'clamp(32px, 6vh, 76px)' }}>
              <h2 className="font-display text-linen" style={{ lineHeight: 1.04, letterSpacing: '-0.02em', margin: 0 }}>
                <span style={{ display: 'block', fontVariationSettings: '"wght" 350, "opsz" 144, "SOFT" 50, "WONK" 0', fontSize: 'clamp(2.5rem, 5.8vw, 5rem)', color: 'rgba(242,237,227,0.97)' }}>
                  Thoughtfully Stocked.
                </span>
                <span style={{ display: 'block', fontStyle: 'italic', fontVariationSettings: '"wght" 340, "opsz" 96, "SOFT" 40, "WONK" 0', fontSize: 'clamp(1.9rem, 4.4vw, 3.6rem)', color: 'rgba(231,222,199,0.55)', marginTop: 'clamp(6px, 1.2vh, 16px)' }}>
                  Effortlessly <span style={{ color: '#B05329' }}>Comfortable.</span>
                </span>
              </h2>
            </div>

            <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
              {COMFORT_CARDS.map((card, i) => (
                <button key={card.title} onClick={() => setComfortIdx(i)} className="rounded-xl overflow-hidden relative group text-left cursor-pointer" style={{ height: 'clamp(192px, 31vh, 308px)' }}>
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 px-3.5 pb-3.5 pt-16" style={{ background: 'linear-gradient(to top, rgba(8,6,4,0.97) 0%, rgba(8,6,4,0.72) 52%, transparent 100%)' }}>
                    <p className="font-display leading-tight" style={{ fontVariationSettings: '"wght" 600, "opsz" 48, "SOFT" 20', fontWeight: 600, fontSize: 'clamp(1.155rem, 2.09vw, 1.485rem)', letterSpacing: '-0.01em', marginBottom: 5, color: 'rgba(242,237,227,0.97)' }}>{card.title}</p>
                    <p style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui', fontSize: 'clamp(11px, 1vw, 12.5px)', lineHeight: 1.45, color: 'rgba(231,222,199,0.7)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{card.subtitle}</p>
                  </div>
                  <div className="absolute inset-0 ring-1 ring-inset ring-linen/10 group-hover:ring-linen/30 rounded-xl transition-all duration-200" />
                </button>
              ))}
            </div>
          </div>
          </div>
        </div>

        {/* ── Act 3 — Experience (anchor target for "The Land" nav) ───────── */}
        <div
          id="land"
          ref={act3Ref}
          data-zone="light"
          className="relative flex flex-col p-6 md:p-12 lg:p-16"
          style={{ zIndex: 1, scrollMarginTop: '80px' }}
        >
          <div className="w-full max-w-content mx-auto">

          <div className="relative pt-4 md:pt-6 max-w-[52rem]" style={{ zIndex: 1 }}>
            <motion.h2 className="font-display mb-3 md:mb-4" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0', fontWeight: 380, fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: act3HeadingColor }}>
              Life Outside the Villa
            </motion.h2>
            <motion.p className="font-display italic max-w-[46rem]" style={{ fontVariationSettings: '"opsz" 64, "SOFT" 40, "WONK" 0', fontWeight: 380, fontSize: 'clamp(1.5rem, 2.75vw, 2.13rem)', lineHeight: 1.32, letterSpacing: '-0.01em', color: '#B05329' }}>
              What happens beyond your door isn't an add-on. It's the reason you came.
            </motion.p>
          </div>

          {/* ── Experience panel — one large card at a time, chips below switch between them ── */}
          <div style={{ marginTop: 'clamp(14px, 2.4vh, 28px)', paddingBottom: 'clamp(36px, 4vh, 48px)' }}>
            <ExperiencePanel cards={EXPERIENCE_CARDS} currentIdx={experienceIdx} onSelect={setExperienceIdx} />
          </div>
          </div>{/* /max-w-content */}
        </div>

        {/* ── Act 4 — Discovery ───────────────────────────────────────────── */}
        <div ref={act4Ref} className="relative flex flex-col px-6 pb-6 pt-2 md:px-12 md:pb-12 md:pt-3 lg:px-16 lg:pb-16 lg:pt-4" style={{ zIndex: 1 }}>
          <div className="w-full max-w-content mx-auto">
          <div className="max-w-[52rem]">
            <motion.h2 className="font-display mb-3 md:mb-4" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0', fontWeight: 380, fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.02em', color: act4HeadingColor }}>
              Just Beyond the Trees
            </motion.h2>
            <motion.p className="font-display italic max-w-[46rem]" style={{ fontVariationSettings: '"opsz" 64, "SOFT" 40, "WONK" 0', fontWeight: 380, fontSize: 'clamp(1.5rem, 2.75vw, 2.13rem)', lineHeight: 1.32, letterSpacing: '-0.01em', color: '#B05329' }}>
              Small towns, state parks, farm stands and scenic Sandhills roads — all close enough for a slow afternoon outside the property.
            </motion.p>
          </div>
          <div style={{ marginTop: 'clamp(20px, 3vh, 32px)' }}>
            <div className="flex flex-col md:flex-row gap-3">
              {sandhillsData.nearby.map((poi, i) => (
                <button key={poi.name} onClick={() => setNearbyIdx(i)} className="w-full md:flex-1 md:min-w-0 rounded-xl overflow-hidden relative group text-left h-[clamp(140px,38vw,180px)] md:h-[clamp(280px,44vh,440px)]">
                  <img src={poi.image} alt={poi.name} className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy" />
                  <div className="absolute inset-x-0 bottom-0 px-3 pb-3 pt-16" style={{ background: 'linear-gradient(to top, rgba(8,6,4,0.97) 0%, rgba(8,6,4,0.72) 52%, transparent 100%)' }}>
                    <p className="font-eyebrow text-signal uppercase mb-[5px]" style={{ fontSize: '9px', letterSpacing: '0.24em' }}>{poi.distance}</p>
                    <p className="font-display text-linen leading-tight mb-1" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 20', fontWeight: 380, fontStyle: 'italic', fontSize: 'clamp(1.05rem, 1.9vw, 1.4rem)', letterSpacing: '-0.01em' }}>{poi.name}</p>
                    <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(11px, 1vw, 12.5px)', lineHeight: 1.45, color: 'rgba(231,222,199,0.7)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{poi.description}</p>
                  </div>
                  <div className="absolute inset-0 ring-1 ring-inset ring-linen/0 group-hover:ring-linen/20 rounded-xl transition-all duration-300" />
                </button>
              ))}
            </div>
          </div>
          </div>{/* /max-w-content */}
        </div>

        {/* ── B2B — Private hire (frosted matte glass, colors invert with bg) ── */}
        <div ref={b2bRef} className="relative flex flex-col px-6 pb-14 pt-6 md:px-12 md:pb-24 md:pt-10 lg:px-16" style={{ zIndex: 1 }}>
          <div className="w-full max-w-content mx-auto">
            {/* Headline — sits on the page, outside the panel */}
            <motion.h2 className="font-display" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0', fontWeight: 380, fontSize: 'clamp(2.1rem, 4.5vw, 3.7rem)', lineHeight: 1.06, letterSpacing: '-0.02em', maxWidth: '20ch', marginBottom: 'clamp(20px, 3vh, 34px)', color: b2bText }}>
              Your private event deserves more than a restaurant table.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: 'relative',
                borderRadius: 28,
                overflow: 'hidden',
                background: b2bPanel,
                backdropFilter: 'blur(30px) saturate(118%)',
                WebkitBackdropFilter: 'blur(30px) saturate(118%)',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: b2bLine,
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.18), 0 30px 90px rgba(0,0,0,0.18)',
                padding: 'clamp(28px, 4vh, 48px) clamp(24px, 4vw, 68px) clamp(40px, 7.5vh, 96px)',
              }}
            >
              {/* warm sheen, top-left */}
              <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(130% 90% at 0% 0%, rgba(176,83,41,0.12), transparent 55%)' }} />

              <div style={{ position: 'relative' }}>
                {/* Lead-in line */}
                <p className="font-display italic" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 50, "WONK" 0', fontWeight: 400, fontSize: 'clamp(1.5rem, 3vw, 2.45rem)', lineHeight: 1.18, letterSpacing: '-0.015em', color: '#C2632F', marginBottom: 'clamp(22px, 3vh, 34px)' }}>
                  Take over the whole retreat.
                </p>

                {/* Capacity — bare editorial stats: hairline, label, big signal numeral, note */}
                <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'clamp(14px, 2.4vw, 40px)', marginBottom: 'clamp(30px, 4vh, 52px)' }}>
                  {[
                    { label: 'Daily Events', pre: 'Up to', num: '200', unit: 'guests', note: 'for private gatherings & celebrations' },
                    { label: 'Overnight Stay', pre: 'Up to', num: '40', unit: 'guests', note: 'adults and kids are welcome' },
                    { label: 'Minimum Stay', pre: 'From', num: '1', unit: 'night', note: "stay longer — you won't want to leave" },
                  ].map((card) => (
                    <motion.div
                      key={card.label}
                      style={{ borderTopWidth: 2, borderTopStyle: 'solid', borderTopColor: '#B05329', paddingTop: 'clamp(12px, 1.8vh, 18px)' }}
                    >
                      <p className="font-eyebrow text-signal uppercase" style={{ fontSize: 'clamp(12.5px, 1.05vw, 14px)', fontWeight: 700, letterSpacing: '0.16em', marginBottom: 'clamp(8px, 1.2vh, 12px)' }}>
                        {card.label}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(7px, 0.8vw, 11px)', marginBottom: 'clamp(6px, 0.9vh, 9px)' }}>
                        <motion.span className="font-eyebrow uppercase" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: b2bMuted, flexShrink: 0 }}>
                          {card.pre}
                        </motion.span>
                        <span className="font-display" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 0', fontWeight: 330, fontSize: 'clamp(2.6rem, 4.2vw, 3.6rem)', lineHeight: 0.86, letterSpacing: '-0.035em', color: '#B05329' }}>
                          {card.num}
                        </span>
                        <motion.span className="font-display italic" style={{ fontVariationSettings: '"opsz" 40, "SOFT" 40, "WONK" 0', fontWeight: 380, fontSize: 'clamp(1.05rem, 1.5vw, 1.35rem)', letterSpacing: '-0.01em', color: b2bText }}>
                          {card.unit}
                        </motion.span>
                      </div>
                      <motion.p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.8rem, 0.92vw, 0.88rem)', lineHeight: 1.45, color: b2bMuted }}>
                        {card.note}
                      </motion.p>
                    </motion.div>
                  ))}
                </div>

                {/* Perfect for — benefits, not options */}
                <div style={{ marginBottom: 'clamp(34px, 4.5vh, 56px)' }}>
                  <div className="flex items-center" style={{ gap: 10, marginBottom: 'clamp(18px, 2.6vh, 26px)' }}>
                    <span aria-hidden="true" style={{ display: 'block', width: 28, height: 1, background: '#D4804E', flexShrink: 0 }} />
                    <motion.span className="font-eyebrow uppercase" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.22em', color: b2bMuted }}>
                      Perfect for
                    </motion.span>
                  </div>
                  {/* Scenario cards — one shared design: paper card, inset photo strip
                      rounded on all sides, title + benefit below. Static by design. */}
                  <div className="grid grid-cols-1 sm:grid-cols-3" style={{ gap: 'clamp(12px, 1.6vw, 20px)' }}>
                    {B2B_SCENARIOS.map((scenario) => (
                      <div
                        key={scenario.title}
                        className="overflow-hidden"
                        style={{
                          borderRadius: 14,
                          background: 'linear-gradient(168deg, #F5F0E7 0%, #E9E1CF 100%)',
                          border: '1px solid rgba(31,36,32,0.10)',
                          boxShadow: '0 1px 1px rgba(31,36,32,0.05), 0 10px 24px rgba(31,36,32,0.14), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(31,36,32,0.06)',
                        }}
                      >
                        {/* Photo — 16:9, identical height in every equal-width column */}
                        <div style={{ padding: '5px 5px 0' }}>
                          <div style={{ aspectRatio: '16/9', overflow: 'hidden', borderRadius: 10, boxShadow: 'inset 0 0 0 1px rgba(31,36,32,0.08)' }}>
                            <img src={scenario.strip} alt="" aria-hidden="true" loading="lazy" className="w-full h-full object-cover" style={{ display: 'block' }} />
                          </div>
                        </div>
                        {/* Text — fixed height so every card ends at the same line */}
                        <div style={{ height: 'clamp(96px, 12.5vh, 110px)', overflow: 'hidden', padding: 'clamp(12px, 1.8vh, 18px) clamp(18px, 2vw, 26px) 0' }}>
                          <p className="font-display" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 30', fontWeight: 380, fontSize: 'clamp(1.2rem, 1.7vw, 1.5rem)', lineHeight: 1.12, letterSpacing: '-0.012em', marginBottom: 7, color: 'rgba(31,36,32,0.94)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {scenario.title}
                          </p>
                          <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.8rem, 0.92vw, 0.9rem)', lineHeight: 1.5, color: 'rgba(31,36,32,0.56)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {scenario.benefit}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Closing band — statement + CTA, tied by a hairline rule */}
                <motion.div
                  className="flex flex-col md:flex-row md:items-center md:justify-between"
                  style={{
                    gap: 'clamp(20px, 3vw, 44px)',
                    paddingTop: 'clamp(28px, 4vh, 44px)',
                    borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: b2bLine,
                  }}
                >
                  <motion.h3 className="font-display" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 40, "WONK" 0', fontWeight: 380, fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)', lineHeight: 1.12, letterSpacing: '-0.015em', maxWidth: '16ch', margin: 0, color: b2bText }}>
                    The whole property becomes <span style={{ fontStyle: 'italic', color: '#C2632F' }}>the event.</span>
                  </motion.h3>
                  <button
                    onClick={openPrivateEvent}
                    className="self-start md:self-auto"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: 10,
                      background: '#B05329', color: '#F2EDE3', border: 'none', cursor: 'pointer',
                      padding: 'clamp(13px, 1.7vh, 17px) clamp(24px, 2.6vw, 34px)',
                      borderRadius: 999, flexShrink: 0, whiteSpace: 'nowrap',
                      fontFamily: 'Inter Tight, Inter, system-ui, sans-serif',
                      fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
                    }}
                  >
                    Plan Your Private Getaway
                    <span style={{ fontSize: 14, lineHeight: 1 }}>→</span>
                  </button>
                </motion.div>
              </div>
            </motion.div>
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

// ── Comfort lightbox — enlarges the photo, caption stays card-sized ────────────

function ComfortModal({ cards, startIdx, onClose }: { cards: typeof COMFORT_CARDS; startIdx: number; onClose: () => void }) {
  const [currentIdx, setCurrentIdx] = useState(startIdx);
  const go = (dir: number) => setCurrentIdx((i) => (i + dir + cards.length) % cards.length);
  const card = cards[currentIdx];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') go(-1);
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const Arrow = ({ dir }: { dir: number }) => (
    <button
      onClick={(e) => { e.stopPropagation(); go(dir); }}
      aria-label={dir < 0 ? 'Previous' : 'Next'}
      className="absolute top-1/2 -translate-y-1/2 z-20 flex items-center justify-center rounded-full bg-night/50 backdrop-blur-sm hover:bg-night/75 text-linen/80 hover:text-linen transition-all"
      style={{ [dir < 0 ? 'left' : 'right']: 'clamp(10px, 1.4vw, 18px)', width: 'clamp(40px, 4vw, 52px)', height: 'clamp(40px, 4vw, 52px)' } as React.CSSProperties}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5" style={{ transform: dir < 0 ? 'none' : 'rotate(180deg)' }} aria-hidden="true">
        <path d="M15 18l-6-6 6-6" />
      </svg>
    </button>
  );

  return (
    <motion.div className="fixed inset-0 z-[300] flex items-center justify-center p-5 md:p-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} onClick={onClose}>
      <div className="absolute inset-0 bg-night/80 backdrop-blur-md" />
      <motion.div
        className="relative z-10 w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ aspectRatio: '16/10', maxHeight: '86vh' }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.97 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIdx}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
            {/* Caption — same sizes as on the card */}
            <div className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-24" style={{ background: 'linear-gradient(to top, rgba(8,6,4,0.97) 0%, rgba(8,6,4,0.72) 52%, transparent 100%)' }}>
              <p className="font-display leading-tight" style={{ fontVariationSettings: '"wght" 600, "opsz" 48, "SOFT" 20', fontWeight: 600, fontSize: 'clamp(1.155rem, 2.09vw, 1.485rem)', letterSpacing: '-0.01em', marginBottom: 5, color: 'rgba(242,237,227,0.97)' }}>{card.title}</p>
              <p style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui', fontSize: 'clamp(11px, 1vw, 12.5px)', lineHeight: 1.45, color: 'rgba(231,222,199,0.7)', maxWidth: '52ch' }}>{card.subtitle}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <Arrow dir={-1} />
        <Arrow dir={1} />

        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-20 flex items-center justify-center w-8 h-8 rounded-full bg-night/50 backdrop-blur-sm hover:bg-night/70 text-linen/70 hover:text-linen transition-all">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5"><path d="M2.22 2.22a.75.75 0 011.06 0L8 6.94l4.72-4.72a.75.75 0 111.06 1.06L9.06 8l4.72 4.72a.75.75 0 11-1.06 1.06L8 9.06l-4.72 4.72a.75.75 0 01-1.06-1.06L6.94 8 2.22 3.28a.75.75 0 010-1.06z" /></svg>
        </button>
      </motion.div>
    </motion.div>
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

// ── Experience Panel ──────────────────────────────────────────────────────────
// Always-visible, inline (not a modal) — one full-bleed photo "hero" card at a
// time. Left column: badge, serif headline with an accent tail, body copy and
// an icon fact-row. The card's lower third hosts photo mini-cards for the
// other experiences (3 per page on desktop, 1 on mobile) with pagination dots
// and side arrows; clicking a mini-card promotes it to the main view.

const EXP_ACCENT = '#D4804E';

function ExperiencePanel({ cards, currentIdx, onSelect }: { cards: typeof EXPERIENCE_CARDS; currentIdx: number; onSelect: (i: number) => void }) {
  const reduceMotion = useReducedMotion();
  const card = cards[currentIdx];

  // Desktop mini-strip paging; the mobile layout uses a free-scrolling strip instead
  const perPage = 4;
  const [page, setPage] = useState(0);

  // Mobile swipe on the photo/content area — horizontal, with vertical-scroll dominance guard
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    touchStart.current = { x: t.clientX, y: t.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const s = touchStart.current;
    touchStart.current = null;
    if (!s) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - s.x;
    const dy = t.clientY - s.y;
    if (Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      onSelect(dx < 0 ? (currentIdx + 1) % cards.length : (currentIdx - 1 + cards.length) % cards.length);
    }
  };

  const pageCount = Math.ceil(cards.length / perPage);
  const safePage = Math.min(page, pageCount - 1);
  const visible = cards.map((_, i) => i).slice(safePage * perPage, safePage * perPage + perPage);
  const flip = (dir: number) => setPage((safePage + dir + pageCount) % pageCount);

  const accentStart = Math.max(0, card.headline.length - card.accent.length);
  const headlinePrefix = card.headline.slice(0, accentStart);
  const headlineAccent = card.headline.slice(accentStart);

  // Shared Next capsule — rendered in both the desktop and mobile trees
  const nextCapsule = (
    <motion.button
      onClick={() => onSelect((currentIdx + 1) % cards.length)}
      aria-label="Next experience"
      className="group font-eyebrow uppercase absolute flex items-center bg-signal hover:bg-signal2 transition-colors"
      animate={reduceMotion ? undefined : {
        filter: ['brightness(1)', 'brightness(1.1)', 'brightness(1)'],
        boxShadow: [
          '0 0 0px 0px rgba(176,83,41,0)',
          '0 0 16px 3px rgba(176,83,41,0.45)',
          '0 0 0px 0px rgba(176,83,41,0)',
        ],
      }}
      transition={reduceMotion ? undefined : { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
      style={{
        top: 'clamp(20px, 2.6vw, 32px)', right: 'clamp(24px, 4vw, 56px)', zIndex: 2,
        gap: 9, fontSize: '11px', letterSpacing: '0.24em', color: '#F2EDE3',
        padding: '7px 15px', borderRadius: 999, border: 'none',
        cursor: 'pointer', whiteSpace: 'nowrap',
      }}
    >
      Next
      <span
        className="transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
        style={{ color: '#F2EDE3', fontSize: 14, lineHeight: 1 }}
        aria-hidden="true"
      >
        →
      </span>
    </motion.button>
  );

  return (
    <>
    <div className="hidden md:block relative w-full overflow-hidden" style={{ borderRadius: 28, height: 'clamp(620px, 92vh, 980px)', boxShadow: '0 28px 64px rgba(0,0,0,0.28)', backgroundColor: '#1A1F1B' }}>
      {/* Overlapping crossfade — the new slide fades in on top of the old one (no background flash),
          while its photo settles from a slight zoom (same reveal language as the Act 1 villa photo). */}
      <AnimatePresence initial={false}>
        <motion.div
          key={currentIdx}
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ willChange: 'opacity' }}
        >
          <motion.img
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
            initial={{ scale: reduceMotion ? 1 : 1.06 }}
            animate={{ scale: 1 }}
            transition={{ duration: reduceMotion ? 0 : 1.1, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Directional scrim — keeps the left copy readable, right half of the photo stays visible */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(26,31,27,0.82) 0%, rgba(26,31,27,0.45) 40%, rgba(26,31,27,0.12) 65%, transparent 85%)' }} />
          {/* Light global veil */}
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(26,31,27,0.10)' }} />
          {/* Bottom wash under the mini-cards */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,6,4,0.72) 0%, rgba(8,6,4,0.28) 26%, transparent 44%)' }} />

          {/* Index + badge capsule on one line (right side reserved for the Next capsule) */}
          <div style={{ position: 'absolute', top: 'clamp(20px, 2.6vw, 32px)', left: 'clamp(24px, 4vw, 56px)', right: 'clamp(110px, 13vw, 180px)', display: 'flex', alignItems: 'center', gap: 'clamp(14px, 1.8vw, 24px)' }}>
            <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 'clamp(18px, 1.8vw, 23px)', fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(242,237,227,0.92)', flexShrink: 0 }}>
              {String(currentIdx + 1).padStart(2, '0')}
            </span>
            <p className="font-eyebrow uppercase" style={{
              fontSize: '11px', letterSpacing: '0.24em', color: EXP_ACCENT, margin: 0,
              padding: '7px 15px', borderRadius: 999, border: '1px solid rgba(212,128,78,0.55)', display: 'inline-block', whiteSpace: 'nowrap',
              background: 'rgba(26,31,27,0.35)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
            }}>
              {card.badge}
            </p>
          </div>

          {/* Left content column — top-aligned so it clears the mini-card strip below */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-start', padding: 'clamp(64px, 8.5vh, 108px) clamp(24px, 4vw, 56px) 0' }}>
            <div className="w-full">
              {/* Headline gets a wider lane than the body so it never wraps past 2 lines */}
              <h2 className="font-display max-w-full md:max-w-[min(62%,800px)]" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 30', fontWeight: 380, fontSize: 'clamp(2rem, 3.8vw, 3.9rem)', lineHeight: 1.06, letterSpacing: '-0.02em', color: 'rgba(242,237,227,0.98)', marginBottom: 'clamp(14px, 2vh, 22px)' }}>
                {headlinePrefix}<span style={{ color: EXP_ACCENT }}>{headlineAccent}</span>
              </h2>
              <p className="max-w-[560px] md:max-w-[min(46%,560px)]" style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui', fontSize: 'clamp(14px, 1.15vw, 17px)', lineHeight: 1.6, color: 'rgba(231,222,199,0.88)', marginBottom: 'clamp(20px, 3vh, 34px)', textShadow: '0 1px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.45)' }}>
                {card.body}
              </p>

              {/* Icon fact row — icon left, label right, hairline dividers.
                  Wide single-row lane: items share the width evenly, labels wrap to 2 lines max, icons never drop to a second row. */}
              <div className="flex items-start flex-nowrap max-w-full md:max-w-[min(52%,660px)]" style={{ gap: 'clamp(8px, 1vw, 14px)' }}>
                {card.facts.map((f, i) => {
                  const Icon = f.icon;
                  return (
                    <div key={f.label} className="flex items-start" style={{ gap: 'clamp(8px, 1vw, 14px)', flex: '1 1 0', minWidth: 0 }}>
                      {i > 0 && <span aria-hidden="true" style={{ width: 1, alignSelf: 'stretch', background: 'rgba(242,237,227,0.22)', flexShrink: 0 }} />}
                      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flex: '1 1 0', minWidth: 0 }}>
                        <Icon style={{ width: 'clamp(20px, 1.7vw, 26px)', height: 'clamp(20px, 1.7vw, 26px)', color: EXP_ACCENT, flexShrink: 0, filter: 'drop-shadow(0 1px 6px rgba(0,0,0,0.8)) drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} strokeWidth={2.2} />
                        <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(12px, 1vw, 14px)', lineHeight: 1.4, color: 'rgba(242,237,227,0.88)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textShadow: '0 1px 12px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.45)' }}>{f.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {nextCapsule}

      {/* Mini-card strip + controls — outside the crossfade so it stays put on switch */}
      <div style={{ position: 'absolute', left: 'clamp(20px, 2.8vw, 40px)', right: 'clamp(20px, 2.8vw, 40px)', bottom: 'clamp(14px, 2vh, 24px)', zIndex: 2 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${perPage}, minmax(0, 1fr))`, gap: 'clamp(12px, 1.6vw, 22px)' }}>
          {visible.map((i) => {
            const c = cards[i];
            const active = i === currentIdx;
            return (
              <button
                key={c.title}
                onClick={() => onSelect(i)}
                aria-pressed={active}
                className="group relative text-left overflow-hidden"
                style={{ borderRadius: 14, height: 'clamp(140px, 20vh, 205px)' }}
              >
                <img src={c.image} alt={c.title} loading="lazy" className="w-full h-full object-cover" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,6,4,0.88) 0%, rgba(8,6,4,0.48) 55%, rgba(8,6,4,0.22) 100%)' }} />
                <div style={{ position: 'absolute', inset: 0, padding: 'clamp(12px, 1.2vw, 17px)', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 11, marginBottom: 'auto' }}>
                    <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(242,237,227,0.9)' }}>{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-eyebrow uppercase" style={{ fontSize: 9, letterSpacing: '0.18em', color: 'rgba(242,237,227,0.72)' }}>{c.schedule.split('·')[0].trim()}</span>
                  </div>
                  <p className="font-display" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 20', fontWeight: 380, fontSize: 'clamp(1rem, 1.35vw, 1.35rem)', lineHeight: 1.12, letterSpacing: '-0.015em', color: 'rgba(242,237,227,0.97)', marginBottom: 5 }}>
                    {c.badge}
                  </p>
                  <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(10.5px, 0.85vw, 12px)', lineHeight: 1.4, color: 'rgba(231,222,199,0.75)', paddingRight: 44, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {c.note}
                  </p>
                </div>
                <span
                  className="absolute flex items-center justify-center rounded-full transition-transform duration-200 ease-out group-hover:translate-x-1 motion-reduce:transition-none"
                  style={{ right: 11, bottom: 11, width: 38, height: 38, border: '1px solid rgba(242,237,227,0.35)', background: 'rgba(8,6,4,0.35)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', color: '#F2EDE3' }}
                  aria-hidden="true"
                >
                  <ArrowRight style={{ width: 16, height: 16 }} strokeWidth={1.6} />
                </span>
                {/* Frame — accent ring marks the currently shown experience */}
                <div
                  className={active ? 'absolute inset-0 rounded-[14px] pointer-events-none' : 'absolute inset-0 rounded-[14px] ring-1 ring-inset ring-linen/10 group-hover:ring-linen/35 transition-all duration-200 pointer-events-none'}
                  style={active ? { boxShadow: `inset 0 0 0 2px ${EXP_ACCENT}, 0 4px 18px rgba(176,83,41,0.35)` } : undefined}
                />
              </button>
            );
          })}
        </div>

        {/* Controls: arrows flanking pagination dots */}
        {pageCount > 1 && (
          <div className="flex items-center justify-between" style={{ marginTop: 'clamp(8px, 1.4vh, 16px)' }}>
            <button onClick={() => flip(-1)} aria-label="Previous experiences" className="flex items-center justify-center text-linen/75 hover:text-linen transition-colors" style={{ width: 44, height: 44 }}>
              <ArrowLeft style={{ width: 22, height: 22 }} strokeWidth={1.6} />
            </button>
            <div className="flex items-center" style={{ gap: 8 }}>
              {Array.from({ length: pageCount }, (_, p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  aria-label={`Experiences page ${p + 1}`}
                  style={{ width: 8, height: 8, borderRadius: 999, padding: 0, border: 'none', cursor: 'pointer', background: p === safePage ? EXP_ACCENT : 'rgba(242,237,227,0.35)', transition: 'background 0.2s ease' }}
                />
              ))}
            </div>
            <button onClick={() => flip(1)} aria-label="Next experiences" className="flex items-center justify-center text-linen/75 hover:text-linen transition-colors" style={{ width: 44, height: 44 }}>
              <ArrowRight style={{ width: 22, height: 22 }} strokeWidth={1.6} />
            </button>
          </div>
        )}
      </div>
    </div>

    {/* ── Mobile layout — photo on top, content flows on the dark card below ── */}
    <div className="md:hidden relative w-full overflow-hidden" style={{ borderRadius: 24, backgroundColor: '#1A1F1B', boxShadow: '0 20px 48px rgba(0,0,0,0.30)' }}>
      <motion.div
        key={currentIdx}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduceMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Photo — fades into the dark body */}
        <div style={{ position: 'relative', height: '37vh', minHeight: 240 }}>
          <img src={card.image} alt={card.title} className="w-full h-full object-cover" style={{ display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(26,31,27,0.4) 0%, transparent 30%, rgba(26,31,27,0.4) 64%, #1A1F1B 100%)' }} />
          {/* Index + badge over the photo */}
          <div style={{ position: 'absolute', top: 18, left: 18, right: 96, display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 19, fontWeight: 700, letterSpacing: '0.1em', color: 'rgba(242,237,227,0.95)', flexShrink: 0 }}>
              {String(currentIdx + 1).padStart(2, '0')}
            </span>
            <p className="font-eyebrow uppercase" style={{
              fontSize: '10px', letterSpacing: '0.22em', color: EXP_ACCENT, margin: 0,
              padding: '6px 13px', borderRadius: 999, border: '1px solid rgba(212,128,78,0.55)',
              background: 'rgba(26,31,27,0.35)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {card.badgeShort}
            </p>
          </div>
        </div>

        {/* Content on dark */}
        <div style={{ padding: '2px 20px 20px' }}>
          <h2 className="font-display" style={{ fontVariationSettings: '"opsz" 96, "SOFT" 30', fontWeight: 380, fontSize: 'clamp(2.1rem, 10vw, 2.7rem)', lineHeight: 1.12, letterSpacing: '-0.02em', color: 'rgba(242,237,227,0.98)', marginBottom: 14 }}>
            {headlinePrefix}<span style={{ color: EXP_ACCENT }}>{headlineAccent}</span>
          </h2>
          <p style={{ fontFamily: 'Montserrat, ui-sans-serif, system-ui', fontSize: 15, lineHeight: 1.55, color: 'rgba(231,222,199,0.8)', marginBottom: 8 }}>
            {card.bodyShort}
          </p>

          {/* Facts — 2×2 grid with hairline dividers */}
          <div className="grid grid-cols-2">
            {card.facts.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.label}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '16px 0',
                    paddingRight: i % 2 === 0 ? 14 : 0,
                    paddingLeft: i % 2 === 1 ? 16 : 0,
                    borderRight: i % 2 === 0 ? '1px solid rgba(242,237,227,0.14)' : 'none',
                    borderBottom: i < 2 ? '1px solid rgba(242,237,227,0.14)' : 'none',
                  }}
                >
                  <Icon style={{ width: 24, height: 24, color: EXP_ACCENT, flexShrink: 0 }} strokeWidth={2.2} />
                  <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 15, lineHeight: 1.35, color: 'rgba(242,237,227,0.92)' }}>{f.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {nextCapsule}

      {/* Mini strip — continuous horizontal scroll, next card peeks in */}
      <div className="exp-mini-scroll flex overflow-x-auto" style={{ gap: 12, padding: '4px 20px 12px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`.exp-mini-scroll::-webkit-scrollbar { display: none; }`}</style>
        {cards.map((c, i) => {
          const active = i === currentIdx;
          return (
            <button
              key={c.title}
              onClick={() => onSelect(i)}
              aria-pressed={active}
              className="relative text-left overflow-hidden shrink-0"
              style={{ borderRadius: 16, width: '78vw', maxWidth: 340, height: 'clamp(180px, 52vw, 230px)' }}
            >
              <img src={c.image} alt={c.title} loading="lazy" className="w-full h-full object-cover" />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,6,4,0.9) 0%, rgba(8,6,4,0.42) 55%, rgba(8,6,4,0.28) 100%)' }} />
              <div style={{ position: 'absolute', inset: 0, padding: 18, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 'auto' }}>
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 14, fontWeight: 700, letterSpacing: '0.1em', color: EXP_ACCENT }}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-eyebrow uppercase" style={{ fontSize: 10, letterSpacing: '0.18em', color: 'rgba(242,237,227,0.75)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.schedule.split('·')[0].trim()}</span>
                </div>
                <p className="font-display" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 20', fontWeight: 380, fontSize: 'clamp(1.4rem, 6.4vw, 1.75rem)', lineHeight: 1.12, letterSpacing: '-0.015em', color: 'rgba(242,237,227,0.97)', marginBottom: 7 }}>
                  {c.badge}
                </p>
                <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13, lineHeight: 1.45, color: 'rgba(231,222,199,0.75)', paddingRight: 56, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {c.note}
                </p>
              </div>
              <span
                className="absolute flex items-center justify-center rounded-full"
                style={{ right: 14, bottom: 14, width: 44, height: 44, border: '1px solid rgba(242,237,227,0.35)', background: 'rgba(8,6,4,0.35)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)', color: '#F2EDE3' }}
                aria-hidden="true"
              >
                <ArrowRight style={{ width: 18, height: 18 }} strokeWidth={1.6} />
              </span>
              <div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={active ? { boxShadow: `inset 0 0 0 2px ${EXP_ACCENT}` } : { boxShadow: 'inset 0 0 0 1px rgba(231,222,199,0.10)' }}
              />
            </button>
          );
        })}
      </div>

      {/* Dots — reflect the currently shown experience */}
      <div className="flex items-center justify-center" style={{ gap: 7, paddingBottom: 16 }}>
        {cards.map((c, i) => (
          <button
            key={c.title}
            onClick={() => onSelect(i)}
            aria-label={`Show experience ${i + 1}`}
            style={{ width: 7, height: 7, borderRadius: 999, padding: 0, border: 'none', background: i === currentIdx ? EXP_ACCENT : 'rgba(242,237,227,0.3)', transition: 'background 0.2s ease' }}
          />
        ))}
      </div>
    </div>
    </>
  );
}

