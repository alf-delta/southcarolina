import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { ArrowLeft, BedDouble, Bath, Wifi, Flame, Waves, TreePine, Coffee, Star, Box, Users } from 'lucide-react';
import { sandhillsData, CLOUDBEDS_PROPERTY_ID } from '../components/data/sandhills';
import BookingWidget from '../components/primitives/BookingWidget';
import { StayBreadcrumb } from '../components/StructuredData';
import GalleryModal from '../components/blocks/GalleryModal';

type StayData = typeof sandhillsData.stays[0] & {
  slug: string;
  cloudbedsRoomTypeId?: string;
  guests: number;
  bedrooms: number;
  beds: number;
  baths: number;
  gallery: string[];
  rooms: { name: string; photos: string[] }[];
  tour3d?: string;
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
      <StayBreadcrumb name={stay.name} slug={stay.slug} />
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

        {/* Desktop photo grid: big left + 2×2 right */}
        <div className="hidden md:flex gap-2 rounded-2xl overflow-hidden mb-10 h-[480px]">
          <div className="w-1/2 shrink-0 cursor-pointer overflow-hidden" onClick={() => openGallery(0)}>
            <img src={stay.gallery[0]} alt={stay.name} className="w-full h-full object-cover hover:brightness-90 transition-all" />
          </div>
          <div className="w-1/2 grid grid-cols-2 gap-2">
            {stay.gallery.slice(1, 5).map((src, i) => (
              <div key={i} className="overflow-hidden cursor-pointer" onClick={() => openGallery(i + 1)}>
                <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 hover:brightness-90 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Mobile photo: main + thumbnails */}
        <div className="md:hidden mb-4">
          <div
            className="w-full rounded-xl overflow-hidden cursor-pointer mb-3"
            style={{ aspectRatio: '4/3' }}
            onClick={() => openGallery(activeThumb)}
          >
            <img src={allPhotos[activeThumb]} alt={stay.name} className="w-full h-full object-cover" />
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

        {/* Mobile 3D button */}
        {stay.tour3d && (
          <div className="md:hidden flex justify-end mb-6">
            <a
              href={stay.tour3d}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-signal hover:bg-signal2 text-linen transition-colors rounded-full px-6 py-3 font-eyebrow text-xs uppercase tracking-widest"
            >
              <Box size={16} strokeWidth={1.5} />
              3D View
            </a>
          </div>
        )}

        {/* Two-column layout */}
        <div className="grid md:grid-cols-[1fr_360px] gap-12 xl:gap-20">
          <div>
            <div className="flex flex-wrap md:flex-nowrap items-center gap-4 md:gap-5 py-6 border-t border-b border-divider mb-8">
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
              {stay.tour3d && (
                <a
                  href={stay.tour3d}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-2 bg-signal hover:bg-signal2 text-linen transition-colors rounded-full px-4 py-2 font-eyebrow text-xs uppercase tracking-widest ml-auto"
                >
                  <Box size={14} strokeWidth={1.5} />
                  3D View
                </a>
              )}
            </div>

            <p
              className="font-display font-light text-ink text-[clamp(17px,1.6vw,20px)] leading-relaxed mb-10"
              style={{ fontVariationSettings: '"SOFT" 20, "opsz" 18' }}
            >
              {stay.description}
            </p>

            {/* Mobile booking card */}
            <div className="md:hidden bg-white rounded-2xl border border-divider shadow-sm p-4 mb-8">
              <BookingWidget
                propertyId={CLOUDBEDS_PROPERTY_ID}
                roomTypeId={stay.cloudbedsRoomTypeId}
                maxGuests={stay.guests}
                priceFrom={stay.priceFrom}
              />
            </div>

            <div className="border-t border-divider pt-8">
              <h2
                className="font-display font-light text-ink text-[clamp(22px,2.5vw,32px)] mb-6"
                style={{ letterSpacing: '-0.02em', fontVariationSettings: '"SOFT" 30, "opsz" 32' }}
              >
                What's included
              </h2>
              <div className="grid grid-cols-2 gap-4">
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
              <p className="font-eyebrow text-ink2 uppercase md:whitespace-nowrap" style={{ fontSize: '11px', letterSpacing: '0.06em' }}>{stay.sleeps}</p>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="sticky top-24 bg-white rounded-2xl border border-divider shadow-md p-6 md:p-8">
              <BookingWidget
                propertyId={CLOUDBEDS_PROPERTY_ID}
                roomTypeId={stay.cloudbedsRoomTypeId}
                maxGuests={stay.guests}
                priceFrom={stay.priceFrom}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
