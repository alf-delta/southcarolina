import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

interface POI {
  distance: string;
  name: string;
  description: string;
  image: string;
  why: string;
  stats: { label: string; value: string }[];
}

const FALLBACK_GRADIENTS = [
  'linear-gradient(160deg, #2D4A2A 0%, #4A7C3D 50%, #3A6030 100%)',
  'linear-gradient(160deg, #5C4E2A 0%, #8A7840 50%, #6B6030 100%)',
  'linear-gradient(160deg, #2E1F10 0%, #5C3A1A 50%, #7A4E28 100%)',
  'linear-gradient(160deg, #0F2E38 0%, #1A5264 50%, #1E6B58 100%)',
];

export default function NearbyGrid({ nearby }: { nearby: POI[] }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<POI | null>(null);

  return (
    <section data-zone="light" data-bg="#EAE3D3" className="bg-boneWarm py-24 md:py-32 px-6">
      <div className="max-w-content mx-auto">
        <div className="mb-12">
          <p className="eyebrow-lg text-ink2 mb-3" style={{ fontSize: '16px' }}>Nearby</p>
          <h3
            className="font-display font-light text-ink text-[clamp(28px,4vw,48px)]"
            style={{ fontVariationSettings: '"SOFT" 30, "opsz" 72', letterSpacing: '-0.02em' }}
          >
            The wider Sandhills.
          </h3>
        </div>

        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {nearby.map((poi, i) => (
            <motion.article
              key={poi.name}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
              className="group cursor-pointer"
              onClick={() => setActive(poi)}
            >
              {/* Card */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '3/4' }}>
                {poi.image ? (
                  <img
                    src={poi.image}
                    alt={poi.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                    style={{ background: FALLBACK_GRADIENTS[i % FALLBACK_GRADIENTS.length] }}
                  />
                )}

                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)' }}
                />

                {/* Distance badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className="eyebrow text-linen/90 bg-night/40 backdrop-blur-sm px-2.5 py-1 rounded-full"
                    style={{ fontSize: '9px', letterSpacing: '0.14em' }}
                  >
                    {poi.distance}
                  </span>
                </div>

                {/* Name on image */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h4
                    className="font-display font-light text-linen leading-tight"
                    style={{
                      fontSize: 'clamp(16px, 1.6vw, 20px)',
                      fontWeight: 300,
                      letterSpacing: '-0.01em',
                      fontVariationSettings: '"SOFT" 40, "opsz" 24',
                    }}
                  >
                    {poi.name}
                  </h4>
                </div>

                {/* Hover hint */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div
                    className="border border-linen/40 text-linen/80 rounded-full px-5 py-2 backdrop-blur-sm bg-night/20"
                    style={{ fontSize: '11px', letterSpacing: '0.2em' }}
                  >
                    EXPLORE
                  </div>
                </div>
              </div>

              {/* Description below */}
              <p className="text-ink/60 mt-3 leading-relaxed" style={{ fontSize: '13px' }}>
                {poi.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>

      {/* Popup */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[300] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setActive(null)}
          >
            <div className="absolute inset-0 bg-night/80 backdrop-blur-sm" />

            <motion.div
              className="relative w-full max-w-lg overflow-hidden"
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image header */}
              <div className="relative h-52 overflow-hidden">
                {active.image ? (
                  <img src={active.image} alt={active.name} className="w-full h-full object-cover" />
                ) : (
                  <div
                    className="w-full h-full"
                    style={{ background: FALLBACK_GRADIENTS[nearby.indexOf(active) % FALLBACK_GRADIENTS.length] }}
                  />
                )}
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,12,8,0.92) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <p className="eyebrow text-linen/50 mb-1" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>
                    {active.distance}
                  </p>
                  <p
                    className="font-display text-linen italic"
                    style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em' }}
                  >
                    {active.name}
                  </p>
                </div>
                <button
                  onClick={() => setActive(null)}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-night/60 flex items-center justify-center text-linen/70 hover:text-linen transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="bg-[#1C1A16] p-6">
                {/* Why people love it */}
                <p className="text-linen/75 mb-6" style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.65 }}>
                  {active.why}
                </p>

                {/* Stats infographic */}
                <div
                  className="grid grid-cols-4 gap-px"
                  style={{ background: 'rgba(255,255,255,0.06)' }}
                >
                  {active.stats.map((s) => (
                    <div key={s.label} className="bg-[#1C1A16] px-3 py-4 text-center">
                      <p
                        className="eyebrow text-linen/30 mb-1.5"
                        style={{ fontSize: '8px', letterSpacing: '0.22em' }}
                      >
                        {s.label}
                      </p>
                      <p
                        className="font-display text-linen font-light"
                        style={{ fontSize: 'clamp(13px, 1.2vw, 15px)', letterSpacing: '-0.01em', lineHeight: 1.2 }}
                      >
                        {s.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
