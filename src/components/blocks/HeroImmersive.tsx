import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, type MotionValue } from 'framer-motion';
import { TreeEvergreenIcon, WavesIcon, HouseSimpleIcon, BicycleIcon, PathIcon, FireIcon, MoonStarsIcon } from '@phosphor-icons/react';
import Button from '../primitives/Button';
import { openBooking } from '../data/booking';

export const FONT     = 'Coco Sharp, Encode Sans Expanded, ui-sans-serif';
const LEFT     = 'max(24px, calc(50vw - 760px))';

export const PRESS = [
  {
    name: 'The New York Times',
    logo: '/images/press/nyt.png',
    description: 'notes the global trend toward "digital detoxification" and the search for authenticity in secluded inland retreats like this.',
    href: 'https://www.nytimes.com/2025/01/22/travel/digitial-detox-retreat-vacation.html',
  },
  {
    name: 'Southern Living',
    logo: '/images/press/southern-living.png',
    description: 'marvels at "the scent of longleaf pine and Carolina\'s endless blue sky," calling the region ideal for lasting family memories.',
    href: 'https://www.southernliving.com/best-small-towns-south-carolina-7692785',
  },
  {
    name: 'Garden & Gun',
    logo: '/images/press/garden-gun.png',
    description: 'celebrates South Carolina\'s Olde English District — its equestrian heritage, storied hunt culture, and Camden, "the state\'s oldest inland city."',
    href: 'https://gardenandgun.com/for-the-love-of-horses-hounds-and-history-in-south-carolinas-olde-english-district',
  },
  {
    name: 'National Geographic',
    logo: '/images/press/nat-geo.png',
    description: 'documents "the largest old-growth bottomland hardwood forest in the US" — a rare, biodiverse South Carolina wilderness.',
    href: 'https://www.nationalgeographic.com/travel/national-parks/article/congaree-national-park',
  },
];

export const GLANCE = [
  { icon: TreeEvergreenIcon, value: '126', category: 'Private land · acres',         description: '126 acres fully fenced — no neighbors, no noise, no sharing' },
  { icon: WavesIcon,         value: '18',  category: 'Private lake · acres',         description: 'Swim, kayak, or watch the sunrise from the water — all to yourselves' },
  { icon: HouseSimpleIcon,   value: '6',   category: 'Villas',                       description: 'Each villa private, fully staffed, and finished to the standard of a five-star hotel' },
  { icon: BicycleIcon,       value: '4',   category: 'Signature experiences',        description: 'Barrel sauna · private lake · padel court · forest trails' },
  { icon: PathIcon,          value: '12',  category: 'Miles of forest trails',       description: 'Marked paths through longleaf pine — hike, bike, or wander' },
];


// ── Second-screen territory highlights — broad → specific ──
export const TERRITORY = [
  { icon: TreeEvergreenIcon, value: ['Room to', 'Breathe'],                   label: '126 acres of land and forest, quiet trails, open space and the kind of freedom you don’t find in the city.' },
  { icon: WavesIcon,         value: ['A Lake', 'to Yourself'],                label: 'Swim, fish, paddle, float — or do absolutely nothing on an 18-acre lake.' },
  { icon: HouseSimpleIcon,   value: ['Five-Star Comfort,', 'Forest Edition'], label: 'Modern Forest Villas with everything you need to feel at home outside.' },
  { icon: FireIcon,          value: ['The Wood-Fired', 'Reset'],              label: 'Sauna heat, lake views and the kind of calm you came here for.' },
  { icon: BicycleIcon,       value: ['Play Without', 'a Schedule'],           label: 'Pool days, e-bikes, kayaks, paddleboards, trails, volleyball, soccer and open-air adventures.' },
  { icon: MoonStarsIcon,     value: ['Stay Out', 'After Dark'],               label: 'Firepits, decks, stars and long evenings with your people.' },
];
const NUMH = 'clamp(50px, 6.5vh, 78px)';
const EDGE = 50 / TERRITORY.length;   // % inset to first/last dot center
const SPAN = 100 - 2 * EDGE;          // % the fill line travels

