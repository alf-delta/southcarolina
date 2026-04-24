import { useParams } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, X, ChevronLeft, ChevronRight, Users, BedDouble, Bath, Wifi, Flame, Waves, TreePine, Coffee, Star } from 'lucide-react';
import { sandhillsData } from '../components/data/sandhills';
import Button from '../components/primitives/Button';

type StayData = typeof sandhillsData.stays[0] & {
  slug: string;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  gallery: string[];
  rooms: { name: string; photos: string[] }[];
};

const amenityIcons: Record<string, React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>> = {
  'Sauna sessions': Flame,
  'Canoes & paddleboards': Waves,
  'Morning coffee kit': Coffee,
  'Outdoor firepit': Flame,
  'Twelve miles of trail': TreePine,
  'Stargazing chairs': Star,
  'Welcome pantry box': Coffee,
  'Pine-needle bath salts': Star,
  'Linens & towels': BedDouble,
  'On-call concierge': Star,
  'Wi-Fi in The House': Wifi,
  'Bluetooth speaker': Star,
};

function GalleryModal({
  rooms,
  startIndex,
  onClose,
}: {
  rooms: { name: string; photos: string[] }[];
  startIndex: number;
  onClose: () => void;
}) {
  const allPhotos = rooms.flatMap((r) => r.photos.map((p) => ({ src: p, room: r.name })));
  const [current, setCurrent] = useState(startIndex);
  const roomRefs = useRef<(HTMLDivElement | null)[]>([]);

  const prev = useCallback(() => setCurrent((i) => (i > 0 ? i - 1 : allPhotos.length - 1)), [allPhotos.length]);
  const next = useCallback(() => setCurrent((i) => (i < allPhotos.length - 1 ? i + 1 : 0)), [allPhotos.length]);

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

  const scrollToRoom = (roomIdx: number) => {
    roomRefs.current[roomIdx]?.scrollIntoView({ behavior: 'smooth' });
  };

  // figure out which room is active based on current photo
  let photoCounter = 0;
  const roomStartIndices = rooms.map((r) => {
    const idx = photoCounter;
    photoCounter += r.photos.length;
    return idx;
  });
  const activeRoom = roomStartIndices.findLastIndex((start) => current >= start);

  return (
    <div className="fixed inset-0 z-[100] bg-night flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 md:px-8 h-14 shrink-0 border-b border-white/10">
        <button onClick={onClose} className="flex items-center gap-2 text-linen/70 hover:text-linen transition-colors">
          <X size={20} strokeWidth={1.5} />
        </button>
        <p className="font-eyebrow text-xs text-linen/50 uppercase tracking-widest">
          {current + 1} / {allPhotos.length}
        </p>
        <div className="w-8" />
      </div>

      {/* Room tabs */}
      <div className="flex gap-0 overflow-x-auto scrollbar-none shrink-0 border-b border-white/10">
        {rooms.map((room, i) => (
          <button
            key={room.name}
            onClick={() => { scrollToRoom(i); setCurrent(roomStartIndices[i]); }}
            className={`px-5 py-3 font-eyebrow text-xs uppercase tracking-widest whitespace-nowrap transition-colors border-b-2 ${
              activeRoom === i
                ? 'text-linen border-signal'
                : 'text-linen/40 border-transparent hover:text-linen/70'
            }`}
          >
            {room.name}
          </button>
        ))}
      </div>

      {/* Desktop: big photo + prev/next */}
      <div className="hidden md:flex flex-1 items-center justify-center relative overflow-hidden">
        <button
          onClick={prev}
          className="absolute left-6 z-10 w-10 h-10 rounded-full bg-night/80 border border-white/20 flex items-center justify-center text-linen hover:bg-night transition-colors"
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </button>
        <img
          key={current}
          src={allPhotos[current].src}
          alt=""
          className="max-h-full max-w-full object-contain"
        />
        <button
          onClick={next}
          className="absolute right-6 z-10 w-10 h-10 rounded-full bg-night/80 border border-white/20 flex items-center justify-center text-linen hover:bg-night transition-colors"
        >
          <ChevronRight size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* Mobile: scrollable room sections */}
      <div className="md:hidden flex-1 overflow-y-auto">
        {rooms.map((room, ri) => (
          <div key={room.name} ref={(el) => { roomRefs.current[ri] = el; }}>
            <p className="px-4 pt-6 pb-3 font-eyebrow text-xs text-linen/40 uppercase tracking-widest">{room.name}</p>
            <div className="flex flex-col gap-1">
              {room.photos.map((src, pi) => {
                const globalIdx = roomStartIndices[ri] + pi;
                return (
                  <img
                    key={src}
                    src={src}
                    alt=""
                    className={`w-full object-cover cursor-pointer transition-opacity ${current === globalIdx ? 'opacity-100' : 'opacity-80'}`}
                    style={{ maxHeight: '70vw' }}
                    onClick={() => setCurrent(globalIdx)}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Mobile: thumbnail strip at bottom */}
      <div className="md:hidden flex gap-2 overflow-x-auto px-4 py-3 shrink-0 border-t border-white/10 scrollbar-none">
        {allPhotos.map((p, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`shrink-0 w-14 h-14 rounded overflow-hidden border-2 transition-colors ${
              current === i ? 'border-signal' : 'border-transparent opacity-50'
            }`}
          >
            <img src={p.src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export default function StayDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryStart, setGalleryStart] = useState(0);
  const [activeThumb, setActiveThumb] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const stay = (sandhillsData.stays as StayData[]).find((s) => s.slug === slug);

  if (!stay) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <p className="font-eyebrow text-ink2">Stay not found.</p>
      </div>
    );
  }

  const allPhotos = stay.rooms.flatMap((r) => r.photos);
  const openGallery = (idx: number) => { setGalleryStart(idx); setGalleryOpen(true); };

  return (
    <div className="min-h-screen bg-bone">
      {galleryOpen && (
        <GalleryModal
          rooms={stay.rooms}
          startIndex={galleryStart}
          onClose={() => setGalleryOpen(false)}
        />
      )}

      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-nightWarm border-b border-white/10">
        <div className="max-w-content mx-auto px-4 md:px-8 h-14 flex items-center">
          <button
            onClick={() => { window.location.href = '/#stays'; }}
            className="flex items-center gap-2 text-linen/80 hover:text-linen transition-colors font-eyebrow text-sm uppercase tracking-widest"
          >
            <ArrowLeft size={16} strokeWidth={1.8} />
            Back
          </button>
        </div>
      </div>

      <div className="max-w-content mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Title */}
        <div className="mb-6">
          <p className="font-eyebrow text-ink2/60 text-xs uppercase tracking-widest mb-2">{stay.tier}</p>
          <h1
            className="font-display font-light text-ink text-[clamp(32px,5vw,64px)]"
            style={{ letterSpacing: '-0.025em', fontVariationSettings: '"SOFT" 40, "opsz" 72' }}
          >
            {stay.name}
          </h1>
        </div>

        {/* Desktop photo grid */}
        <div className="hidden md:grid grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-10 h-[480px]">
          <div className="col-span-2 row-span-2 cursor-pointer" onClick={() => openGallery(0)}>
            <img src={stay.gallery[0]} alt={stay.name} className="w-full h-full object-cover hover:brightness-90 transition-all" />
          </div>
          {stay.gallery.slice(1, 5).map((src, i) => (
            <div key={i} className="overflow-hidden cursor-pointer" onClick={() => openGallery(i + 1)}>
              <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 hover:brightness-90 transition-all duration-500" />
            </div>
          ))}
        </div>

        {/* Mobile photo: main + thumbnails */}
        <div className="md:hidden mb-6">
          <div
            className="w-full rounded-xl overflow-hidden cursor-pointer mb-3"
            style={{ aspectRatio: '4/3' }}
            onClick={() => openGallery(activeThumb)}
          >
            <img
              src={allPhotos[activeThumb]}
              alt={stay.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {allPhotos.map((src, i) => (
              <button
                key={i}
                onClick={() => setActiveThumb(i)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  activeThumb === i ? 'border-signal' : 'border-transparent opacity-60'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
            </button>
            ))}
          </div>
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-[1fr_360px] gap-12 xl:gap-20">
          {/* Left: details */}
          <div>
            <div className="flex flex-wrap gap-6 py-6 border-t border-b border-divider mb-8">
              {[
                { icon: Users, label: `${stay.guests} guests` },
                { icon: BedDouble, label: `${stay.bedrooms} bedroom${stay.bedrooms > 1 ? 's' : ''}` },
                { icon: BedDouble, label: `${stay.beds} bed${stay.beds > 1 ? 's' : ''}` },
                { icon: Bath, label: `${stay.baths} bath${stay.baths > 1 ? 's' : ''}` },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-ink2">
                  <Icon size={18} strokeWidth={1.4} className="text-signal" />
                  <span className="font-eyebrow text-sm">{label}</span>
                </div>
              ))}
            </div>

            <p
              className="font-display font-light text-ink text-[clamp(17px,1.6vw,20px)] leading-relaxed mb-10"
              style={{ fontVariationSettings: '"SOFT" 20, "opsz" 18' }}
            >
              {stay.description}
            </p>

            <div className="border-t border-divider pt-8">
              <h2
                className="font-display font-light text-ink text-[clamp(22px,2.5vw,32px)] mb-6"
                style={{ letterSpacing: '-0.02em', fontVariationSettings: '"SOFT" 30, "opsz" 32' }}
              >
                What's included
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {sandhillsData.included.map((item) => {
                  const Icon = amenityIcons[item.title] ?? Star;
                  return (
                    <div key={item.n} className="flex items-start gap-3">
                      <Icon size={20} strokeWidth={1.4} className="text-signal mt-0.5 shrink-0" />
                      <div>
                        <p className="font-eyebrow text-sm text-ink">{item.title}</p>
                        <p className="font-eyebrow text-xs text-ink2/60 mt-0.5">{item.note}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-divider mt-10 pt-8">
              <p className="font-eyebrow text-sm text-ink2 uppercase tracking-widest">{stay.sleeps}</p>
            </div>
          </div>

          {/* Right: booking card */}
          <div>
            <div className="sticky top-24 bg-white rounded-2xl border border-divider shadow-md p-6 md:p-8">
              <div className="flex items-baseline gap-1 mb-6">
                <span
                  className="font-display font-light text-ink text-[clamp(28px,3vw,40px)]"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  ${stay.priceFrom}
                </span>
                <span className="font-eyebrow text-sm text-ink2">/ night</span>
              </div>

              <div className="grid grid-cols-2 border border-divider rounded-xl overflow-hidden mb-3">
                <div className="p-3 border-r border-divider">
                  <p className="font-eyebrow text-xs text-ink2 uppercase tracking-widest mb-1">Check-in</p>
                  <p className="font-eyebrow text-sm text-ink">Add date</p>
                </div>
                <div className="p-3">
                  <p className="font-eyebrow text-xs text-ink2 uppercase tracking-widest mb-1">Checkout</p>
                  <p className="font-eyebrow text-sm text-ink">Add date</p>
                </div>
              </div>

              <div className="border border-divider rounded-xl p-3 mb-4">
                <p className="font-eyebrow text-xs text-ink2 uppercase tracking-widest mb-1">Guests</p>
                <p className="font-eyebrow text-sm text-ink">1 guest</p>
              </div>

              <Button href="#reserve" variant="primary" className="w-full justify-center text-center">
                Reserve
              </Button>

              <p className="font-eyebrow text-xs text-ink2/60 text-center mt-4">2-night minimum · Free cancellation 14 days out</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
