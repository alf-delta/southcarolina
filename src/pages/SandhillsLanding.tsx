import { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import { FONT } from '../components/blocks/HeroImmersive';
import MobileRoadmap from '../components/blocks/MobileRoadmap';
import { sandhillsData as d } from '../components/data/sandhills';
import StructuredData from '../components/StructuredData';

import StickyHeader from '../components/blocks/StickyHeader';
import HeroImmersive from '../components/blocks/HeroImmersive';

import LandStory from '../components/blocks/LandStory';
import PressFeature from '../components/blocks/PressFeature';
import VillaCascade from '../components/blocks/VillaCascade';
// import DayScenes from '../components/blocks/DayScenes';
// import DiningEditorial from '../components/blocks/DiningEditorial';
// import MapBlock from '../components/blocks/MapBlock';
// import GalleryMasonry from '../components/blocks/GalleryMasonry';
// import ProofSocial from '../components/blocks/ProofSocial';
// import NearbyGrid from '../components/blocks/NearbyGrid';
// import FaqAccordion from '../components/blocks/FaqAccordion';
import FinalCtaImmersive from '../components/blocks/FinalCtaImmersive';
import InfluencerProof from '../components/blocks/InfluencerProof';
import GettingHere from '../components/blocks/GettingHere';
import Footer from '../components/blocks/Footer';
import StackCard from '../components/primitives/StackCard';


export default function SandhillsLanding() {
  const [bookingBarVisible, setBookingBarVisible] = useState(false);
  const [landStoryOpen, setLandStoryOpen] = useState(false);
  const mobileGlanceRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: glanceP } = useScroll({ target: mobileGlanceRef, offset: ['start end', 'end start'] });
  const glanceBgY  = useTransform(glanceP, [0, 1], ['0%', '-18%']);
  const glanceBgY2 = useTransform(glanceP, [0, 1], ['0%', '-10%']);

  useEffect(() => {
    const onScroll = () => setBookingBarVisible(window.scrollY > window.innerHeight * 0.7);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.title = d.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', d.meta.description);

    const hash = window.location.hash;
    if (hash) {
      const id = hash.replace('#', '');
      const el = document.getElementById(id);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  }, []);

  return (
    <>
      <StructuredData />
      <StickyHeader />

      <main>
        {/*
          Механика:
          — StackCard (sticky) держит chapter opener на месте
          — Следующий content-слой имеет более высокий z-index
            и физически наезжает на застрявший opener при скролле
          — Это создаёт эффект "карточка осталась, следующий контент
            выехал поверх неё"
        */}

        {/* ── Группа 1: обычный скролл ── */}
        <HeroImmersive
          primaryCta={d.hero.primaryCta}
          secondaryCta={d.hero.secondaryCta}
        />

        {/* Mobile: GLANCE + PRESS — same cards as desktop, light bg */}
        <div ref={mobileGlanceRef} data-zone="dark" className="md:hidden" style={{ background: '#100D09', paddingBottom: 'clamp(20px, 4vh, 34px)', position: 'relative', overflow: 'hidden' }}>

          {/* Scroll-linked blur background */}
          <motion.div aria-hidden="true" style={{ position: 'absolute', inset: '-20%', y: glanceBgY, pointerEvents: 'none', zIndex: 0,
            background: 'radial-gradient(ellipse 70% 45% at 15% 25%, rgba(176,83,41,0.18), transparent), radial-gradient(ellipse 55% 40% at 85% 65%, rgba(201,169,110,0.14), transparent)',
            filter: 'blur(36px)',
          }} />
          <motion.div aria-hidden="true" style={{ position: 'absolute', inset: '-20%', y: glanceBgY2, pointerEvents: 'none', zIndex: 0,
            background: 'radial-gradient(ellipse 60% 50% at 70% 20%, rgba(212,128,78,0.10), transparent), radial-gradient(ellipse 80% 35% at 30% 85%, rgba(176,83,41,0.08), transparent)',
            filter: 'blur(48px)',
          }} />

          {/* Content above bg layers */}
          <div style={{ position: 'relative', zIndex: 1 }}>

          {/* Wordmark carried from hero */}
          <div style={{ padding: '28px 24px 0' }}>
            <div style={{ fontFamily: FONT, fontSize: 'clamp(26px, 7.5vw, 36px)', fontWeight: 200, letterSpacing: '0.18em', textTransform: 'uppercase', lineHeight: 1, color: 'rgba(242,237,227,0.85)' }}>
              HORIZONS
            </div>
            <div style={{ marginLeft: 10, marginTop: 3, display: 'flex', alignItems: 'baseline', gap: '0.35em', flexWrap: 'nowrap' }}>
              <span style={{ fontFamily: FONT, fontSize: 'clamp(14px, 4vw, 20px)', fontWeight: 600, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#8C3F1E', lineHeight: 1.05 }}>
                Sandhills
              </span>
              <motion.span
                style={{ fontFamily: 'Fraunces, Canela, Georgia, serif', fontSize: 'clamp(18px, 5vw, 26px)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(242,237,227,0.85)', lineHeight: 1 }}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.25 }}
              >
                is…
              </motion.span>
            </div>
          </div>

          {/* Positioning statement — completes "…is" on mobile */}
          <motion.div
            style={{ padding: '14px 24px 0' }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.35 }}
          >
            <h2
              className="font-display"
              style={{ fontVariationSettings: '"wght" 300, "opsz" 96, "SOFT" 50', fontSize: 'clamp(1.85rem, 9vw, 2.6rem)', lineHeight: 1.06, letterSpacing: '-0.02em', color: 'rgba(242,237,227,0.95)' }}
            >
              A five-star hotel.<br />Except the hotel is a{' '}
              <img src="/images/f-orest.webp" alt="forest" className="inline-block" style={{ height: '0.9em', width: 'auto', verticalAlign: '-0.05em', borderRadius: '0.12em' }} />.
            </h2>
          </motion.div>

          {/* Territory roadmap — vertical zigzag, scroll-loaded */}
          <div style={{ marginTop: 'clamp(20px, 4vh, 36px)' }}>
            <MobileRoadmap />
          </div>

          {/* Vibe cue — call to keep going */}
          <motion.div
            className="text-center"
            style={{ margin: 'clamp(28px, 6vh, 48px) 24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p
              className="font-display"
              style={{ fontVariationSettings: '"wght" 360, "opsz" 64, "SOFT" 30', fontSize: 'clamp(1.2rem, 5.6vw, 1.6rem)', lineHeight: 1.3, letterSpacing: '-0.01em', color: 'rgba(242,237,227,0.9)', maxWidth: '24ch' }}
            >
              A place with a genuinely one-of-a-kind vibe.{' '}
              <span style={{ fontStyle: 'italic', color: '#D4804E' }}>Don't believe us? See for yourself.</span>
            </p>
            <div className="animate-bounceCue" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <span className="font-eyebrow" style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: 'rgba(242,237,227,0.5)' }}>Scroll</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgba(242,237,227,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </div>
          </motion.div>

          </div>{/* /content zIndex:1 */}
        </div>

        {/* Anchor — must be in normal flow */}
        <span id="stays" style={{ display: 'block', height: 0, pointerEvents: 'none' }} aria-hidden="true" />

        {/* VillaCascade: z-index 20, без overflow:hidden — sticky внутри работает */}
        <div style={{ position: 'relative', zIndex: 20 }}>
          <VillaCascade />
        </div>

        {/* STAYS content: IncludedList → Activities → Nearby */}
        {/* <RoundedEntry style={{ position: 'relative', zIndex: 20 }}>
          <IncludedList items={d.included} />
          <ActivitiesGrid activities={d.activities} />
          <NearbyGrid nearby={d.nearby} />
        </RoundedEntry> */}

        {/* ── Land story (collapsed) + Press ── */}
        <div style={{ position: 'relative', zIndex: 20 }}>

          {/* Fade-in edge above the strip */}
          <div aria-hidden="true" style={{
            height: 'clamp(32px, 5vh, 56px)',
            background: 'linear-gradient(to bottom, transparent, rgba(10,8,6,0.38))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            pointerEvents: 'none',
          }} />

          {/* Land history disclosure strip — glass */}
          <div style={{
            padding: 'clamp(18px, 2.8vh, 28px) clamp(24px, 4vw, 64px)',
            display: 'flex', alignItems: 'center', gap: 'clamp(16px, 2vw, 28px)', flexWrap: 'wrap',
            background: 'rgba(10,8,6,0.38)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}>
            <button
              onClick={() => setLandStoryOpen(v => !v)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                background: '#B05329', border: 'none', cursor: 'pointer',
                padding: 'clamp(10px, 1.4vh, 14px) clamp(18px, 2vw, 26px)',
                borderRadius: 999, flexShrink: 0,
              }}
            >
              <span style={{ fontFamily: 'Inter Tight, Inter, system-ui, sans-serif', fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#F2EDE3' }}>
                Land history
              </span>
              <motion.span
                animate={{ rotate: landStoryOpen ? 45 : 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                style={{ color: '#F2EDE3', fontSize: 16, lineHeight: 1, display: 'block' }}
              >
                +
              </motion.span>
            </button>

            <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(12px, 1vw, 14px)', color: 'rgba(231,222,199,0.45)', margin: 0, lineHeight: 1.5 }}>
              A short history of the land this property sits on.
            </p>
          </div>

          <AnimatePresence initial={false}>
            {landStoryOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <LandStory />
              </motion.div>
            )}
          </AnimatePresence>

          <PressFeature />
        </div>

        {/* ── Influencer social proof ── */}
        <div style={{ position: 'relative', zIndex: 20 }}>
          <InfluencerProof />
        </div>

        {/* ── Map + drive times from nearby cities ── */}
        <div style={{ position: 'relative', zIndex: 20 }}>
          <GettingHere />
        </div>

        {/* ── Карточка 2: WORTH IT — скрыта ── */}
        {/* <StackCard zIndex={30}>
          <ChapterOpener
            id="table"
            numeral={d.chapters[3].numeral}
            subtitle={d.chapters[3].subtitle}
            bigType={d.chapters[3].bigType}
            image={d.chapters[3].image}
            zone="pine-deep"
            minHeight="75vh"
          />
        </StackCard>

        <RoundedEntry style={{ position: 'relative', zIndex: 40 }}>
          <DiningEditorial />
          <MapBlock directions={d.directions} />
          <GalleryMasonry images={d.gallery} />
          <ProofSocial reviews={d.reviews} pressQuote={d.pressQuote} />
          <FaqAccordion items={d.faq} />
        </RoundedEntry> */}

        {/* ── Карточка 3: WAITING наплывает (z-index 50) ── */}
        <StackCard zIndex={50}>
          <FinalCtaImmersive
            bigType={d.finalCta.bigType}
            headline={d.finalCta.headline}
            sub={d.finalCta.sub}
            image={d.finalCta.image}
          />
        </StackCard>
      </main>

      {/* Footer: z-index 60 — наезжает поверх WAITING */}
      <div style={{ position: 'relative', zIndex: 60 }}>
        <Footer />
      </div>

      {/* Mobile sticky booking bar — появляется после скролла ниже героя */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-night/95 backdrop-blur-md border-t border-linen/10 px-4 py-3 flex items-center justify-between"
        style={{
          transform: bookingBarVisible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div>
          <p className="text-linen font-medium text-sm">From $450 / night</p>
          <p className="text-linen/50 text-xs">Forest Villa · 2-night minimum</p>
        </div>
        <a
          href="#reserve"
          className="eyebrow bg-signal text-linen px-5 py-3 text-[10px] rounded-full hover:bg-signal2 transition-colors focus-visible:ring-2 focus-visible:ring-signal outline-none"
        >
          Check Availability
        </a>
      </div>
    </>
  );
}
