import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import Button from '../primitives/Button';
import { openBooking } from '../data/booking';

const openGallery = () => window.dispatchEvent(new CustomEvent('open-gallery'));

const navLinks = [
  { label: 'Stays',    href: '#stays',   onClick: undefined },
  { label: 'The Land', href: '#land',    onClick: undefined },
  { label: 'Gallery',  href: '#',        onClick: openGallery },
  { label: 'Reserve',  href: '#reserve', onClick: undefined },
];

export default function StickyHeader() {
  const [overDark, setOverDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => {
      const Y = 80;
      let isDark = false;
      document.querySelectorAll('[data-zone="dark"]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < Y && rect.bottom > Y) isDark = true;
      });
      document.querySelectorAll('[data-zone="light"]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < Y && rect.bottom > Y) isDark = false;
      });
      setOverDark(isDark);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const { scrollY } = useScroll();
  const h = typeof window !== 'undefined' ? window.innerHeight : 800;
  const trigger = h * 0.45;

const fullBgOpacity    = useTransform(scrollY, [0, trigger * 0.4], [0, 1]);
  const pillOpacity      = useTransform(scrollY, [0, trigger * 0.35], [1, 0]);
  const navOpacity       = useTransform(scrollY, [0, trigger * 0.3, trigger], [0, 0, 1]);
  const navX             = useTransform(scrollY, [0, trigger], [32, 0]);
  const galleryOpacity   = useTransform(scrollY, [0, trigger * 0.35], [1, 0]);
  const bookOpacity      = useTransform(scrollY, [trigger * 0.4, trigger], [0, 1]);
  const headerPb         = useTransform(scrollY, [0, trigger], [0, 40]);
  const largLogoH        = useTransform(scrollY, [0, trigger * 0.5], [64, 32]);
  const smallLogoOpacity = useTransform(scrollY, [trigger * 0.15, trigger * 0.5], [0, 1]);

  const textColor = overDark ? 'text-linen/90' : 'text-ink';

  return (
    <>
    {/* Full bg blur */}
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 64,
        zIndex: 199,
        opacity: fullBgOpacity,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        pointerEvents: 'none',
      }}
    />

    {/* Top gradient scrim */}
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 'clamp(100px, 14vh, 140px)',
        zIndex: 199,
        opacity: pillOpacity,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.42) 0%, transparent 100%)',
        pointerEvents: 'none',
      }}
    />

    {/* Sun glow backdrop — circle exactly matching sun diameter */}
    <motion.div
      className="hidden md:block"
      style={{
        position: 'fixed',
        top: 18,
        left: 'max(24px, calc(50vw - 760px))',
        zIndex: 200,
        width: largLogoH,
        height: largLogoH,
        borderRadius: '50%',
        opacity: pillOpacity,
        background: 'rgba(255,255,255,0.06)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        boxShadow: '0 0 28px 10px rgba(243,100,55,0.35)',
        pointerEvents: 'none',
      }}
    />

    {/* Large hero logo — outside masked header so bottom isn't clipped */}
    <motion.div
      className="hidden md:block"
      style={{
        position: 'fixed',
        top: 18,
        left: 'max(24px, calc(50vw - 760px))',
        zIndex: 201,
        opacity: pillOpacity,
        pointerEvents: 'none',
      }}
    >
      <motion.img
        src="/logo.svg"
        alt=""
        aria-hidden="true"
        style={{ height: largLogoH, width: 'auto', display: 'block' }}
      />
    </motion.div>

    <motion.header
      className="fixed top-0 left-0 right-0 z-[200] transition-colors duration-500"
      style={{
        paddingBottom: headerPb,
        // The soft-fade mask must be off while the mobile menu is open —
        // otherwise it dissolves the expanded menu into transparency.
        WebkitMaskImage: menuOpen ? 'none' : 'linear-gradient(to bottom, black 50%, transparent 100%)',
        maskImage: menuOpen ? 'none' : 'linear-gradient(to bottom, black 50%, transparent 100%)',
        boxShadow: overDark ? 'none' : '0 1px 0 rgba(0,0,0,0.06)',
        // The bar itself is transparent — don't let it swallow clicks meant for
        // content underneath; interactive children re-enable pointer events.
        pointerEvents: 'none',
      }}
    >
      <div className="max-w-content mx-auto px-6 md:px-10 h-16 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr] relative z-[2]">

        {/* Logo — grows in hero, shrinks on scroll */}
        <a
          href="#"
          className="flex items-center pointer-events-auto"
          style={{ transform: 'translateX(max(-100px, min(-16px, calc(684px - 50vw))))' }}
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            history.replaceState(null, '', window.location.pathname);
          }}
        >
          <motion.img
            src="/logo.svg"
            alt="Horizons Sandhills"
            style={{
              height: 'clamp(26px, 2.2vw, 36px)',
              width: 'auto',
              filter: overDark ? 'brightness(0) invert(1)' : 'brightness(0)',
              opacity: smallLogoOpacity,
            }}
          />
        </a>

        {/* Nav */}
        <motion.nav
          className="hidden md:flex items-center gap-8 pointer-events-auto"
          style={{ opacity: navOpacity, x: navX }}
        >
          {navLinks.map((l) => (
            <a key={l.label} href={l.href} onClick={l.onClick ? (e) => { e.preventDefault(); l.onClick!(); } : undefined} className={`eyebrow transition-colors hover:opacity-60 ${textColor}`}>
              {l.label}
            </a>
          ))}
        </motion.nav>

        {/* Book button */}
        <motion.div className="hidden md:flex justify-end pointer-events-auto" style={{ opacity: bookOpacity }}>
          <Button onClick={openBooking} variant={overDark ? 'ghost-light' : 'primary'} className="!py-2 !px-5 !min-h-0">
            Book
          </Button>
        </motion.div>

        <button
          className={`md:hidden p-2 pointer-events-auto ${textColor}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* View gallery — glass pill */}
      <motion.a
        href="#"
        onClick={(e) => { e.preventDefault(); openGallery(); }}
        className="hidden md:flex items-center eyebrow text-linen/90 hover:text-linen transition-colors pointer-events-auto"
        style={{
          opacity: galleryOpacity,
          position: 'absolute',
          right: 40,
          top: '50%',
          transform: 'translateY(-50%)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          background: 'rgba(255,255,255,0.10)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderRadius: '999px',
          padding: '8px 20px',
          textDecoration: 'none',
        }}
      >
        View gallery
      </motion.a>

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop — dims the page, tap outside closes */}
            <motion.div
              className="md:hidden fixed inset-0 pointer-events-auto"
              style={{ zIndex: 1, background: 'rgba(10,12,10,0.55)', backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMenuOpen(false)}
            />

            {/* Menu card — modal-style rounded panel unfolding from the burger */}
            <motion.div
              className="md:hidden pointer-events-auto relative flex flex-col"
              style={{
                zIndex: 2,
                margin: '6px 12px 0',
                borderRadius: 22,
                background: 'rgba(26,31,27,0.97)',
                border: '1px solid rgba(231,222,199,0.12)',
                boxShadow: '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)',
                padding: '10px 24px 24px',
                transformOrigin: 'top right',
                overflow: 'hidden',
              }}
              initial="closed"
              animate="open"
              exit="closed"
              variants={{
                open: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.34, ease: [0.22, 1, 0.36, 1], when: 'beforeChildren', staggerChildren: 0.055 } },
                closed: { opacity: 0, scale: 0.94, y: -12, transition: { duration: 0.2, ease: 'easeIn' } },
              }}
            >
              {navLinks.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  className="eyebrow-lg text-linen/80 hover:text-linen"
                  style={{ padding: '16px 0', borderBottom: i < navLinks.length - 1 ? '1px solid rgba(231,222,199,0.08)' : 'none' }}
                  variants={{
                    open: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
                    closed: { opacity: 0, y: 10 },
                  }}
                  onClick={(e) => { if (l.onClick) { e.preventDefault(); l.onClick(); } setMenuOpen(false); }}
                >
                  {l.label}
                </motion.a>
              ))}
              <motion.div
                variants={{
                  open: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] } },
                  closed: { opacity: 0, y: 10 },
                }}
              >
                <Button onClick={() => { setMenuOpen(false); openBooking(); }} variant="primary" className="self-start mt-5">Book a Stay</Button>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
    </>
  );
}
