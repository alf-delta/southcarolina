import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import Button from '../primitives/Button';

const navLinks = [
  { label: 'The Land', href: '#land' },
  { label: 'Stays', href: '#stays' },
  { label: 'A Day', href: '#day' },
  { label: 'Why We', href: '#table' },
  { label: 'Gallery', href: '#gallery' },
];

export default function StickyHeader() {
  const [overDark, setOverDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightBg, setLightBg] = useState('#F2EDE3');

  useEffect(() => {
    const handler = () => {
      const Y = 80;
      let isDark = false;
      let detectedBg = '#F2EDE3';
      document.querySelectorAll('[data-zone="dark"]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < Y && rect.bottom > Y) isDark = true;
      });
      document.querySelectorAll('[data-zone="light"]').forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < Y && rect.bottom > Y) {
          isDark = false;
          const bg = (el as HTMLElement).dataset.bg;
          if (bg) detectedBg = bg;
        }
      });
      setOverDark(isDark);
      setLightBg(detectedBg);
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const headerBg = overDark
    ? scrolled ? 'bg-night/40 backdrop-blur-md' : 'bg-transparent'
    : '';

  const textColor = overDark ? 'text-linen/90' : 'text-ink';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[200] transition-all duration-500 pb-10 ${headerBg}`}
      style={{
        WebkitMaskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        maskImage: 'linear-gradient(to bottom, black 50%, transparent 100%)',
        backgroundColor: overDark ? undefined : lightBg,
        boxShadow: overDark ? 'none' : '0 1px 0 rgba(0,0,0,0.06)',
      }}
    >
      <div className="max-w-content mx-auto px-6 md:px-10 h-16 flex items-center justify-between md:grid md:grid-cols-[1fr_auto_1fr]">
        <a href="#" className="flex items-center">
          <img
            src="/logo.svg"
            alt="Horizons Sandhills"
            className="h-8 w-auto"
            style={{ filter: overDark ? 'brightness(0) invert(1)' : 'brightness(0)' }}
          />
        </a>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className={`eyebrow transition-colors hover:opacity-60 ${textColor}`}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex justify-end">
          <Button href="#reserve" variant={overDark ? 'ghost-light' : 'primary'} className="!py-2 !px-5 !min-h-0">
            Book
          </Button>
        </div>

        <button
          className={`md:hidden p-2 ${textColor}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-night/95 backdrop-blur-md px-6 pb-8 pt-4 flex flex-col gap-6">
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="eyebrow-lg text-linen/80 hover:text-linen"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Button href="#reserve" variant="primary" className="self-start mt-2">Book a Stay</Button>
        </div>
      )}
    </header>
  );
}
