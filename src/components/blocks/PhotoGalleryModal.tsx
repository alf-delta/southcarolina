import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  photos: string[];
  onClose: () => void;
}

// Flat photo gallery — no categories. Grid on open (like a phone photo app);
// tap a photo to enlarge it, arrows page through the whole set.
export default function PhotoGalleryModal({ photos, onClose }: Props) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const prev = useCallback(() => setActiveIdx((i) => (i === null ? null : (i > 0 ? i - 1 : photos.length - 1))), [photos.length]);
  const next = useCallback(() => setActiveIdx((i) => (i === null ? null : (i < photos.length - 1 ? i + 1 : 0))), [photos.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (activeIdx === null) {
        if (e.key === 'Escape') onClose();
        return;
      }
      if (e.key === 'ArrowLeft') prev();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'Escape') setActiveIdx(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [activeIdx, prev, next, onClose]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      <div
        className="absolute inset-0 bg-night/90 backdrop-blur-md"
        onClick={activeIdx === null ? onClose : undefined}
      />

      <motion.div
        className="relative z-10 w-full h-full flex flex-col"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close — exits the lightbox back to the grid, or the whole gallery from the grid */}
        <button
          onClick={() => (activeIdx === null ? onClose() : setActiveIdx(null))}
          aria-label="Close"
          className="absolute top-4 right-4 md:top-6 md:right-6 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-linen/10 hover:bg-linen/20 text-linen/70 hover:text-linen transition-all"
        >
          <X size={18} strokeWidth={1.8} />
        </button>

        {activeIdx === null ? (
          // ── Grid — every photo, no categories ──
          <div className="flex-1 overflow-y-auto" style={{ padding: 'clamp(20px, 5vw, 56px)' }}>
            <p className="font-eyebrow uppercase text-linen/45" style={{ fontSize: 11, letterSpacing: '0.22em', marginBottom: 'clamp(16px, 2.4vh, 28px)' }}>
              Gallery · {photos.length} photos
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-7" style={{ gap: 'clamp(5px, 0.8vw, 10px)' }}>
              {photos.map((src, i) => (
                <button
                  key={`${src}-${i}`}
                  onClick={() => setActiveIdx(i)}
                  className="relative overflow-hidden rounded-lg group"
                  style={{ aspectRatio: '1 / 1' }}
                >
                  <img src={src} alt="" loading="lazy" className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105" />
                  <div className="absolute inset-0 ring-1 ring-inset ring-linen/0 group-hover:ring-linen/25 transition-all duration-300" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          // ── Lightbox — enlarged photo, arrows page through the flat set ──
          // minHeight/minWidth: 0 override the flex default of `auto`, which otherwise
          // stops this box from shrinking below the image's natural size — the bug that
          // let large-dimension photos push past the viewport instead of being capped.
          <div className="flex-1 relative flex items-center justify-center" style={{ padding: 'clamp(16px, 4vw, 48px)', minHeight: 0, minWidth: 0 }}>
            <AnimatePresence mode="wait">
              <motion.img
                key={activeIdx}
                src={photos[activeIdx]}
                alt=""
                style={{ maxWidth: '100%', maxHeight: '100%', width: 'auto', height: 'auto', objectFit: 'contain' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>

            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full text-linen transition-colors"
              style={{ background: 'rgba(15,12,8,0.6)', border: '1px solid rgba(255,255,255,0.14)' }}
            >
              <ChevronLeft size={20} strokeWidth={1.6} />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 flex items-center justify-center w-11 h-11 rounded-full text-linen transition-colors"
              style={{ background: 'rgba(15,12,8,0.6)', border: '1px solid rgba(255,255,255,0.14)' }}
            >
              <ChevronRight size={20} strokeWidth={1.6} />
            </button>

            <span className="absolute bottom-4 md:bottom-6 font-eyebrow text-linen/50" style={{ fontSize: 11, letterSpacing: '0.2em' }}>
              {activeIdx + 1} / {photos.length}
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
