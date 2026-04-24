import { motion, useReducedMotion } from 'framer-motion';

const items = [
  { value: '126', category: 'Private land · acres',                   description: '126 acres fully fenced — no neighbors, no noise, no sharing' },
  { value: '18',  category: 'Private lake · acres',                   description: 'Swim, kayak, or watch the sunrise from the water — all to yourselves' },
  { value: '7',   category: 'Cabins & retreats',                      description: 'From intimate Casitas to a full estate house sleeping up to 14' },
  { value: '4',   category: 'Signature experiences',                  description: 'Barrel sauna · private lake · padel court · forest trails' },
  { value: '12',  category: 'Miles of forest trails',                 description: 'Marked paths through longleaf pine — hike, bike, or wander' },
  { value: '≈ 90 min', category: 'From Charlotte, Raleigh & Columbia', description: 'Close enough for a weekend — far enough to feel worlds away' },
];

const motionList = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const motionItem = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7 } },
};

export default function AtAGlance() {
  const reduceMotion = useReducedMotion();
  const initial = reduceMotion ? false : 'hidden';

  return (
    <>
      {/* ── Мобайл: sticky card stack ── */}
      <section className="md:hidden bg-bone pt-0">
        <div className="relative">
          {items.map((item, i) => (
            <div
              key={item.category}
              className="sticky top-0 bg-bone flex flex-col items-center justify-center text-center px-8"
              style={{ height: '65svh', zIndex: i + 1 }}
            >
              {/* Прогресс */}
              <p className="eyebrow text-ink2/30 mb-10" style={{ fontSize: 9, letterSpacing: '0.22em' }}>
                {i + 1} / {items.length}
              </p>

              {/* Значение */}
              <span
                className="font-display text-signal leading-none mb-4"
                style={{ fontSize: 'clamp(4.5rem, 22vw, 7rem)', fontWeight: 400, letterSpacing: '-0.03em' }}
              >
                {item.value}
              </span>

              {/* Категория */}
              <span className="eyebrow-lg text-ink2 mb-5">{item.category}</span>

              {/* Описание */}
              <span
                className="font-display italic text-signal"
                style={{ fontSize: 'clamp(1.05rem, 4.5vw, 1.3rem)', lineHeight: 1.5, fontWeight: 300, fontVariationSettings: '"SOFT" 30, "opsz" 18', maxWidth: '28ch' }}
              >
                {item.description}
              </span>

              {/* Подсказка скролла на первой карточке */}
              {i === 0 && (
                <p className="absolute bottom-10 eyebrow text-ink2/25 animate-bounceCue" style={{ fontSize: 9, letterSpacing: '0.2em' }}>
                  scroll
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Десктоп: горизонтальная сетка ── */}
      <section className="hidden md:block bg-bone pt-8 pb-24 px-6">
        <div className="max-w-content mx-auto">
          <p className="eyebrow-lg text-ink2 text-center mb-14" style={{ fontSize: '16px' }}>At a glance</p>
          <motion.ul
            className="grid grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10 list-none p-0 m-0"
            initial={initial}
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            variants={motionList}
          >
            {items.map((item) => (
              <motion.li key={item.category} variants={motionItem} className="flex flex-col gap-2">
                <span
                  className="font-display text-signal leading-none"
                  style={{ fontSize: 'clamp(2rem, 3.2vw, 3rem)', fontWeight: 400, letterSpacing: '-0.02em' }}
                >
                  {item.value}
                </span>
                <span className="eyebrow text-ink2">{item.category}</span>
                <span
                  className="font-display italic text-signal"
                  style={{ fontSize: 13, lineHeight: 1.5, fontWeight: 300, fontVariationSettings: '"SOFT" 30, "opsz" 18' }}
                >
                  {item.description}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </section>
    </>
  );
}
