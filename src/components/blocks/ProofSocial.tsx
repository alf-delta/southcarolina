import { Star } from 'lucide-react';
import { useState, useRef } from 'react';
import RevealOnScroll from '../primitives/RevealOnScroll';

type ReviewSource = 'direct' | 'airbnb' | 'booking';

interface Review {
  rating: number;
  source: ReviewSource;
  quote: string;
  body: string;
  author: string;
  location: string;
  date: string;
}

interface Props {
  reviews: Review[];
  pressQuote: { quote: string; source: string };
}

const BUBBLE_BG = '#EEE8DB';

const SOURCE_CONFIG = {
  direct: {
    bubbleBg: BUBBLE_BG,
    accentColor: '#6B8A5E',
    avatarBg: '#6B8A5E',
    logo: null,
  },
  airbnb: {
    bubbleBg: BUBBLE_BG,
    accentColor: '#FF385C',
    avatarBg: '#FF385C',
    logo: 'airbnb',
  },
  booking: {
    bubbleBg: BUBBLE_BG,
    accentColor: '#003580',
    avatarBg: '#003580',
    logo: 'booking',
  },
} as const;

function AirbnbLogo() {
  return (
    <svg
      viewBox="0 0 1991.3 2143.2"
      xmlns="http://www.w3.org/2000/svg"
      style={{ height: 22, width: 'auto', display: 'block' }}
      aria-label="Airbnb"
    >
      <path d="m1851.6 1735.6c-15 111.6-90.1 208.1-195.2 251-51.5 21.4-107.3 27.9-163.1 21.4-53.6-6.4-107.3-23.6-163-55.7-77.2-43-154.5-109.4-244.6-208.1 141.6-173.8 227.4-332.5 259.6-474.1 15-66.5 17.2-126.6 10.7-182.4-8.6-53.6-27.9-103-57.9-145.9-66.5-96.5-178.1-152.3-302.5-152.3s-236 57.9-302.5 152.3c-30 42.9-49.3 92.3-57.9 145.9-8.6 55.8-6.4 118 10.7 182.4 32.2 141.6 120.1 302.5 259.6 476.2-88 98.7-167.3 165.2-244.6 208.1-55.8 32.2-109.4 49.4-163 55.8-55.3 6.2-111.2-1.2-163-21.4-105.1-42.9-180.2-139.5-195.2-251-6.4-53.6-2.1-107.2 19.3-167.3 6.4-21.5 17.2-42.9 27.9-68.6 15-34.3 32.2-70.8 49.3-107.3l2.2-4.3c148-319.7 306.8-645.8 472-963.3l6.4-12.9c17.2-32.1 34.3-66.5 51.5-98.7 17.2-34.3 36.5-66.5 60.1-94.4 45.1-51.5 105.1-79.4 171.6-79.4s126.6 27.9 171.6 79.4c23.6 27.9 42.9 60.1 60.1 94.4 17.2 32.2 34.3 66.5 51.5 98.6l6.5 12.9c163 319.6 321.8 645.7 469.8 965.4v2.1c17.2 34.3 32.2 73 49.3 107.3 10.7 25.8 21.5 47.2 27.9 68.6 17.1 55.9 23.5 109.5 14.9 165.3zm-856-100.9c-115.8-145.9-190.9-283.2-216.7-399-10.7-49.4-12.9-92.3-6.4-130.9 4.3-34.3 17.2-64.4 34.3-90.1 40.8-57.9 109.4-94.4 188.8-94.4s150.2 34.4 188.8 94.4c17.2 25.8 30 55.8 34.3 90.1 6.4 38.6 4.3 83.7-6.4 130.9-25.7 113.7-100.8 251-216.7 399zm967.6-111.5c-10.7-25.7-21.5-53.6-32.2-77.2-17.2-38.6-34.3-75.1-49.4-109.4l-2.1-2.1c-148-321.8-306.8-647.9-474.1-969.7l-6.4-12.9c-17.2-32.2-34.3-66.5-51.5-100.8-21.5-38.6-42.9-79.4-77.2-118-68.7-85.9-167.4-133.1-272.5-133.1-107.3 0-203.8 47.2-274.7 128.7-32.2 38.6-55.8 79.4-77.2 118-17.2 34.3-34.3 68.6-51.5 100.8l-6.4 12.8c-165.2 321.8-326.1 647.9-474.1 969.7l-2.1 4.3c-15 34.3-32.2 70.8-49.4 109.4-11.5 25.4-22.2 51.2-32.2 77.2-27.9 79.4-36.5 154.5-25.8 231.7 23.6 160.9 130.9 296.1 278.9 356.1 55.8 23.6 113.7 34.3 173.8 34.3 17.2 0 38.6-2.1 55.8-4.3 70.8-8.6 143.7-32.1 214.5-72.9 88-49.3 171.6-120.1 266-223.1 94.4 103 180.2 173.8 266 223.1 70.8 40.8 143.7 64.3 214.5 72.9 17.2 2.2 38.6 4.3 55.8 4.3 60.1 0 120.1-10.7 173.8-34.3 150.2-60.1 255.3-197.4 278.9-356.1 17.2-75 8.6-150-19.2-229.4z" fill="#e0565b" />
    </svg>
  );
}

