import { useRef, useEffect } from 'react';
import RevealOnScroll from '../primitives/RevealOnScroll';

const publications = [
  {
    name: 'The New York Times',
    logo: '/images/press/nyt.png',
    description: 'notes the global trend toward "digital detoxification" and the search for authenticity in secluded inland retreats like this.',
    href: 'https://www.nytimes.com/2025/01/22/travel/digitial-detox-retreat-vacation.html',
  },
  {
    name: 'Southern Living',
    logo: '/images/press/southern-living.png',
    description: 'marvels at "the scent of longleaf pine and Carolina\'s endless blue sky," calling the region ideal for making lasting family memories.',
    href: 'https://www.southernliving.com/best-small-towns-south-carolina-7692785',
  },
  {
    name: 'Condé Nast Traveler',
    logo: '/images/press/conde-nast.png',
    description: 'describes a stay in this natural setting as "a meditative experience," a welcome contrast to the noise of coastal resorts.',
    href: null,
  },
  {
    name: 'Garden & Gun',
    logo: '/images/press/garden-gun.png',
    description: 'highlights the region\'s "soft luxury" aesthetic and its rich farm-to-table culinary culture.',
    href: 'https://gardenandgun.com/for-the-love-of-horses-hounds-and-history-in-south-carolinas-olde-english-district',
  },
  {
    name: 'National Geographic',
    logo: '/images/press/nat-geo.png',
    description: 'underscores the exceptional biodiversity and the rare value of the Sandhills\' untouched relict forests.',
    href: 'https://www.nationalgeographic.com/travel/national-parks/article/congaree-national-park',
  },
];

const logoStyle: React.CSSProperties = {
  mixBlendMode: 'multiply',
  filter: 'grayscale(1)',
  opacity: 0.7,
};

export default function PressStrip() {
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const velRef = useRef(0);
  const baseSpeed = 0.5;
  const lastTouchX = useRef(0);
  const rafId = useRef(0);
  const pausedRef = useRef(false);
  const releasingRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const halfWidth = track.scrollWidth / 2;

    const tick = () => {
      if (releasingRef.current) {
        // быстро гасим скорость до базовой после отпускания
        velRef.current += (baseSpeed - velRef.current) * 0.08;
        if (Math.abs(velRef.current - baseSpeed) < 0.01) {
          velRef.current = baseSpeed;
          releasingRef.current = false;
          pausedRef.current = false;
        }
      } else if (pausedRef.current) {
        velRef.current *= 0.85; // трение при удержании
      } else {
        velRef.current += (baseSpeed - velRef.current) * 0.025;
      }

      xRef.current += velRef.current;
      if (xRef.current >= halfWidth) xRef.current -= halfWidth;
      if (xRef.current < 0) xRef.current += halfWidth;
      track.style.transform = `translateX(-${xRef.current}px)`;
      rafId.current = requestAnimationFrame(tick);
    };

    rafId.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId.current);
  }, []);

  const onTouchStart = (e: React.TouchEvent) => {
    pausedRef.current = true;
    releasingRef.current = false;
    lastTouchX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    const dx = lastTouchX.current - e.touches[0].clientX;
    velRef.current = Math.max(-8, Math.min(8, velRef.current + dx * 0.15));
    lastTouchX.current = e.touches[0].clientX;
  };

  return (
    <div className="bg-bone border-y border-divider">

      {/* Мобайл — бесконечная карусель */}
      <div className="sm:hidden py-8 overflow-hidden">
        <p className="eyebrow text-ink2 text-center mb-6 px-6">A region celebrated by</p>
        <div
          ref={trackRef}
          className="flex"
          style={{ willChange: 'transform' }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={() => { releasingRef.current = true; }}
        >
          {[...publications, ...publications].map((p, i) => {
            const cardClass = "flex flex-col items-center text-center gap-5 bg-boneWarm rounded-2xl p-6 shrink-0 mx-2 pointer-events-auto";
            const inner = (
              <>
                <img src={p.logo} alt={p.name} className="h-7 w-auto object-contain" style={logoStyle} />
                <p className="font-display font-light text-ink/70" style={{ fontStyle: 'italic', fontSize: '15px', lineHeight: 1.6, fontVariationSettings: '"SOFT" 40, "opsz" 18' }}>
                  "{p.description}"
                </p>
              </>
            );
            return p.href
              ? <a key={i} href={p.href} target="_blank" rel="noopener noreferrer" className={`${cardClass} transition-opacity hover:opacity-75`} style={{ width: '72vw' }}>{inner}</a>
              : <div key={i} className={cardClass} style={{ width: '72vw' }}>{inner}</div>;
          })}
        </div>
      </div>

      {/* Десктоп */}
      <div className="hidden sm:block py-14 px-6">
        <RevealOnScroll className="max-w-content mx-auto">
          <p className="eyebrow text-ink2 text-center mb-12">Located in a region celebrated by</p>
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-10">
            {publications.map((p) => {
              const inner = (
                <>
                  <img src={p.logo} alt={p.name} className="h-8 w-auto object-contain object-left transition-opacity group-hover:opacity-50" style={logoStyle} />
                  <p className="text-ink2 text-sm leading-relaxed group-hover:text-ink transition-colors">{p.description}</p>
                </>
              );
              return p.href
                ? <a key={p.name} href={p.href} target="_blank" rel="noopener noreferrer" className="flex flex-col gap-4 group">{inner}</a>
                : <div key={p.name} className="flex flex-col gap-4">{inner}</div>;
            })}
          </div>
        </RevealOnScroll>
      </div>

    </div>
  );
}
