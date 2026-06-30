import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion';
import { Wifi, Bath, Utensils, Armchair } from 'lucide-react';
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
    headline: 'The ritual the Romans knew. You rediscover it here.',
    body:     "Wood-fired to 194 °F. The sauna sits on the water — heat, then cold, then silence. Step off the dock into the lake. Two thousand years of the same ritual, still unmatched.",
    schedule: 'Open daily · 6 am – 11 pm',
    location: 'Lakeside sauna pavilion',
    points:   ['Wood-fired, reaches 194 °F in 40 min', 'Cold plunge in the lake, steps away', 'Seats 6 · towels provided', 'No booking needed'],
  },
  {
    image:    '/qaYcANUQR-PNzw3QPCqKA_uEzp7Ijh.webp',
    title:    'The Lake',
    note:     'An 18-acre lake for swimming, fishing, floating and slow days by the water.',
    badge:    'Your ocean. No salt, no strangers.',
    headline: 'Sixty Olympic pools. Every single one of them yours.',
    body:     'Eighteen acres of still, clean water — private to our guests, always. No jet skis, no strangers, no one doing cannonballs near your kayak. Just you, the herons, and a surface so calm in the morning it reflects the pines like a mirror. Go for a swim. Take a canoe. Sit on the dock and do absolutely nothing. All three are correct answers.',
    schedule: 'Sunrise to sunset',
    location: 'Main dock, north shore',
    points:   ['18 acres of private lake', 'No motor boats — ever', '2 Kevlar canoes · 2 paddleboards on the dock', 'Swimming, fishing, floating — all welcome'],
  },
  {
    image:    '/images/sandhills/twelve_miles.webp',
    title:    'Trails & Rides',
    note:     'Open land, forest paths and e-bikes for exploring the property at your own pace.',
    badge:    '12 miles. Zero treadmills.',
    headline: 'Into the pines.',
    body:     'Twelve miles of marked trail through longleaf pine savanna. Four trailheads across the property. The creek loop is the one worth finding. Illustrated map in your cabin.',
    schedule: 'All day · self-guided',
    location: '4 trailheads across the property',
    points:   ['Illustrated map in your cabin', 'Longleaf pine savanna + creek loop', 'Easy to moderate grade', 'Ends at a creek worth finding'],
  },
  {
    image:    '/images/experience/ready-for-the-water.webp',
    title:    'Ready for the Water',
    note:     'Kayaks, paddleboards and boats ready for quiet mornings or full-group lake adventures.',
    badge:    'Still in there. Go get it.',
    headline: 'Cast a line.',
    body:     'Bass, bream, catfish. Rods and tackle at the dock box. No fishing license required on private water. Dawn and dusk are the best windows. Catch-and-release only.',
    schedule: 'Dawn & dusk · best windows',
    location: 'South dock + creek mouth',
    points:   ['Bass, bream, catfish in the lake', 'Rods & tackle available at the dock box', 'Catch-and-release only', 'No license required on private water'],
  },
  {
    image:    '/images/bikes.webp',
    title:    'The Open Field',
    note:     'Volleyball, soccer and open-air games for families, friends and teams.',
    badge:    'Tour de Sandhills.',
    headline: 'Twelve miles on two wheels.',
    body:     'Four gravel bikes and two trail bikes on property. Helmets, locks, and a printed route map included. Twelve miles of marked paths. The morning lake loop takes forty minutes.',
    schedule: 'All day · self-guided',
    location: 'Bike rack at the main cabin',
    points:   ['4 gravel bikes + 2 trail bikes on property', 'Helmets, locks, and a printed route map included', '12 miles of marked paths', 'Best morning ride: lake loop before 8 am'],
  },
  {
    image:    '/images/experience/pool-days.webp',
    title:    'Pool Days',
    note:     'A large outdoor pool made for long afternoons, sun, water and good company.',
    badge:    'Picked this morning.',
    headline: 'The orchard is yours.',
    body:     'Rows of peach trees inside the property fence. In season, you pick your own — straight from the branch, still warm from the sun. The kind of fruit a grocery store has never stocked. Your host will tell you which rows are ready.',
    schedule: 'June – August · dawn to dusk',
    location: 'East field, five-minute walk from the main cabin',
    points:   ['Private orchard, guests only', 'Pick your own in season', 'Peaches available year-round from the welcome pantry', 'Jam, preserves, and fresh fruit on arrival'],
  },
  {
    image:    '/images/experience/honey-from-the-land.webp',
    title:    'Honey From the Land',
    note:     'Our own beehives on property — a small taste of Sandhills, straight from nature.',
    badge:    'A million bees. All ours.',
    headline: 'Twenty hives. One million workers.',
    body:     'Our apiary runs twenty hives — over a million bees foraging the longleaf pine savanna, wildflowers, and clover within the property. The honey in your welcome pantry came from fifty feet away. Ask your host for a hive walk. Nets provided.',
    schedule: 'Hive walks by arrangement',
    location: 'Apiary meadow, south of the lake',
    points:   ['20 active hives on property', '1M+ bees · longleaf pine + wildflower honey', 'Honey in every welcome pantry', 'Guided hive walk available on request'],
  },
  {
    image:    '/images/sandhills/fire_pit.webp',
    title:    'By the Outdoor Fireplace',
    note:     'A large deck, warm fire, open sky and the conversations that make the trip.',
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

const B2B_SCENARIOS = [
  { title: 'Birthday Weekends', benefit: 'Celebrate on your own clock — no last call, no rush home.' },
  { title: 'Corporate Retreats', benefit: 'The team actually connects when no one is watching the door.' },
  { title: 'Family Reunions', benefit: 'Every generation under one roof, finally in the same place.' },
  { title: 'Wellness Retreats', benefit: 'Space to slow down, with nothing pulling you back.' },
  { title: 'Bachelor & Bachelorette', benefit: 'Your crew, your rules, complete privacy.' },
  { title: 'Private Celebrations', benefit: 'Mark the moment without sharing the room.' },
] as const;


// ── Main component ────────────────────────────────────────────────────────────

export default function VillaCascade() {
  const villa = sandhillsData.stays[0];

  const [galleryStartIdx, setGalleryStartIdx] = useState<number | null>(null);
  const [comfortIdx,    setComfortIdx]    = useState<number | null>(null);
  const [expandedExp, setExpandedExp] = useState<number | null>(null);
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
                display: 'inline-flex', flexWrap: 'wrap', gap: 'clamp(8px, 1.37vw, 16px)',
                padding: 'clamp(12px, 1.8vh, 20px) clamp(16px, 2vw, 24px)',
                borderRadius: 14,
                background: 'rgba(120,116,110,0.30)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: '1px solid rgba(242,237,227,0.22)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.30), inset 0 0 0 1px rgba(255,255,255,0.05), inset 0 -8px 18px rgba(0,0,0,0.16), 0 12px 32px rgba(0,0,0,0.30)',
              }}>
                {/* Guests */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 'clamp(54px, 6.5vw, 78px)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <svg viewBox="0 0 20 20" fill="currentColor" style={{ width: 'clamp(1.32rem, 2.16vw, 1.8rem)', height: 'clamp(1.32rem, 2.16vw, 1.8rem)', color: '#B05329', flexShrink: 0 }}>
                      <path d="M10 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-7 8a7 7 0 1 1 14 0H3z" />
                    </svg>
                    <span className="font-display" style={{ fontVariationSettings: '"opsz" 48', fontWeight: 380, fontSize: 'clamp(1.2rem, 1.8vw, 1.6rem)', lineHeight: 1, letterSpacing: '-0.02em', color: 'rgba(242,237,227,1)', textShadow: '0 1px 12px rgba(0,0,0,0.8)' }}>4</span>
                  </div>
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(231,222,199,0.40)', textAlign: 'center', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>up to<br />Guests</span>
                </div>
                {/* Bathroom */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 'clamp(54px, 6.5vw, 78px)' }}>
                  <Bath style={{ width: 'clamp(1.32rem, 2.16vw, 1.8rem)', height: 'clamp(1.32rem, 2.16vw, 1.8rem)', color: '#B05329', filter: 'drop-shadow(0 1px 8px rgba(0,0,0,0.7))' }} strokeWidth={1.3} />
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(231,222,199,0.40)', textAlign: 'center', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>Bathroom</span>
                </div>
                {/* Equipped Kitchen */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 'clamp(54px, 6.5vw, 78px)' }}>
                  <Utensils style={{ width: 'clamp(1.32rem, 2.16vw, 1.8rem)', height: 'clamp(1.32rem, 2.16vw, 1.8rem)', color: '#B05329', filter: 'drop-shadow(0 1px 8px rgba(0,0,0,0.7))' }} strokeWidth={1.3} />
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(231,222,199,0.40)', textAlign: 'center', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>Equipped<br />Kitchen</span>
                </div>
                {/* Wi-Fi */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 'clamp(54px, 6.5vw, 78px)' }}>
                  <Wifi style={{ width: 'clamp(1.32rem, 2.16vw, 1.8rem)', height: 'clamp(1.32rem, 2.16vw, 1.8rem)', color: '#B05329', filter: 'drop-shadow(0 1px 8px rgba(0,0,0,0.7))' }} strokeWidth={1.3} />
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(231,222,199,0.40)', textAlign: 'center', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>Wi-Fi</span>
                </div>
                {/* Private Deck */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, width: 'clamp(54px, 6.5vw, 78px)' }}>
                  <Armchair style={{ width: 'clamp(1.32rem, 2.16vw, 1.8rem)', height: 'clamp(1.32rem, 2.16vw, 1.8rem)', color: '#B05329', filter: 'drop-shadow(0 1px 8px rgba(0,0,0,0.7))' }} strokeWidth={1.3} />
                  <span style={{ fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 9, fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(231,222,199,0.40)', textAlign: 'center', textShadow: '0 1px 8px rgba(0,0,0,0.7)' }}>Private<br />Deck</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Thumbnail strip — mirrors the hero slideshow, active one framed */}
          <div className="flex gap-2 mt-2">
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

          {/* ── Experience dock — expand-to-bento on click ── */}
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
              paddingBottom: 'clamp(36px, 4vh, 48px)',
              gridAutoRows: expanded ? 'var(--tileHalf)' : 'var(--tileH)',
              gridAutoFlow: expanded ? 'dense' : 'row',
            }}
          >
            {EXPERIENCE_CARDS.map((card, i) => {
              const isExpanded = expandedExp === i;
              return (
                <motion.div
                  layout
                  key={card.title}
                  className="group"
                  onClick={() => setExpandedExp(isExpanded ? null : i)}
                  transition={{ layout: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } }}
                  style={{
                    position: 'relative', cursor: 'pointer',
                    zIndex: isExpanded ? 40 : 1,
                    gridColumn: isExpanded ? '1 / span 2' : undefined,
                    gridRow:    isExpanded ? '1 / span 4' : undefined,
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    {/* Image surface — fills whole tile */}
                    <div
                      className="ring-1 ring-inset ring-linen/0 transition-all duration-300 group-hover:ring-linen/30"
                      style={{
                        position: 'relative', borderRadius: isExpanded ? 18 : 16, overflow: 'hidden',
                        width: '100%', height: '100%',
                        boxShadow: isExpanded ? '0 28px 64px rgba(0,0,0,0.42)' : '0 6px 18px rgba(0,0,0,0.16)',
                        transition: 'box-shadow 0.3s ease',
                      }}
                    >
                      <img src={card.image} alt={card.title} loading="lazy" className="w-full h-full object-cover transition-[filter] duration-300 group-hover:brightness-110" style={{ display: 'block' }} />
                      <div style={{ position: 'absolute', inset: 0, background: isExpanded
                        ? 'linear-gradient(to top, rgba(8,6,4,0.96) 0%, rgba(8,6,4,0.55) 38%, rgba(8,6,4,0.05) 72%)'
                        : 'linear-gradient(to top, rgba(8,6,4,0.9) 0%, rgba(8,6,4,0.32) 58%, transparent 85%)' }} />

                      {/* Number */}
                      <span style={{ position: 'absolute', top: 10, left: 12, fontFamily: 'Inter Tight, Inter, system-ui', fontSize: 10, fontWeight: 600, letterSpacing: '0.18em', color: 'rgba(242,237,227,0.7)' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>

                      {/* Expand hint — fades in on hover */}
                      {!isExpanded && (
                        <span
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ position: 'absolute', top: 10, right: 10, width: 26, height: 26, borderRadius: 999, border: '1px solid rgba(242,237,227,0.35)', background: 'rgba(8,6,4,0.45)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#F2EDE3" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                            <path d="M8 3H5a2 2 0 0 0-2 2v3m0 8v3a2 2 0 0 0 2 2h3m8 0h3a2 2 0 0 0 2-2v-3m0-8V5a2 2 0 0 0-2-2h-3" />
                          </svg>
                        </span>
                      )}

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

                      {/* Compact title + description — collapsed tiles, always visible */}
                      {!isExpanded && (
                        <div style={{ position: 'absolute', left: 12, right: 12, bottom: 10 }}>
                          <p className="font-display text-linen" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 20', fontWeight: 380, fontSize: 'clamp(0.95rem, 1.5vw, 1.25rem)', lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: 4 }}>
                            {card.title}
                          </p>
                          <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(10.5px, 0.9vw, 12px)', lineHeight: 1.4, color: 'rgba(231,222,199,0.68)' }}>
                            {card.note}
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
                          <p className="font-eyebrow uppercase" style={{
                            alignSelf: 'flex-start',
                            fontSize: '10px',
                            letterSpacing: '0.24em',
                            color: '#E89A6A',
                            marginBottom: 10,
                            padding: '5px 11px',
                            borderRadius: 999,
                            background: 'rgba(8,6,4,0.55)',
                            backdropFilter: 'blur(6px)',
                            WebkitBackdropFilter: 'blur(6px)',
                            border: '1px solid rgba(176,83,41,0.45)',
                          }}>
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
                  </div>
                </motion.div>
              );
            })}
          </div>
          ); })()}
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

                {/* Capacity — tactile paper / cardboard cards */}
                <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 'clamp(12px, 1.6vw, 20px)', marginBottom: 'clamp(30px, 4vh, 52px)' }}>
                  {[
                    { label: 'Daily Events', pre: 'Up to', num: '200', unit: 'guests', note: 'for private gatherings & celebrations' },
                    { label: 'Overnight Stay', pre: 'Up to', num: '40', unit: 'guests', note: 'adults and kids are welcome' },
                    { label: 'Minimum Stay', pre: 'From', num: '1', unit: 'night', note: "stay longer — you won't want to leave" },
                  ].map((card) => (
                    <div
                      key={card.label}
                      style={{
                        borderRadius: 14,
                        padding: 'clamp(22px, 3vh, 32px) clamp(22px, 2.4vw, 30px)',
                        background: 'linear-gradient(168deg, #F5F0E7 0%, #E9E1CF 100%)',
                        border: '1px solid rgba(31,36,32,0.10)',
                        boxShadow: '0 1px 1px rgba(31,36,32,0.05), 0 10px 24px rgba(31,36,32,0.14), inset 0 1px 0 rgba(255,255,255,0.7), inset 0 -1px 0 rgba(31,36,32,0.06)',
                      }}
                    >
                      <p className="font-eyebrow text-signal uppercase" style={{ fontSize: 'clamp(12.5px, 1.05vw, 14px)', fontWeight: 700, letterSpacing: '0.16em', marginBottom: 'clamp(14px, 2vh, 18px)' }}>
                        {card.label}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 'clamp(7px, 0.8vw, 11px)', marginBottom: 'clamp(9px, 1.3vh, 13px)' }}>
                        <span className="font-eyebrow uppercase" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(31,36,32,0.42)', flexShrink: 0 }}>
                          {card.pre}
                        </span>
                        <span className="font-display" style={{ fontVariationSettings: '"opsz" 144, "SOFT" 0, "WONK" 0', fontWeight: 330, fontSize: 'clamp(2.8rem, 5vw, 4.2rem)', lineHeight: 0.86, letterSpacing: '-0.035em', color: 'rgba(31,36,32,0.94)' }}>
                          {card.num}
                        </span>
                        <span className="font-display italic" style={{ fontVariationSettings: '"opsz" 40, "SOFT" 40, "WONK" 0', fontWeight: 380, fontSize: 'clamp(1.05rem, 1.5vw, 1.35rem)', letterSpacing: '-0.01em', color: 'rgba(31,36,32,0.66)' }}>
                          {card.unit}
                        </span>
                      </div>
                      <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.8rem, 0.92vw, 0.88rem)', lineHeight: 1.45, color: 'rgba(31,36,32,0.56)' }}>
                        {card.note}
                      </p>
                    </div>
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: '0 clamp(20px, 3vw, 44px)' }}>
                    {B2B_SCENARIOS.map((scenario, i) => (
                      <motion.div
                        key={scenario.title}
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
                        style={{
                          paddingTop: 'clamp(16px, 2.2vh, 22px)',
                          paddingBottom: 'clamp(16px, 2.2vh, 22px)',
                          borderTopWidth: 1, borderTopStyle: 'solid', borderTopColor: b2bLine,
                        }}
                      >
                        <motion.p className="font-display" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 30', fontWeight: 380, fontSize: 'clamp(1.12rem, 1.5vw, 1.3rem)', lineHeight: 1.15, letterSpacing: '-0.012em', marginBottom: 7, color: b2bText }}>
                          {scenario.title}
                        </motion.p>
                        <motion.p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(0.82rem, 0.95vw, 0.92rem)', lineHeight: 1.5, color: b2bMuted }}>
                          {scenario.benefit}
                        </motion.p>
                      </motion.div>
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


