import { useEffect } from 'react';
import { sandhillsData as d } from '../components/data/sandhills';

import StickyHeader from '../components/blocks/StickyHeader';
import HeroImmersive from '../components/blocks/HeroImmersive';
import PressStrip from '../components/blocks/PressStrip';
import ChapterOpener from '../components/blocks/ChapterOpener';
import LandStory from '../components/blocks/LandStory';
import AtAGlance from '../components/blocks/AtAGlance';
import StaysGrid from '../components/blocks/StaysGrid';
import IncludedList from '../components/blocks/IncludedList';
import DayScenes from '../components/blocks/DayScenes';
import DiningEditorial from '../components/blocks/DiningEditorial';
import ActivitiesGrid from '../components/blocks/ActivitiesGrid';
import SustainabilityStory from '../components/blocks/SustainabilityStory';
import MapBlock from '../components/blocks/MapBlock';
import GalleryMasonry from '../components/blocks/GalleryMasonry';
import ProofSocial from '../components/blocks/ProofSocial';
import NearbyGrid from '../components/blocks/NearbyGrid';
import FaqAccordion from '../components/blocks/FaqAccordion';
import FinalCtaImmersive from '../components/blocks/FinalCtaImmersive';
import Footer from '../components/blocks/Footer';
import StackCard from '../components/primitives/StackCard';
import RoundedEntry from '../components/primitives/RoundedEntry';

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Horizons Sandhills',
  description: d.meta.description,
  address: {
    '@type': 'PostalAddress',
    streetAddress: '423 Woodmen Rd',
    addressLocality: 'Patrick',
    addressRegion: 'SC',
    postalCode: '29584',
    addressCountry: 'US',
  },
  priceRange: '$$$',
  telephone: '+1-803-555-0180',
  url: 'https://horizons.com/sandhills',
};

export default function SandhillsLanding() {
  useEffect(() => {
    document.title = d.meta.title;
    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', d.meta.description);
  }, []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            minHeight="65vh"
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
            minHeight="60vh"
          />
        </StackCard>

        {/* Контент Stays: z-index 20 — наезжает поверх застрявшего opener'а */}
        <RoundedEntry style={{ position: 'relative', zIndex: 20 }}>
          <StaysGrid stays={d.stays} />
          <IncludedList items={d.included} />
        </RoundedEntry>

        {/* ── Карточка 2: A DAY наплывает (z-index 30) ── */}
        <StackCard zIndex={30}>
          <ChapterOpener
            id="day"
            numeral={d.chapters[2].numeral}
            subtitle={d.chapters[2].subtitle}
            bigType={d.chapters[2].bigType}
            image={d.chapters[2].image}
            zone="honey-dark"
            minHeight="60vh"
          />
        </StackCard>

        {/* Контент A Day + всё до Waiting: z-index 40 */}
        <RoundedEntry style={{ position: 'relative', zIndex: 40 }}>
          <DayScenes scenes={d.dayScenes} />
          <ChapterOpener
            id="table"
            numeral={d.chapters[3].numeral}
            subtitle={d.chapters[3].subtitle}
            bigType={d.chapters[3].bigType}
            image={d.chapters[3].image}
            zone="pine-deep"
          />
          <DiningEditorial
            headline={d.dining.headline}
            body={d.dining.body}
            emphasis={d.dining.emphasis}
            image={d.dining.image}
          />
          <ActivitiesGrid activities={d.activities} />
          <SustainabilityStory
            headline={d.sustainability.headline}
            lede={d.sustainability.lede}
            body={d.sustainability.body}
            stats={d.sustainability.stats}
            certs={d.sustainability.certs}
            image={d.sustainability.image}
          />
          <MapBlock directions={d.directions} />
          <GalleryMasonry images={d.gallery} />
          <ProofSocial reviews={d.reviews} pressQuote={d.pressQuote} />
          <NearbyGrid nearby={d.nearby} />
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