function BookingLogo() {
  return (
    <img
      src="/images/booking_logo.webp"
      alt="Booking.com"
      style={{ height: 18, width: 'auto', display: 'block' }}
    />
  );
}

function VerifiedSeal({ color }: { color: string }) {
  return (
    <div
      style={{
        position: 'absolute',
        top: 18,
        right: 18,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      <span
        style={{
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
          color,
          opacity: 0.7,
          lineHeight: 1.3,
          textAlign: 'right',
          maxWidth: 52,
        }}
      >
        Verified guest
      </span>
      <svg width="34" height="34" viewBox="0 0 38 38" fill="none" aria-label="Verified guest" style={{ flexShrink: 0 }}>
        <circle cx="19" cy="19" r="18" stroke={color} strokeWidth="1.2" strokeOpacity="0.35" />
        <circle cx="19" cy="19" r="14.5" stroke={color} strokeWidth="0.8" strokeOpacity="0.2" />
        <circle cx="19" cy="19" r="11" fill={color} fillOpacity="0.1" />
        <path
          d="M14 19.5l3 3 7-7"
          stroke={color}
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function InitialsAvatar({ name, bg }: { name: string; bg: string }) {
  const initials = name.trim().split(' ').map((p) => p[0]).join('').toUpperCase().slice(0, 2);
  return (
    <div
      style={{
        width: 48, height: 48, borderRadius: '50%',
        background: bg, flexShrink: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
      }}
    >
      {initials}
    </div>
  );
}

function ReviewCard({ r, i }: { r: Review; i: number }) {
  const cfg = SOURCE_CONFIG[r.source];

  const starRow = (
    <div className="flex gap-1">
      {Array.from({ length: r.rating }).map((_, j) => (
        <Star key={j} size={16} className="fill-wiregrass text-wiregrass" />
      ))}
    </div>
  );

  return (
    <RevealOnScroll delay={i * 0.12}>
      <article className="flex flex-col">
        {/* Bubble with drop-shadow encompassing the tail */}
        <div style={{ filter: 'drop-shadow(0 8px 28px rgba(0,0,0,0.07))', marginBottom: 24 }}>
          <div
            style={{
              background: cfg.bubbleBg,
              borderRadius: '16px 16px 16px 0',
              position: 'relative',
              overflow: 'visible',
            }}
          >
            {/* Verified seal — top right corner */}
            <VerifiedSeal color={cfg.accentColor} />

            <div style={{ padding: '28px 28px 24px' }}>
              {/* Platform logo (only for airbnb/booking) */}
              {cfg.logo && (
                <div className="mb-5">
                  {cfg.logo === 'airbnb' && <AirbnbLogo />}
                  {cfg.logo === 'booking' && <BookingLogo />}
                </div>
              )}

              {/* Quote */}
              <p
                className="font-display font-light italic text-ink mb-3"
                style={{
                  fontSize: 'clamp(17px, 2vw, 20px)',
                  lineHeight: 1.45,
                  letterSpacing: '-0.01em',
                  fontVariationSettings: '"SOFT" 50, "opsz" 24',
                  paddingRight: cfg.logo ? 0 : 32,
                }}
              >
                "{r.quote}"
              </p>

              {/* Body */}
              <p className="text-ink/65 text-sm mb-6" style={{ lineHeight: 1.65 }}>
                {r.body}
              </p>

              {/* Stars */}
              {starRow}
            </div>

            {/* Tail — CSS triangle trick */}
            <div
              style={{
                position: 'absolute',
                bottom: -20,
                left: 0,
                width: 0,
                height: 0,
                borderTop: `20px solid ${cfg.bubbleBg}`,
                borderRight: '20px solid transparent',
              }}
            />
          </div>
        </div>

        {/* Author row — below bubble */}
        <div className="flex items-center gap-4 pl-6">
          <InitialsAvatar name={r.author} bg={cfg.avatarBg} />
          <div>
            <p className="font-semibold text-ink text-sm leading-tight">{r.author}</p>
            <p className="text-ink/50 text-xs mt-0.5">{r.location} · {r.date}</p>
          </div>
        </div>
      </article>
    </RevealOnScroll>
  );
}

export default function ProofSocial({ reviews, pressQuote }: Props) {
  const [mobileActive, setMobileActive] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, offsetWidth } = carouselRef.current;
    const cardWidth = offsetWidth * 0.85 + 16;
    setMobileActive(Math.round(scrollLeft / cardWidth));
  };

  return (
    <section data-zone="light" data-bg="#E6DECC" className="bg-surface py-24 md:py-32 px-6">
      <div className="max-w-content mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-16">
            <p className="eyebrow-lg text-ink2 mb-3" style={{ fontSize: "16px" }}>What guests say</p>
            <div className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-wiregrass text-wiregrass" />
              ))}
            </div>
            <p
              className="font-display font-light text-ink text-lg"
              style={{ fontVariationSettings: '"SOFT" 20, "opsz" 24' }}
            >
              4.98 · 94 reviews
            </p>
          </div>
        </RevealOnScroll>

        {/* Mobile: scroll-snap carousel */}
        <div className="md:hidden mb-20">
          <div
            ref={carouselRef}
            onScroll={handleCarouselScroll}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 scrollbar-none"
            style={{ scrollbarWidth: 'none' }}
          >
            {reviews.map((r) => (
              <div key={r.author} className="snap-center shrink-0 w-[85vw]">
                <ReviewCard r={r} i={0} />
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-2 mt-5">
            {reviews.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all duration-300 bg-ink"
                style={{ width: mobileActive === i ? 24 : 6, opacity: mobileActive === i ? 0.6 : 0.2 }}
              />
            ))}
          </div>
        </div>

        {/* Desktop: 3-column grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 mb-20 items-start">
          {reviews.map((r, i) => (
            <ReviewCard key={r.author} r={r} i={i} />
          ))}
        </div>

        <RevealOnScroll>
          <div className="text-center py-12 border-t border-divider">
            <p
              className="font-display font-light text-ink text-[clamp(22px,3vw,38px)] mb-8 italic max-w-3xl mx-auto"
              style={{ fontVariationSettings: '"SOFT" 50, "opsz" 48', letterSpacing: '-0.02em' }}
            >
              "{pressQuote.quote}"
            </p>
            <div className="flex flex-col items-center gap-2">
              <img
                src="/images/press/garden-gun.png"
                alt="Garden & Gun"
                style={{
                  height: 28,
                  width: 'auto',
                  mixBlendMode: 'multiply',
                  opacity: 0.75,
                }}
              />
              <p className="eyebrow text-ink2" style={{ fontSize: 10 }}>
                {pressQuote.source.split('·')[1]?.trim()}
              </p>
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
