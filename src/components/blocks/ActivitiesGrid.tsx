import { motion, useReducedMotion } from 'framer-motion';

interface Activity {
  title: string;
  note: string;
  tag: string;
  image: string;
}

export default function ActivitiesGrid({ activities }: { activities: Activity[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-bone py-24 md:py-32 px-6">
      <div className="max-w-content mx-auto">
        <div className="mb-14">
          <p className="eyebrow text-ink2 mb-3">What to do</p>
          <h3
            className="font-display font-light text-ink text-[clamp(28px,4vw,52px)]"
            style={{ fontVariationSettings: '"SOFT" 30, "opsz" 72', letterSpacing: '-0.02em' }}
          >
            Six ways to use the land.
          </h3>
        </div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {activities.map((act) => (
            <motion.article
              key={act.title}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
              className="group overflow-hidden bg-surface"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={act.image}
                  alt={act.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  width={600}
                  height={450}
                />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-body font-medium text-ink text-base">{act.title}</h4>
                  <span className={`eyebrow ml-4 flex-shrink-0 px-2 py-1 text-[10px] ${act.tag.includes('Add-on') ? 'bg-honeyDark/10 text-honey' : 'bg-longleaf/10 text-longleaf'}`}>
                    {act.tag}
                  </span>
                </div>
                <p className="text-ink2 text-sm">{act.note}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
