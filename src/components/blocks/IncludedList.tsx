import { useState, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface Item {
  n: string;
  title: string;
  note: string;
  noteEmphasis?: string;
  icon?: string;
}

const A = ({ children }: { children: React.ReactNode }) => (
  <span style={{ color: '#C4531A' }}>{children}</span>
);

const popups: Record<string, React.ReactNode> = {
  '01': <><A>Cedar walls, river stones, real heat.</A> Not a spa amenity — a ritual. Six degrees from the water's edge, the sauna holds four, runs on wood, and <A>asks nothing of you</A> except to sit still and let the forest do its work.</>,
  '02': <><A>Two Kevlar canoes.</A> Two stand-up boards. The lake doesn't have a schedule. Neither do you. Push off whenever the light looks right — <A>dawn tends to be the answer,</A> but no one's checking.</>,
  '03': <>Whole beans from <A>a roaster thirty miles south.</A> A hand-grinder, a proper dripper, loose-leaf as backup. The kind of morning that starts <A>before the birds finish</A> deciding what to say.</>,
  '04': <><A>Wood stacked, kindling split, lighter waiting.</A> A fire pit wide enough for six chairs and the kind of conversation that only happens <A>once the screens are put away</A> and the dark gets comfortable.</>,
  '05': <><A>Twelve miles, four trailheads,</A> one illustrated map left on your table. The longleaf pines don't rush. Neither should you. <A>Lose yourself deliberately</A> — the property ends at a creek you'll want to find.</>,
  '06': <>Two recliners, facing up. <A>No light pollution within twelve miles.</A> The Milky Way is structural here, not occasional. Bring nothing — the sky <A>already has everything it needs</A> to make you feel small in the best way.</>,
  '07': <><A>Sourdough from the town baker.</A> Local honey, pine-smoked salt, something preservable and something that won't last the night. A way of saying <A>you were expected</A> before you arrived.</>,
  '08': <><A>Mixed by hand, on the property,</A> from longleaf needles and mineral salts pulled from the Pee Dee basin. The tub is deep. The evening is long. <A>Both are yours.</A></>,
  '09': <>Portuguese linen, <A>400 thread count,</A> heavyweight Turkish towels. The kind that hold heat and age well. Changed mid-stay for longer visits. <A>No corners cut</A> where it touches your skin.</>,
  '10': <>Not a number, not an app. <A>A person nearby</A> who knows where the good heron spot is and when the fog usually lifts. Available. Unhurried. <A>Genuinely pleased you came.</A></>,
  '11': <><A>Starlink at The House and sauna.</A> Fast enough to work, present enough not to need it. The Boxbles stay offline — <A>by design,</A> not oversight. The trees have better coverage anyway.</>,
  '12': <><A>A Marshall, per room.</A> Charged, connected, volume set to wherever you want it. Play the thing you've been saving for <A>a place that deserves it.</A> This is that place.</>,
};

const ICON_SIZE = 43;

const svgIcons: Record<string, React.ReactNode> = {
  '01': (
    <svg viewBox="0 0 36 36" width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="#4A3F30" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="wi-g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4C8B4"/><stop offset="100%" stopColor="#8A7A65"/></linearGradient></defs>
      <path d="M8 30 L8 18 Q8 8 18 8 Q28 8 28 18 L28 30"/>
      <path d="M13 30 L13 20 Q13 14 18 14 Q23 14 23 20 L23 30" fill="url(#wi-g1)"/>
    </svg>
  ),
  '02': (
    <svg viewBox="0 0 36 36" width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="#4A3F30" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="wi-g2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4C8B4"/><stop offset="100%" stopColor="#8A7A65"/></linearGradient></defs>
      <ellipse cx="18" cy="18" rx="6" ry="11" fill="url(#wi-g2)"/>
      <line x1="18" y1="7" x2="18" y2="29"/>
      <path d="M6 18 Q10 14 14 18 Q18 22 22 18 Q26 14 30 18"/>
    </svg>
  ),
  '03': (
    <svg viewBox="0 0 36 36" width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="#4A3F30" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="wi-g3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4C8B4"/><stop offset="100%" stopColor="#8A7A65"/></linearGradient></defs>
      <path d="M9 14 Q9 8 18 8 Q27 8 27 14 L25 26 Q24 28 18 28 Q12 28 11 26 Z" fill="url(#wi-g3)"/>
      <path d="M27 16 Q31 16 31 20 Q31 24 27 23"/>
      <path d="M15 6 Q15 4 18 4 Q21 4 21 6"/>
    </svg>
  ),
  '04': (
    <svg viewBox="0 0 36 36" width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="#4A3F30" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="wi-g4" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4C8B4"/><stop offset="100%" stopColor="#8A7A65"/></linearGradient></defs>
      <polygon points="18,6 28,26 8,26" fill="url(#wi-g4)"/>
      <line x1="10" y1="30" x2="26" y2="30"/>
      <line x1="14" y1="30" x2="12" y2="26"/>
      <line x1="22" y1="30" x2="24" y2="26"/>
    </svg>
  ),
  '05': (
    <svg viewBox="0 0 36 36" width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="#4A3F30" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="wi-g5" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4C8B4"/><stop offset="100%" stopColor="#8A7A65"/></linearGradient></defs>
      <polygon points="18,4 25,20 11,20" fill="url(#wi-g5)"/>
      <polygon points="10,10 16,24 4,24"/>
      <polygon points="26,10 32,24 20,24"/>
      <line x1="18" y1="20" x2="18" y2="30"/>
      <line x1="10" y1="24" x2="10" y2="30"/>
      <line x1="26" y1="24" x2="26" y2="30"/>
    </svg>
  ),
  '06': (
    <svg viewBox="0 0 36 36" width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="#4A3F30" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="wi-g6" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4C8B4"/><stop offset="100%" stopColor="#8A7A65"/></linearGradient></defs>
      <path d="M6 28 L14 14 L22 20 L30 10"/>
      <path d="M20 28 Q20 22 26 20 L30 22 L30 28 Z" fill="url(#wi-g6)"/>
      <circle cx="8" cy="26" r="2.5" fill="url(#wi-g6)"/>
    </svg>
  ),
  '07': (
    <svg viewBox="0 0 36 36" width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="#4A3F30" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="wi-g7" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4C8B4"/><stop offset="100%" stopColor="#8A7A65"/></linearGradient></defs>
      <rect x="8" y="14" width="20" height="16" rx="1.5" fill="url(#wi-g7)"/>
      <line x1="8" y1="18" x2="28" y2="18"/>
      <path d="M11 14 L11 10 Q11 7 18 7 Q25 7 25 10 L25 14"/>
      <path d="M15 7 Q15 5 18 5 Q21 5 21 7"/>
    </svg>
  ),
  '08': (
    <svg viewBox="0 0 36 36" width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="#4A3F30" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="wi-g8" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4C8B4"/><stop offset="100%" stopColor="#8A7A65"/></linearGradient></defs>
      <path d="M18 4 C18 4 8 12 8 20 C8 26 12 30 18 30 C24 30 28 26 28 20 C28 12 18 4 18 4 Z" fill="url(#wi-g8)"/>
      <line x1="18" y1="4" x2="18" y2="30"/>
      <path d="M11 18 Q14 15 18 17 Q22 15 25 18"/>
    </svg>
  ),
  '09': (
    <svg viewBox="0 0 36 36" width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="#4A3F30" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="wi-g9" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4C8B4"/><stop offset="100%" stopColor="#8A7A65"/></linearGradient></defs>
      <rect x="6" y="10" width="24" height="18" rx="2" fill="url(#wi-g9)"/>
      <line x1="6" y1="18" x2="30" y2="18"/>
      <line x1="6" y1="22" x2="30" y2="22"/>
    </svg>
  ),
  '10': (
    <svg viewBox="0 0 36 36" width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="#4A3F30" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="wi-g10" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4C8B4"/><stop offset="100%" stopColor="#8A7A65"/></linearGradient></defs>
      <circle cx="18" cy="11" r="5" fill="url(#wi-g10)"/>
      <path d="M8 32 C8 24 12 20 18 20 C24 20 28 24 28 32"/>
    </svg>
  ),
  '11': (
    <svg viewBox="0 0 36 36" width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="#4A3F30" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="wi-g11" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4C8B4"/><stop offset="100%" stopColor="#8A7A65"/></linearGradient></defs>
      <path d="M5 16 Q18 4 31 16"/>
      <path d="M9 20 Q18 11 27 20"/>
      <path d="M13 24 Q18 19 23 24"/>
      <circle cx="18" cy="28" r="2.5" fill="url(#wi-g11)"/>
    </svg>
  ),
  '12': (
    <svg viewBox="0 0 36 36" width={ICON_SIZE} height={ICON_SIZE} fill="none" stroke="#4A3F30" strokeWidth={1.3} strokeLinecap="round" strokeLinejoin="round">
      <defs><linearGradient id="wi-g12" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4C8B4"/><stop offset="100%" stopColor="#8A7A65"/></linearGradient></defs>
      <circle cx="18" cy="18" r="13"/>
      <circle cx="18" cy="18" r="8"/>
      <circle cx="18" cy="18" r="3.5" fill="url(#wi-g12)"/>
    </svg>
  ),
};

export default function IncludedList({ items }: { items: Item[] }) {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      setPos({ x: e.clientX, y: e.clientY });
    });
  };

  return (
    <section data-zone="light" data-bg="#E6DECC" className="bg-surface pt-12 md:pt-16 pb-24 md:pb-32 px-6">
      <div className="max-w-content mx-auto">
        <div className="mb-14">
          <p className="eyebrow-lg text-ink2 mb-3" style={{ fontSize: '16px' }}>What's included</p>
          <div className="w-8 h-0.5 bg-signal mb-11" />
          <h3
            className="font-display font-light text-ink text-[clamp(28px,4vw,52px)]"
            style={{ fontVariationSettings: '"SOFT" 30, "opsz" 72', letterSpacing: '-0.02em' }}
          >
            Every stay,{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--color-signal, #C4531A)' }}>without asking.</em>
          </h3>
        </div>

        <motion.div
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px"
          style={{ background: 'rgba(100, 90, 70, 0.15)' }}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
        >
          {items.map((item) => (
            <motion.div
              key={item.n}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7 } } }}
              className="bg-surface p-8 md:p-9 transition-colors duration-200 hover:bg-[#EAE4D6] hidden sm:block"
              onMouseEnter={() => setHovered(item.n)}
              onMouseLeave={() => setHovered(null)}
              onMouseMove={handleMouseMove}
            >
              <span className="block mb-5">
                {svgIcons[item.n] ?? null}
              </span>
              <p className="font-display text-ink mb-2" style={{ fontSize: '19px', fontWeight: 400, lineHeight: 1.25, letterSpacing: '-0.01em' }}>
                {item.title}
              </p>
              <p className="text-signal" style={{ fontSize: '12.5px', fontWeight: 300, lineHeight: 1.5 }}>
                {item.note}
                {item.noteEmphasis && <> · <em style={{ fontStyle: 'italic' }}>{item.noteEmphasis}</em></>}
              </p>
            </motion.div>
          ))}

        </motion.div>

        {/* Mobile accordion list */}
        <div className="sm:hidden border-t border-divider">
          {items.map((item) => {
            const isOpen = openItem === item.n;
            return (
              <div key={`m-${item.n}`} className="border-b border-divider">
                <button
                  className="w-full flex items-center gap-4 py-4 text-left"
                  onClick={() => setOpenItem(isOpen ? null : item.n)}
                >
                  <span className="shrink-0">{svgIcons[item.n]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-display text-ink" style={{ fontSize: '17px', fontWeight: 400, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                      {item.title}
                    </p>
                    <p className="text-signal mt-0.5" style={{ fontSize: '12px', fontWeight: 300, lineHeight: 1.4 }}>
                      {item.note}
                      {item.noteEmphasis && <> · <em style={{ fontStyle: 'italic' }}>{item.noteEmphasis}</em></>}
                    </p>
                  </div>
                  <span
                    className="shrink-0 text-ink2 transition-transform duration-300"
                    style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)', fontSize: '22px', lineHeight: 1 }}
                  >+</span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="body"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <div
                        className="pb-5 pl-14 pr-2"
                        style={{ fontSize: '13px', lineHeight: 1.7, color: '#5C4F3D', fontWeight: 300 }}
                      >
                        {popups[item.n]}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {hovered && popups[hovered] && (
          <motion.div
            key={hovered}
            initial={{ opacity: 0, scale: 0.94, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="hidden sm:block"
            style={{
              position: 'fixed',
              left: pos.x + 24,
              top: pos.y - 16,
              zIndex: 500,
              pointerEvents: 'none',
              width: 260,
              background: '#1C1A16',
              borderRadius: 10,
              padding: '18px 20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.28)',
            }}
          >
            <p style={{ fontSize: '13px', lineHeight: 1.65, color: '#C8BFB0', fontWeight: 300, fontFamily: 'inherit' }}>
              {popups[hovered]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
