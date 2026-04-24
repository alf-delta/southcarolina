import { useParams } from 'react-router-dom';
import { ArrowLeft, Users, BedDouble, Bath, Wifi, Flame, Waves, TreePine, Coffee, Star } from 'lucide-react';
import { sandhillsData } from '../components/data/sandhills';
import Button from '../components/primitives/Button';

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

  const stay = (sandhillsData.stays as typeof sandhillsData.stays & { slug: string }[]).find(
    (s) => (s as unknown as { slug: string }).slug === slug
  ) as (typeof sandhillsData.stays[0] & { slug: string; guests: number; bedrooms: number; beds: number; baths: number; gallery: string[] }) | undefined;

  if (!stay) {
    return (
      <div className="min-h-screen bg-bone flex items-center justify-center">
        <p className="font-eyebrow text-ink2">Stay not found.</p>
      </div>
    );
  }

  const [hero, ...thumbs] = stay.gallery;

  return (
    <div className="min-h-screen bg-bone">
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

        {/* Photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 rounded-2xl overflow-hidden mb-10 h-[320px] md:h-[480px]">
          {/* Big photo */}
          <div className="col-span-2 row-span-2">
            <img src={hero} alt={stay.name} className="w-full h-full object-cover" />
          </div>
          {/* 4 thumbnails */}
          {thumbs.slice(0, 4).map((src, i) => (
            <div key={i} className="overflow-hidden">
              <img src={src} alt="" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          ))}
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-[1fr_360px] gap-12 xl:gap-20">
          {/* Left: details */}
          <div>
            {/* Quick stats */}
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

            {/* Description */}
            <p
              className="font-display font-light text-ink text-[clamp(17px,1.6vw,20px)] leading-relaxed mb-10"
              style={{ fontVariationSettings: '"SOFT" 20, "opsz" 18' }}
            >
              {stay.description}
            </p>

            {/* Amenities */}
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

            {/* Sleeps detail */}
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
