import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

interface Stat {
  value: string;
  label: string;
}

export default function AtAGlance({ stats }: { stats: Stat[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-dune py-20 md:py-28 px-6">
      <div className="max-w-content mx-auto">
        <p className="eyebrow text-ink2 text-center mb-14">At a glance</p>
        <motion.ul
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 list-none p-0 m-0"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
        >
          {stats.map((s) => (
            <motion.li
              key={s.label}
              variants={{ hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } } }}
              className="text-center"
            >
              <p
                className="font-display font-light text-ink text-[clamp(40px,5vw,72px)] leading-none mb-2"
                style={{ fontVariationSettings: '"SOFT" 20, "opsz" 72', letterSpacing: '-0.03em' }}
              >
                {s.value}
              </p>
              <p className="eyebrow text-ink2">{s.label}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
