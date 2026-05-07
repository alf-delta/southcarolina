import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'framer-motion';
import { TreeEvergreenIcon, WavesIcon, HouseSimpleIcon, BicycleIcon, PathIcon } from '@phosphor-icons/react';
import Button from '../primitives/Button';
import Img from '../primitives/Img';

const FONT     = 'Coco Sharp, Encode Sans Expanded, ui-sans-serif';
const LEFT     = 'max(24px, calc(50vw - 760px))';
const LEFT_NEG = 'min(-24px, calc(760px - 50vw))';

const PRESS = [
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

const GLANCE = [
  { icon: TreeEvergreenIcon, value: '126', category: 'Private land · acres',         description: '126 acres fully fenced — no neighbors, no noise, no sharing' },
  { icon: WavesIcon,         value: '18',  category: 'Private lake · acres',         description: 'Swim, kayak, or watch the sunrise from the water — all to yourselves' },
  { icon: HouseSimpleIcon,   value: '6',   category: 'Villas',                       description: 'Each villa private, fully staffed, and finished to the standard of a five-star hotel' },
  { icon: BicycleIcon,       value: '4',   category: 'Signature experiences',        description: 'Barrel sauna · private lake · padel court · forest trails' },
  { icon: PathIcon,          value: '12',  category: 'Miles of forest trails',       description: 'Marked paths through longleaf pine — hike, bike, or wander' },
];


interface Props {
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
}

export default function HeroImmersive({ primaryCta, secondaryCta }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const h = typeof window !== 'undefined' ? window.innerHeight : 800;

  // ── Keep data-zone in sync so StickyHeader logo flips dark when bg lightens ──
  useMotionValueEvent(scrollY, 'change', (y) => {
    const el = sectionRef.current;
    if (!el) return;
    if (y > h * 0.68) {
      el.setAttribute('data-zone', 'light');
      el.setAttribute('data-bg', '#EAE3D3');
    } else {
      el.setAttribute('data-zone', 'dark');
      el.removeAttribute('data-bg');
    }
  });

  // ── Hero content exits at natural scroll speed ──
  const heroY       = useTransform(scrollY, [0, h * 0.72], [0, -h * 0.72]);
  const heroOpacity = useTransform(scrollY, [h * 0.38, h * 0.65], [1, 0]);

  // ── Overlay lightens + becomes semi-transparent to reveal land.webp ──
  const stickyBg = useTransform(
    scrollY,
    [h * 0.52, h * 0.82],
    ['rgba(10,8,5,1)', 'rgba(234,227,211,0.42)']
  );

  // ── Traveling wordmark: starts at blur-panel center, travels to top ──
  const wordmarkInitialY = h * 0.815 - 153;
  const wordmarkY     = useTransform(scrollY, [0, h * 0.65], [wordmarkInitialY, 0]);
  const sandhillsWeight = useTransform(scrollY, [h * 0.28, h * 0.65], [200, 600]);
  const isOpacity = useTransform(scrollY, [h * 0.68, h * 0.82], [0, 1]);

  const contentOpacity = useTransform(scrollY, [h * 0.84, h * 1.0], [0, 1]);
  const contentY       = useTransform(scrollY, [h * 0.84, h * 1.0], [24, 0]);

  const wordmarkColor = useTransform(
    scrollY,
    [h * 0.58, h * 0.80],
    ['rgba(242,237,227,0.96)', 'rgba(31,36,32,0.97)']
  );


  return (
    <section
      ref={sectionRef}
      data-zone="dark"
      className="bg-night"
      style={{ height: '260dvh', position: 'relative' }}
    >
      <div style={{ position: 'sticky', top: 0, height: '100dvh', overflow: 'hidden' }}>

        {/* land.webp + animated overlay in the same container */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          <img src="/images/sandhills/land.webp" alt="" aria-hidden="true" className="w-full h-full object-cover" style={{ objectPosition: '50% 50%' }} />
          <motion.div style={{ position: 'absolute', inset: 0, backgroundColor: stickyBg }} />
        </div>

        {/* ── Hero content — exits at natural scroll speed ── */}
        <motion.div style={{ position: 'absolute', inset: 0, zIndex: 2, y: heroY, opacity: heroOpacity }}>

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
              <Button href={primaryCta.href} variant="primary" className="self-start">{primaryCta.label}</Button>
            </div>

            {/* Desktop — wordmark placeholder (invisible, holds layout) + tagline + buttons */}
            <div
              className="hidden md:flex h-full items-center justify-between"
              style={{ paddingLeft: LEFT, paddingRight: '40px' }}
            >
              {/* Invisible placeholder keeps buttons pushed right */}
              <div className="flex flex-col gap-0.5" style={{ transform: 'translateY(-20px)', visibility: 'hidden', pointerEvents: 'none' }}>
                <span style={{ fontFamily: FONT, fontSize: 'clamp(42px, 6.5vw, 88px)', fontWeight: 200, letterSpacing: '0.18em', lineHeight: 1 }}>HORIZONS</span>
                <span style={{ fontFamily: FONT, fontSize: 'clamp(22px, 3.4vw, 48px)', fontWeight: 200, letterSpacing: '0.22em', lineHeight: 1.05, marginLeft: '15px' }}>Sandhills</span>
              </div>

              {/* Right: CTAs */}
              <div className="flex flex-col items-end gap-4 shrink-0" style={{ transform: 'translateY(-25px)' }}>
                <div className="flex flex-col gap-3 items-end">
                  <Button href={primaryCta.href} variant="primary" className="!py-[11px] !min-h-0">{primaryCta.label}</Button>
                  <Button href={secondaryCta.href} variant="ghost-light" className="!py-[11px] !min-h-0">{secondaryCta.label}</Button>
                </div>
              </div>
            </div>

            {/* Center tagline */}
            <div className="hidden md:flex" style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', pointerEvents: 'none', transform: 'translate(180px, 25px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <span style={{ fontFamily: FONT, fontSize: 'clamp(20px, 1.75vw, 25px)', fontWeight: 300, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(242,237,227,0.55)' }}>
                  Your Getaway Redefined
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
          }}
        >
          <motion.div style={{ fontFamily: FONT, fontSize: 'clamp(42px, 6.5vw, 88px)', fontWeight: 200, letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1, color: wordmarkColor }}>
            HORIZONS
          </motion.div>

          <div style={{ marginLeft: '15px', marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '0.4em', flexWrap: 'nowrap' }}>
            <motion.span style={{ fontFamily: FONT, fontSize: 'clamp(22px, 3.4vw, 48px)', fontWeight: sandhillsWeight, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8C3F1E', lineHeight: 1.05, flexShrink: 0 }}>
              Sandhills
            </motion.span>
            <motion.span style={{ fontFamily: 'Fraunces, Canela, Georgia, serif', fontSize: 'clamp(26px, 3.2vw, 56px)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(31,36,32,0.90)', lineHeight: 1, whiteSpace: 'nowrap', opacity: isOpacity }}>
              is…
            </motion.span>
          </div>

          {/* ── Pillars + press — full-width, centered ── */}
          <motion.div
            style={{
              opacity: contentOpacity,
              y: contentY,
              marginTop: 'clamp(16px, 2.5vh, 40px)',
              marginLeft: LEFT_NEG,
              width: '100vw',
            }}
          >
            {/* inner centered container */}
            <div style={{ maxWidth: '1400px', marginLeft: 'auto', marginRight: 'auto', paddingLeft: LEFT, paddingRight: LEFT }}>

              {/* Three pillars — shared green velour substrate */}
              <div
                style={{
                  background: '#F0E3D0',
                  borderRadius: '12px',
                  padding: 'clamp(14px, 2.2vh, 26px) clamp(20px, 2.5vw, 32px)',
                  marginBottom: 'clamp(10px, 1.6vh, 20px)',
                  boxShadow: '3px 8px 28px rgba(0,0,0,0.18)',
                }}
              >
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
                    columnGap: 'clamp(12px, 2vw, 28px)',
                  }}
                >
                  {GLANCE.map((item) => (
                    <div key={item.category} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <item.icon size={36} weight="duotone" className="text-signal" style={{ opacity: 0.85, flexShrink: 0, alignSelf: 'center' }} />
                        <span
                          className="font-display text-signal leading-none"
                          style={{ fontSize: 'clamp(1.95rem, 3.12vw, 3.38rem)', fontWeight: 400, letterSpacing: '-0.02em' }}
                        >
                          {item.value}
                        </span>
                      </div>
                      <span className="eyebrow text-ink2" style={{ fontSize: '13px' }}>{item.category}</span>
                      <span
                        className="font-display italic text-signal"
                        style={{ fontSize: 15, lineHeight: 1.45, fontWeight: 300, fontVariationSettings: '"SOFT" 30, "opsz" 18' }}
                      >
                        {item.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Press — shared glass substrate */}
              <div
                style={{
                  width: 'min(860px, calc(100% - clamp(220px, 20vw, 360px)))',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  backgroundColor: 'rgba(234,227,211,0.14)',
                  borderRadius: '12px',
                  padding: 'clamp(14px, 2.2vh, 22px) clamp(18px, 2.2vw, 28px)',
                }}
              >
                <span style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#B05329', display: 'block', marginBottom: '14px' }}>
                  Located in a region celebrated by
                </span>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                    gap: 'clamp(18px, 2.6vh, 29px) 47px',
                    alignItems: 'start',
                  }}
                >
                  {PRESS.map((p) => {
                    const inner = (
                      <>
                        <Img src={p.logo} alt={p.name} style={{ height: '29px', width: 'auto', objectFit: 'contain', objectPosition: 'left', mixBlendMode: 'multiply', marginBottom: '10px', display: 'block' }} />
                        <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: '16px', lineHeight: 1.6, color: 'rgba(31,36,32,0.72)', margin: 0 }}>
                          {p.description.split(/(".*?")/g).map((part, i) =>
                            part.startsWith('"') && part.endsWith('"')
                              ? <em key={i} style={{ fontStyle: 'normal', fontWeight: 500, color: '#B05329' }}>{part}</em>
                              : part
                          )}
                        </p>
                      </>
                    );
                    return p.href
                      ? <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', flexDirection: 'column', textDecoration: 'none' }}>{inner}</a>
                      : <div key={p.name} style={{ display: 'flex', flexDirection: 'column' }}>{inner}</div>;
                  })}
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>

        {/* ── Postmark — bottom right corner ── */}
        <motion.img
          src="/images/postmark.webp"
          alt=""
          aria-hidden="true"
          className="hidden lg:block"
          style={{
            position: 'absolute',
            bottom: 36,
            right: 44,
            width: 'clamp(293px, 26vw, 455px)',
            height: 'auto',
            zIndex: 8,
            opacity: contentOpacity,
            transform: 'rotate(13deg)',
            pointerEvents: 'none',
          }}
        />

      </div>
    </section>
  );
}
