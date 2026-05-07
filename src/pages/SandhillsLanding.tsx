import { useEffect } from 'react';
import { sandhillsData as d } from '../components/data/sandhills';
import StructuredData from '../components/StructuredData';

import StickyHeader from '../components/blocks/StickyHeader';
import HeroImmersive from '../components/blocks/HeroImmersive';

import ChapterOpener from '../components/blocks/ChapterOpener';
import LandStory from '../components/blocks/LandStory';
import AtAGlance from '../components/blocks/AtAGlance';
import VillaCascade from '../components/blocks/VillaCascade';
// import DayScenes from '../components/blocks/DayScenes';
// import DiningEditorial from '../components/blocks/DiningEditorial';
// import MapBlock from '../components/blocks/MapBlock';
// import GalleryMasonry from '../components/blocks/GalleryMasonry';
// import ProofSocial from '../components/blocks/ProofSocial';
// import NearbyGrid from '../components/blocks/NearbyGrid';
// import FaqAccordion from '../components/blocks/FaqAccordion';
import FinalCtaImmersive from '../components/blocks/FinalCtaImmersive';
import Footer from '../components/blocks/Footer';
import StackCard from '../components/primitives/StackCard';
import RoundedEntry from '../components/primitives/RoundedEntry';


export default function SandhillsLanding() {
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
        {/* Anchor — must be in normal flow, not inside sticky StackCard */}
        <span id="stays" style={{ display: 'block', height: 0, pointerEvents: 'none' }} aria-hidden="true" />

        {/* ── Карточка 1: STAYS наплывает и остаётся (z-index 10) ── */}
        <StackCard zIndex={10}>
          <ChapterOpener
            numeral={d.chapters[1].numeral}
            subtitle={d.chapters[1].subtitle}
            bigType={d.chapters[1].bigType}
            image={d.chapters[1].image}
            zone="night"
            minHeight="45vh"
          />
        </StackCard>

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

        {/* ── Land chapter + story (moved after STAYS) ── */}
        <div style={{ position: 'relative', zIndex: 20 }}>
          <RoundedEntry radius={32}>
            <ChapterOpener
              id="land"
              numeral={d.chapters[0].numeral}
              subtitle={d.chapters[0].subtitle}
              bigType={d.chapters[0].bigType}
              image={d.chapters[0].image}
              zone="pine-deep"
              minHeight="49vh"
            />
          </RoundedEntry>
          <LandStory />
          <div style={{ marginTop: -20 }}><AtAGlance /></div>
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

      {/* Mobile sticky booking bar — выше всего */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-[100] bg-night/95 backdrop-blur-md border-t border-linen/10 px-4 py-3 flex items-center justify-between">
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
