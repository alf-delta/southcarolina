import { useEffect } from 'react';
import { sandhillsData as d } from '../components/data/sandhills';
import StructuredData from '../components/StructuredData';

import StickyHeader from '../components/blocks/StickyHeader';
import HeroImmersive from '../components/blocks/HeroImmersive';
import PressStrip from '../components/blocks/PressStrip';
import ChapterOpener from '../components/blocks/ChapterOpener';
import LandStory from '../components/blocks/LandStory';
import AtAGlance from '../components/blocks/AtAGlance';
import StaysGrid from '../components/blocks/StaysGrid';
import IncludedList from '../components/blocks/IncludedList';
// import DayScenes from '../components/blocks/DayScenes';
import DiningEditorial from '../components/blocks/DiningEditorial';
import ActivitiesGrid from '../components/blocks/ActivitiesGrid';
import MapBlock from '../components/blocks/MapBlock';
import GalleryMasonry from '../components/blocks/GalleryMasonry';
import ProofSocial from '../components/blocks/ProofSocial';
import NearbyGrid from '../components/blocks/NearbyGrid';
import FaqAccordion from '../components/blocks/FaqAccordion';
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
          eyebrow={d.hero.eyebrow}
          titleLine1={d.hero.titleLine1}
          titleLine2={d.hero.titleLine2}
          subtitle={d.hero.subtitle}
          primaryCta={d.hero.primaryCta}
          secondaryCta={d.hero.secondaryCta}
          env={d.hero.env}
          subject={d.hero.subject}
        />
        <PressStrip />
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
        <AtAGlance />

        {/* ── Карточка 1: STAYS наплывает и остаётся (z-index 10) ── */}
        <StackCard zIndex={10}>
          <ChapterOpener
            id="stays"
            numeral={d.chapters[1].numeral}
            subtitle={d.chapters[1].subtitle}
            bigType={d.chapters[1].bigType}
            image={d.chapters[1].image}
            zone="night"
            minHeight="45vh"
          />
        </StackCard>

        {/* Контент Stays: z-index 20 — наезжает поверх застрявшего opener'а */}
        <RoundedEntry style={{ position: 'relative', zIndex: 20 }}>
          <StaysGrid stays={d.stays} />
          <IncludedList items={d.included} />
        </RoundedEntry>

        {/* ── Карточка 2: A DAY — скрыто ── */}
        {/* ── Карточка 2: WORTH IT наплывает и остаётся (z-index 30) ── */}
        {/* A DAY скрыт — z-30 теперь занимает WORTH IT */}
        <StackCard zIndex={30}>
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

        {/* Контент Worth It: z-index 40 — наезжает поверх застрявшего opener'а */}
        <RoundedEntry style={{ position: 'relative', zIndex: 40 }}>
          <DiningEditorial />
          <ActivitiesGrid activities={d.activities} />
          <NearbyGrid nearby={d.nearby} />
          <MapBlock directions={d.directions} />
          <GalleryMasonry images={d.gallery} />
          <ProofSocial reviews={d.reviews} pressQuote={d.pressQuote} />
          <FaqAccordion items={d.faq} />
        </RoundedEntry>

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
          <p className="text-linen/50 text-xs">Boxble · 2-night minimum</p>
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
