import { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';

interface Activity {
  title: string;
  note: string;
  tag: string;
  image: string;
  schedule?: string;
  location?: string;
  points?: string[];
}

export default function ActivitiesGrid({ activities }: { activities: Activity[] }) {
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState<Activity | null>(null);

  const isAddon = (tag: string) => tag.includes('Add-on');

  return (
    <section data-zone="light" data-bg="#F2EDE3" className="bg-bone pt-10 md:pt-14 pb-24 md:pb-32 px-6">
      <div className="max-w-content mx-auto">
        <div className="mb-14">
          <p className="eyebrow-lg text-ink2 mb-3" style={{ fontSize: "16px" }}>What to do</p>
          <h3
            className="font-display font-light text-ink text-[clamp(28px,4vw,52px)]"
            style={{ fontVariationSettings: '"SOFT" 30, "opsz" 72', letterSpacing: '-0.02em' }}
          >
            Six ways to use the land.
          </h3>
        </div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {activities.map((act) => (
            <motion.article
              key={act.title}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
              className="group relative overflow-hidden cursor-pointer"
              style={{ aspectRatio: '4/3' }}
              onClick={() => setActive(act)}
            >
              <img
                src={act.image}
                alt={act.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={600}
                height={450}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)' }} />

              {/* Badge */}
              <div className="absolute top-4 right-4">
                <span className={`eyebrow px-3 py-1.5 text-[11px] font-medium tracking-widest ${isAddon(act.tag) ? 'bg-honey text-night' : 'bg-signal text-linen'}`} style={{ borderRadius: 999 }}>
                  {act.tag}
                </span>
              </div>

              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h4 className="font-display text-linen mb-1" style={{ fontSize: 'clamp(18px, 1.8vw, 22px)', fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                  {act.title}
                </h4>
                <p className="text-linen/70" style={{ fontSize: '13px', fontWeight: 300 }}>{act.note}</p>
              </div>

              {/* Hover hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="border border-linen/40 text-linen/80 rounded-full px-5 py-2 backdrop-blur-sm bg-night/20" style={{ fontSize: '11px', letterSpacing: '0.2em' }}>
                  EXPLORE
                </div>
              </div>
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
              {/* Image strip */}
              <div className="relative h-48 overflow-hidden">
                <img src={active.image} alt={active.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,12,8,0.9) 0%, transparent 60%)' }} />
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                  <div>
                    <p className="font-display text-linen italic" style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em' }}>
                      {active.title}
                    </p>
                  </div>
                  <span className={`eyebrow px-3 py-1.5 text-[11px] shrink-0 ml-4 ${isAddon(active.tag) ? 'bg-honey text-night' : 'bg-signal text-linen'}`} style={{ borderRadius: 999 }}>
                    {active.tag}
                  </span>
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
                {/* Meta row */}
                <div className="grid grid-cols-2 gap-px mb-6" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div className="bg-[#1C1A16] px-4 py-3">
                    <p className="eyebrow text-linen/30 mb-1" style={{ fontSize: '9px', letterSpacing: '0.25em' }}>SCHEDULE</p>
                    <p className="text-linen" style={{ fontSize: '13px', fontWeight: 300, lineHeight: 1.4 }}>{active.schedule}</p>
                  </div>
                  <div className="bg-[#1C1A16] px-4 py-3">
                    <p className="eyebrow text-linen/30 mb-1" style={{ fontSize: '9px', letterSpacing: '0.25em' }}>LOCATION</p>
                    <p className="text-linen" style={{ fontSize: '13px', fontWeight: 300, lineHeight: 1.4 }}>{active.location}</p>
                  </div>
                </div>

                {/* Points */}
                {active.points && (
                  <ul className="space-y-0">
                    {active.points.map((pt, i) => (
                      <li key={i} className={`flex items-start gap-3 py-2.5 ${i < active.points!.length - 1 ? 'border-b border-white/[0.06]' : ''}`}>
                        <span className="w-1 h-1 rounded-full bg-signal mt-2 shrink-0" />
                        <span style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.5, color: 'rgba(210,200,185,0.85)' }}>{pt}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
