import { motion, useReducedMotion } from 'framer-motion';

interface POI {
  distance: string;
  name: string;
  description: string;
}

export default function NearbyGrid({ nearby }: { nearby: POI[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-boneWarm py-24 md:py-32 px-6">
      <div className="max-w-content mx-auto">
        <div className="mb-12">
          <p className="eyebrow text-ink2 mb-3">Nearby</p>
          <h3
            className="font-display font-light text-ink text-[clamp(28px,4vw,48px)]"
            style={{ fontVariationSettings: '"SOFT" 30, "opsz" 72', letterSpacing: '-0.02em' }}
          >
            The wider Sandhills.
          </h3>
        </div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
        >
          {nearby.map((poi) => (
            <motion.article
              key={poi.name}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
              className="border-t-2 border-divider pt-6"
            >
              <p className="eyebrow text-honey mb-3">{poi.distance}</p>
              <h4 className="font-body font-medium text-ink mb-2">{poi.name}</h4>
              <p className="text-ink2 text-sm leading-relaxed">{poi.description}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
