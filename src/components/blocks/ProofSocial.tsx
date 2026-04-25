import { Star } from 'lucide-react';
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
    <img
      src="/images/airbnb_logo.png"
      alt="Airbnb"
      style={{ height: 22, width: 'auto', display: 'block' }}
    />
  );
}

function BookingLogo() {
  return (
    <img
      src="/images/booking_logo.png"
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

        <div className="grid md:grid-cols-3 gap-8 mb-20 items-start">
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
