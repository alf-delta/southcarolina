import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Room { name: string; photos: string[] }

interface Props {
  rooms: Room[];
  startIndex: number;
  onClose: () => void;
}

export default function GalleryModal({ rooms, startIndex, onClose }: Props) {
  // Derive initial room + photo from flat startIndex
  let counter = 0;
  const roomStarts = rooms.map((r) => { const s = counter; counter += r.photos.length; return s; });
  const initRoom  = Math.max(0, roomStarts.findLastIndex((s) => startIndex >= s));
  const initPhoto = startIndex - roomStarts[initRoom];

  const [activeRoom,  setActiveRoom]  = useState(initRoom);
  const [activePhoto, setActivePhoto] = useState(Math.max(0, initPhoto));

  const room       = rooms[activeRoom];
  const photoCount = room.photos.length;

  const prev = useCallback(() => setActivePhoto((i) => (i > 0 ? i - 1 : photoCount - 1)), [photoCount]);
  const next = useCallback(() => setActivePhoto((i) => (i < photoCount - 1 ? i + 1 : 0)), [photoCount]);

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

  const selectRoom = (i: number) => { setActiveRoom(i); setActivePhoto(0); };

  return (
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-night/80 backdrop-blur-md"
        onClick={onClose}
      />

      {/* Mac-window card */}
      <motion.div
        className="relative z-10 flex flex-col overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          background: '#171410',
          borderRadius: 14,
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.06) inset',
        }}
        initial={{ opacity: 0, scale: 0.94, y: 24 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{    opacity: 0, scale: 0.94, y: 24  }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Title bar ── */}
        <div
          className="flex items-center gap-3 px-4 shrink-0"
          style={{
            height: 44,
            borderBottom: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          {/* Traffic lights */}
          <div className="flex items-center gap-[7px]">
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-3 h-3 rounded-full transition-opacity hover:opacity-80"
              style={{ background: '#FF5F57' }}
            />
            <span className="w-3 h-3 rounded-full" style={{ background: '#FFBD2E' }} />
            <span className="w-3 h-3 rounded-full" style={{ background: '#28C840' }} />
          </div>

          {/* Title */}
          <p className="font-eyebrow text-[10px] uppercase tracking-[0.22em] text-linen/35 mx-auto">
            {room.name} · {activePhoto + 1} / {photoCount}
          </p>

          {/* X button */}
          <button
            onClick={onClose}
            className="text-linen/30 hover:text-linen/70 transition-colors"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {/* ── Body: sidebar + photo ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar — desktop only */}
          <div
            className="hidden md:flex w-[200px] shrink-0 flex-col pt-3 pb-4 px-2 gap-[2px]"
            style={{ borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
          >
            <p
              className="font-eyebrow uppercase px-3 pb-2 pt-1"
              style={{ fontSize: '9px', letterSpacing: '0.2em', color: 'rgba(231,222,199,0.28)' }}
            >
              Rooms
            </p>
            {rooms.map((r, i) => (
              <button
                key={r.name}
                onClick={() => selectRoom(i)}
                className={`flex items-center justify-between w-full px-3 py-[7px] rounded-[8px] text-left transition-colors ${
                  activeRoom === i
                    ? 'text-linen'
                    : 'text-linen/40 hover:text-linen/70 hover:bg-white/5'
                }`}
                style={activeRoom === i ? { background: 'rgba(176,83,41,0.22)' } : undefined}
              >
                <span className="font-eyebrow text-[10px] uppercase tracking-[0.18em]">{r.name}</span>
                <span
                  className="font-eyebrow"
                  style={{ fontSize: '9px', color: 'rgba(231,222,199,0.28)' }}
                >
                  {r.photos.length}
                </span>
              </button>
            ))}
          </div>

          {/* Photo area */}
          <div className="flex-1 flex flex-col overflow-hidden">

            {/* Mobile room tabs */}
            <div
              className="md:hidden flex overflow-x-auto scrollbar-none shrink-0"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              {rooms.map((r, i) => (
                <button
                  key={r.name}
                  onClick={() => selectRoom(i)}
                  className={`px-4 py-2 font-eyebrow text-[10px] uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors ${
                    activeRoom === i ? 'text-linen border-signal' : 'text-linen/35 border-transparent'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>

            {/* Main photo */}
            <div className="flex-1 relative overflow-hidden" style={{ background: '#0e0c0a' }}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${activeRoom}-${activePhoto}`}
                  src={room.photos[activePhoto]}
                  alt=""
                  className="absolute inset-0 w-full h-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18 }}
                />
              </AnimatePresence>

              {/* Prev / Next */}
              {photoCount > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-linen transition-colors"
                    style={{ background: 'rgba(15,12,8,0.72)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <ChevronLeft size={18} strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-linen transition-colors"
                    style={{ background: 'rgba(15,12,8,0.72)', border: '1px solid rgba(255,255,255,0.12)' }}
                  >
                    <ChevronRight size={18} strokeWidth={1.5} />
                  </button>
                </>
              )}
            </div>

            {/* Filmstrip */}
            {photoCount > 1 && (
              <div
                className="flex gap-2 px-3 py-2 shrink-0 overflow-x-auto scrollbar-none"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
              >
                {room.photos.map((src, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhoto(i)}
                    className="shrink-0 rounded-md overflow-hidden transition-opacity"
                    style={{
                      width: 72,
                      height: 48,
                      border: `2px solid ${i === activePhoto ? '#B05329' : 'transparent'}`,
                      opacity: i === activePhoto ? 1 : 0.38,
                    }}
                  >
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
