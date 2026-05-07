import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import RevealOnScroll from '../primitives/RevealOnScroll';

interface GalleryImage {
  src: string;
  alt: string;
  aspect: string;
}

// Desktop 4×2 grid — same total height (720px), 2 tall rows: [colStart, rowStart, colSpan, rowSpan]
const CELLS: [number, number, number, number][] = [
  [1, 1, 1, 2], // tall — left column
  [2, 1, 2, 1], // wide — center top
  [4, 1, 1, 1], // small — top-right
  [2, 2, 1, 1], // small — center-bottom
  [3, 2, 2, 1], // wide — right bottom
];
const INTERVALS = [9500, 7800, 11200, 8600, 10400];

// Mobile 2×3 grid
const MOBILE_CELLS: [number, number, number, number][] = [
  [1, 1, 2, 1], // wide — top
  [1, 2, 1, 2], // tall — left
  [2, 2, 1, 1],
  [2, 3, 1, 1],
];
const MOBILE_INTERVALS = [9000, 11000, 8000, 10500];

// ── Single auto-cycling tile ─────────────────────────────────────────────────

function OrigamiCell({
  images, colStart, rowStart, colSpan, rowSpan, interval, initialIndex, onOpen,
}: {
  images: GalleryImage[];
  colStart: number; rowStart: number; colSpan: number; rowSpan: number;
  interval: number; initialIndex: number;
  onOpen: (index: number) => void;
}) {
  const [idx, setIdx] = useState(initialIndex % images.length);

  useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % images.length), interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <button
      className="relative overflow-hidden rounded-xl focus-visible:ring-2 focus-visible:ring-signal outline-none group"
      style={{ gridColumn: `${colStart} / span ${colSpan}`, gridRow: `${rowStart} / span ${rowSpan}` }}
      onClick={() => onOpen(idx)}
      aria-label={`Open photo: ${images[idx].alt}`}
    >
      <AnimatePresence mode="sync">
        <motion.img
          key={idx}
          src={images[idx].src}
          alt={images[idx].alt}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
          loading="lazy"
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-night/0 group-hover:bg-night/25 transition-colors duration-400 z-10" />
    </button>
  );
}

// ── Fullscreen lightbox ──────────────────────────────────────────────────────

function Lightbox({ images, startIndex, onClose }: {
  images: GalleryImage[]; startIndex: number; onClose: () => void;
}) {
  const [idx, setIdx] = useState(startIndex);
  const count = images.length;

  const prev = useCallback(() => setIdx((i) => (i > 0 ? i - 1 : count - 1)), [count]);
  const next = useCallback(() => setIdx((i) => (i < count - 1 ? i + 1 : 0)), [count]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [prev, next, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex flex-col"
      style={{ background: 'rgba(15,12,8,0.97)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      onClick={onClose}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0" onClick={(e) => e.stopPropagation()}>
        <p className="font-eyebrow text-[10px] uppercase tracking-[0.22em] text-linen/35">
          {idx + 1} / {count}
        </p>
        <button onClick={onClose} className="text-linen/30 hover:text-linen/70 transition-colors">
          <X size={18} strokeWidth={1.5} />
        </button>
      </div>

      {/* Photo */}
      <div
        className="flex-1 relative flex items-center justify-center px-14 min-h-0"
        onClick={(e) => e.stopPropagation()}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={idx}
            src={images[idx].src}
            alt={images[idx].alt}
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: 'calc(100vh - 176px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
        </AnimatePresence>

        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-linen"
          style={{ background: 'rgba(15,12,8,0.72)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center text-linen"
          style={{ background: 'rgba(15,12,8,0.72)', border: '1px solid rgba(255,255,255,0.12)' }}
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Thumbnail strip */}
      <div
        className="flex gap-2 px-4 py-3 shrink-0 overflow-x-auto scrollbar-none justify-center"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setIdx(i)}
            className="shrink-0 rounded-md overflow-hidden transition-opacity"
            style={{
              width: 64, height: 44,
              border: `2px solid ${i === idx ? '#B05329' : 'transparent'}`,
              opacity: i === idx ? 1 : 0.38,
            }}
          >
            <img src={img.src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────

export default function GalleryMasonry({ images }: { images: GalleryImage[] }) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  return (
    <section id="gallery" className="bg-bone py-24 md:py-32 px-6">
      <div className="max-w-content mx-auto">
        <RevealOnScroll>
          <p className="eyebrow-lg text-ink2 mb-4" style={{ fontSize: '16px' }}>Gallery</p>
          <h3
            className="font-display font-light text-ink text-[clamp(28px,4vw,48px)] mb-12"
            style={{ fontVariationSettings: '"SOFT" 30, "opsz" 72', letterSpacing: '-0.02em' }}
          >
            See the land.
          </h3>
        </RevealOnScroll>

        {/* Desktop: Origami mosaic grid — 4 cols × 2 rows */}
        <div
          className="hidden sm:grid gap-2"
          style={{
            gridTemplateColumns: 'repeat(4, 1fr)',
            gridAutoRows: '360px',
          }}
        >
          {CELLS.map(([col, row, colSpan, rowSpan], i) => (
            <OrigamiCell
              key={i}
              images={images}
              colStart={col} rowStart={row} colSpan={colSpan} rowSpan={rowSpan}
              interval={INTERVALS[i]}
              initialIndex={i * 3}
              onOpen={setLightboxIdx}
            />
          ))}
        </div>

        {/* Mobile: 2-column mosaic */}
        <div
          className="sm:hidden grid gap-2"
          style={{
            gridTemplateColumns: 'repeat(2, 1fr)',
            gridAutoRows: '220px',
          }}
        >
          {MOBILE_CELLS.map(([col, row, colSpan, rowSpan], i) => (
            <OrigamiCell
              key={i}
              images={images}
              colStart={col} rowStart={row} colSpan={colSpan} rowSpan={rowSpan}
              interval={MOBILE_INTERVALS[i]}
              initialIndex={i * 4}
              onOpen={setLightboxIdx}
            />
          ))}
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {lightboxIdx !== null && (
            <Lightbox
              images={images}
              startIndex={lightboxIdx}
              onClose={() => setLightboxIdx(null)}
            />
          )}
        </AnimatePresence>,
        document.body
      )}
    </section>
  );
}