// Numeral fades + lifts in as the progress line reaches its index
function HeroNumeral({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const opacity = useTransform(progress, [index - 0.1, index + 0.5], [0, 1]);
  const y       = useTransform(progress, [index - 0.1, index + 0.5], [16, 0]);
  const Icon    = TERRITORY[index].icon;
  return (
    <motion.div style={{ opacity, y, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', minHeight: NUMH, textAlign: 'center', padding: '0 6px' }}>
      <Icon size={52} weight="duotone" className="text-signal" style={{ opacity: 0.9, marginBottom: 14 }} />
      <span
        className="font-display"
        style={{ fontVariationSettings: '"opsz" 72, "SOFT" 20, "WONK" 0', fontWeight: 360, fontSize: 'clamp(1.05rem, 1.55vw, 1.6rem)', letterSpacing: '-0.01em', lineHeight: 1.14, color: 'rgba(242,237,227,0.97)' }}
      >
        {TERRITORY[index].value[0]}<br />{TERRITORY[index].value[1]}
      </span>
    </motion.div>
  );
}

// Dot lights up on the track as the line passes it
function HeroDot({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const t      = useTransform(progress, [index - 0.15, index + 0.25], [0, 1]);
  const scale  = useTransform(t, [0, 1], [0.5, 1]);
  const bg     = useTransform(t, [0, 1], ['rgba(242,237,227,0.22)', '#BC4F1F']);
  const shadow = useTransform(t, [0, 1], ['0 0 0 rgba(188,79,31,0)', '0 0 14px rgba(188,79,31,0.7)']);
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <motion.div style={{ width: 11, height: 11, borderRadius: 999, scale, background: bg, boxShadow: shadow }} />
    </div>
  );
}

// Label fades in just after its numeral
function HeroLabel({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const opacity = useTransform(progress, [index + 0.05, index + 0.6], [0, 1]);
  return (
    <motion.p
      style={{ opacity, textAlign: 'center', padding: '12px 8px 0', margin: '0 auto', maxWidth: 280, fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(12px, 1vw, 14px)', lineHeight: 1.55, letterSpacing: '0.005em', color: 'rgba(231,222,199,0.66)' }}
    >
      {TERRITORY[index].label}
    </motion.p>
  );
}

interface Props {
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export default function HeroImmersive({ primaryCta, secondaryCta }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const h = typeof window !== 'undefined' ? window.innerHeight : 800;

  // ── Second screen stays dark, so StickyHeader logo stays light throughout ──
  useMotionValueEvent(scrollY, 'change', () => {
    const el = sectionRef.current;
    if (!el) return;
    el.setAttribute('data-zone', 'dark');
    el.removeAttribute('data-bg');
  });

  // ── Hero content exits at natural scroll speed ──
  const heroY       = useTransform(scrollY, [0, h * 0.72], [0, -h * 0.72]);
  const heroOpacity = useTransform(scrollY, [h * 0.38, h * 0.65], [1, 0]);

  // ── Overlay stays dark — land.webp reveals under a heavy dark wash ──
  const stickyBg = useTransform(
    scrollY,
    [h * 0.52, h * 0.82],
    ['rgba(10,8,5,1)', 'rgba(10,8,5,0.57)']
  );

  // ── Traveling wordmark: starts at blur-panel center, travels to top ──
  const wordmarkInitialY = h * 0.815 - 153;
  const wordmarkY     = useTransform(scrollY, [0, h * 0.65], [wordmarkInitialY, 0]);
  const sandhillsWeight = useTransform(scrollY, [h * 0.28, h * 0.65], [200, 600]);

  const contentOpacity = useTransform(scrollY, [h * 0.84, h * 1.0], [0, 1]);
  const contentY       = useTransform(scrollY, [h * 0.84, h * 1.0], [24, 0]);

  // Wordmark stays linen on the dark second screen
  const wordmarkColor = useTransform(
    scrollY,
    [h * 0.58, h * 0.80],
    ['rgba(242,237,227,0.96)', 'rgba(242,237,227,0.96)']
  );

  // Scroll-end vibe cue — fades in near the end of the sticky hold
  // Territory highlights load one-by-one, left → right, across the sticky budget
  // Progress runs a half-step past the last index so the final item fully reveals
  const territoryProgress = useTransform(scrollY, [h * 1.02, h * 1.9], [0, TERRITORY.length]);
  const territoryFill     = useTransform(territoryProgress, [0, TERRITORY.length - 1], ['0%', `${SPAN}%`]);

  const cueOpacity = useTransform(scrollY, [h * 1.92, h * 2.12], [0, 1]);
  const cueY       = useTransform(scrollY, [h * 1.92, h * 2.12], [18, 0]);


  return (
    <section
      ref={sectionRef}
      data-zone="dark"
      className="bg-night h-[100dvh] md:h-[320dvh]"
      style={{ position: 'relative' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100dvh', overflow: 'hidden' }}>

        {/* land.webp + animated overlay in the same container */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src="/images/sandhills/land.webp" alt="" aria-hidden="true" className="w-full h-full object-cover" style={{ objectPosition: '50% 50%' }} />
          <motion.div style={{ position: 'absolute', inset: 0, backgroundColor: stickyBg }} />
        </div>

        {/* ── Hero content — exits at natural scroll speed ── */}
        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 2, y: heroY, opacity: heroOpacity }}>

          {/* Mobile logo — top left, immediately visible */}
          <img
            src="/logo.svg"
            alt="Horizons Sandhills"
            className="md:hidden"
            style={{
              position: 'absolute',
              top: 18,
              left: 24,
              zIndex: 12,
              height: 44,
              width: 'auto',
              filter: 'brightness(0) invert(1)',
              pointerEvents: 'none',
            }}
          />

          {/* Top photo */}
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 'calc(75% + 75px)' }}>
            <div style={{ position: 'absolute', inset: 0 }}>
              <picture>
                <source media="(max-width: 767px)" srcSet="/images/sandhills/mobile.webp" />
                <source media="(min-width: 768px)" srcSet="/images/sandhills/desktop.webp" />
                <img
                  src="/images/sandhills/desktop.webp"
                  alt="" aria-hidden="true" fetchPriority="high"
                  className="w-full h-full object-cover"
                  style={{ objectPosition: '70% 100%' }}
                  width={2400} height={1600}
                />
              </picture>
            </div>
          </div>

          {/* Blur panel */}
          <div
            style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: 'calc(37% - 75px)',
              backdropFilter: 'blur(28px)',
              WebkitBackdropFilter: 'blur(28px)',
              backgroundColor: 'rgba(10,8,5,0.55)',
              maskImage: 'linear-gradient(to bottom, transparent 0%, black 32%)',
              WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 32%)',
            }}
          >
            {/* Mobile */}
            <div className="md:hidden h-full flex flex-col justify-center px-6 gap-4">
              <div className="flex flex-col gap-0.5">
                <span style={{ fontFamily: FONT, fontSize: 'clamp(34px, 10vw, 48px)', fontWeight: 200, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(242,237,227,0.95)', lineHeight: 1 }}>
                  HORIZONS
                </span>
                <span style={{ fontFamily: FONT, fontSize: 'clamp(18px, 5.5vw, 28px)', fontWeight: 200, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#B05329', lineHeight: 1.1 }}>
                  Sandhills
                </span>
              </div>
              <Button onClick={openBooking} variant="primary" className="self-start">{primaryCta.label}</Button>
            </div>

            {/* Desktop — wordmark placeholder (invisible, holds layout) + tagline + buttons */}
            <div
              className="hidden md:flex h-full items-center justify-between"
              style={{ paddingLeft: LEFT, paddingRight: LEFT }}
            >
              {/* Invisible placeholder keeps buttons pushed right */}
              <div className="flex flex-col gap-0.5" style={{ transform: 'translateY(-20px)', visibility: 'hidden', pointerEvents: 'none' }}>
                <span style={{ fontFamily: FONT, fontSize: 'clamp(42px, 6.5vw, 88px)', fontWeight: 200, letterSpacing: '0.18em', lineHeight: 1 }}>HORIZONS</span>
                <span style={{ fontFamily: FONT, fontSize: 'clamp(22px, 3.4vw, 48px)', fontWeight: 200, letterSpacing: '0.22em', lineHeight: 1.05, marginLeft: '15px' }}>Sandhills</span>
              </div>

              {/* Right: CTAs */}
              <div className="flex flex-col items-end gap-4 shrink-0" style={{ transform: 'translateY(-25px)' }}>
                <div className="flex flex-col gap-3 items-end">
                  <Button onClick={openBooking} variant="primary" className="!py-[11px] !min-h-0">{primaryCta.label}</Button>
                  <Button href={secondaryCta.href} variant="ghost-light" className="!py-[11px] !min-h-0">{secondaryCta.label}</Button>
                </div>
              </div>
            </div>

            {/* Center tagline */}
            <div className="hidden md:flex" style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', transform: 'translate(clamp(80px, 13vw, 200px), clamp(15px, 2.2vh, 30px))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontFamily: FONT, fontSize: 'clamp(17px, 1.49vw, 21.25px)', fontWeight: 300, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(242,237,227,0.55)' }}>
                  Your Private Nature Getaway
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Traveling wordmark (desktop) ── */}
        <motion.div
          className="hidden md:block"
          style={{
            position: 'absolute',
            top: 92,
            left: LEFT,
            zIndex: 12,
            y: wordmarkY,
            transformOrigin: 'left center',
            pointerEvents: 'none',
          }}
        >
          <motion.div style={{ fontFamily: FONT, fontSize: 'clamp(42px, 6.5vw, 88px)', fontWeight: 200, letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1, color: wordmarkColor }}>
            HORIZONS
          </motion.div>

          <div style={{ marginLeft: '15px', marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '0.4em', flexWrap: 'nowrap' }}>
            <motion.span style={{ fontFamily: FONT, fontSize: 'clamp(22px, 3.4vw, 48px)', fontWeight: sandhillsWeight, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#DE7E44', lineHeight: 1.05, flexShrink: 0 }}>
              Sandhills
            </motion.span>
          </div>

          {/* ── Positioning statement ── */}
          <motion.div
            style={{
              opacity: contentOpacity,
              y: contentY,
              marginTop: 'clamp(30px, 5.5vh, 84px)',
            }}
          >
            {/* Headline — sans, set apart from the location wordmark */}
            <div style={{ maxWidth: 'min(76rem, calc(100vw - 48px))' }}>
              <h2
                style={{
                  fontFamily: FONT,
                  fontWeight: 500,
                  fontSize: 'clamp(2.6rem, 5.72vw, 5.2rem)',
                  lineHeight: 1.06,
                  letterSpacing: '-0.01em',
                  whiteSpace: 'nowrap',
                  color: 'rgba(242,237,227,0.65)',
                  textShadow: '0 2px 30px rgba(0,0,0,0.45)',
                }}
              >
                Where the city disappears.
              </h2>
              {/* Slogan */}
              <p
                style={{
                  marginTop: 'clamp(16px, 2.4vh, 30px)',
                  maxWidth: '48ch',
                  fontFamily: 'Montserrat, ui-sans-serif, system-ui',
                  fontSize: 'clamp(1.34rem, 1.98vw, 1.78rem)',
                  fontWeight: 300,
                  lineHeight: 1.55,
                  letterSpacing: '0.012em',
                  color: 'rgba(231,222,199,0.72)',
                }}
              >
                Slow down, reconnect, and remember what a <span style={{ fontFamily: 'Fraunces, Canela, Georgia, serif', fontWeight: 700, fontStyle: 'italic', color: '#DE7E44' }}>real getaway</span> is supposed to feel like.
              </p>
            </div>

            {/* Numerals — scroll-scrubbed "loading bar", full viewport width, no panel */}
            <div
              style={{
                marginTop: 'clamp(24px, 3.6vh, 52px)',
                marginLeft: 'min(-24px, calc(760px - 50vw))',
                width: '100vw',
                paddingLeft: 'clamp(24px, 4vw, 72px)',
                paddingRight: 'clamp(24px, 4vw, 72px)',
              }}
            >
              {/* Numerals row */}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${TERRITORY.length}, minmax(0, 1fr))`, alignItems: 'flex-end' }}>
                {TERRITORY.map((_, i) => (
                  <HeroNumeral key={i} progress={territoryProgress} index={i} />
                ))}
              </div>

              {/* Progress track + dots */}
              <div style={{ position: 'relative', margin: 'clamp(11px, 1.5vh, 17px) 0' }}>
                {/* base line */}
                <div style={{ position: 'absolute', left: `${EDGE}%`, right: `${EDGE}%`, top: '50%', transform: 'translateY(-50%)', height: 2, borderRadius: 2, background: 'rgba(242,237,227,0.13)' }} />
                {/* fill line */}
                <motion.div style={{ position: 'absolute', left: `${EDGE}%`, top: '50%', transform: 'translateY(-50%)', height: 2, borderRadius: 2, width: territoryFill, background: '#BC4F1F', boxShadow: '0 0 12px rgba(188,79,31,0.55)' }} />
                {/* dots */}
                <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: `repeat(${TERRITORY.length}, minmax(0, 1fr))`, alignItems: 'center' }}>
                  {TERRITORY.map((_, i) => (
                    <HeroDot key={i} progress={territoryProgress} index={i} />
                  ))}
                </div>
              </div>

              {/* Labels row */}
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${TERRITORY.length}, minmax(0, 1fr))`, alignItems: 'flex-start' }}>
                {TERRITORY.map((_, i) => (
                  <HeroLabel key={i} progress={territoryProgress} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ── Scroll-end vibe cue ── */}
        <motion.div
          className="hidden md:flex"
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 'clamp(26px, 5vh, 56px)',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 'clamp(12px, 1.8vh, 20px)',
            paddingLeft: 24,
            paddingRight: 24,
            opacity: cueOpacity,
            y: cueY,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <p
            className="font-display"
            style={{
              textAlign: 'center',
              maxWidth: '42rem',
              fontVariationSettings: '"opsz" 64, "SOFT" 30',
              fontWeight: 340,
              fontSize: 'clamp(1.05rem, 1.9vw, 1.65rem)',
              lineHeight: 1.32,
              letterSpacing: '-0.01em',
              color: 'rgba(242,237,227,0.92)',
            }}
          >
            Come for the stay. Leave with{' '}
            <span style={{ fontStyle: 'italic', color: '#DE7E44' }}>the story.</span>
          </p>
          <div className="animate-bounceCue" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span className="eyebrow" style={{ fontSize: '10px', letterSpacing: '0.26em', color: 'rgba(242,237,227,0.5)' }}>
              Scroll
            </span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(242,237,227,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
