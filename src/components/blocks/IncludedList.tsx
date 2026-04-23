import { motion, useReducedMotion } from 'framer-motion';

interface Item {
  n: string;
  title: string;
  note: string;
}

export default function IncludedList({ items }: { items: Item[] }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-surface py-24 md:py-32 px-6">
      <div className="max-w-content mx-auto">
        <div className="mb-14">
          <p className="eyebrow text-ink2 mb-3">What's included</p>
          <h3
            className="font-display font-light text-ink text-[clamp(28px,4vw,52px)]"
            style={{ fontVariationSettings: '"SOFT" 30, "opsz" 72', letterSpacing: '-0.02em' }}
          >
            Every stay, without asking.
          </h3>
        </div>

        <motion.ul
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 list-none p-0 m-0 border-t border-divider"
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {items.map((item) => (
            <motion.li
              key={item.n}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
              className="border-b border-r border-divider p-6 md:p-8"
            >
              <p className="numeral text-ink2/50 mb-2">{item.n}</p>
              <p className="font-body font-medium text-ink mb-1">{item.title}</p>
              <p className="text-ink2 text-sm">{item.note}</p>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
}
