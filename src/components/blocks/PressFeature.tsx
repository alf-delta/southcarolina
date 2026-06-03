import { motion, useReducedMotion } from 'framer-motion';
import { PRESS } from './HeroImmersive';

export default function PressFeature() {
  const reduce = useReducedMotion();

  return (
    <section data-zone="light" style={{ background: '#EAE3D3', padding: 'clamp(28px, 5vw, 80px) clamp(16px, 4vw, 64px)' }}>
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.95, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          borderRadius: 'clamp(24px, 3vw, 44px)',
          overflow: 'hidden',
          boxShadow: '0 50px 130px rgba(0,0,0,0.45)',
        }}
      >
        {/* Photographic backdrop */}
        <img
          src="/images/sandhills/land.webp"
          alt=""
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Dark wash for depth + legibility */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,10,8,0.84) 0%, rgba(8,10,8,0.72) 100%)' }} />
        {/* Warm radial sheen, top-left */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(120% 90% at 10% 0%, rgba(176,83,41,0.22), transparent 55%)' }} />
        {/* Glass edge highlight */}
        <div aria-hidden="true" style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', boxShadow: 'inset 0 1px 0 rgba(242,237,227,0.16), inset 0 0 0 1px rgba(242,237,227,0.08)' }} />

        {/* Content */}
        <div style={{ position: 'relative', padding: 'clamp(36px, 6vw, 92px) clamp(24px, 5vw, 80px)' }}>

          {/* Header */}
          <p className="font-eyebrow uppercase" style={{ fontSize: '11px', letterSpacing: '0.26em', color: '#E2A06A', marginBottom: 14 }}>
            In the press
          </p>
          <h2
            className="font-display"
            style={{
              fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0',
              fontWeight: 380,
              fontSize: 'clamp(1.9rem, 4vw, 3.4rem)',
              lineHeight: 1.06,
              letterSpacing: '-0.02em',
              color: 'rgba(242,237,227,0.96)',
              maxWidth: '18ch',
              marginBottom: 'clamp(32px, 5vh, 60px)',
            }}
          >
            The region, in their words.
          </h2>

          {/* Frosted glass article cards */}
          <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(14px, 1.6vw, 22px)' }}>
            {PRESS.map((p, i) => (
              <motion.a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
                initial={reduce ? false : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  textDecoration: 'none',
                  borderRadius: 18,
                  padding: 'clamp(22px, 2.6vw, 34px)',
                  background: 'rgba(242,237,227,0.82)',
                  backdropFilter: 'blur(20px) saturate(120%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(120%)',
                  border: '1px solid rgba(242,237,227,0.5)',
                  boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 22px 54px rgba(0,0,0,0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <img
                  src={p.logo}
                  alt={p.name}
                  style={{ height: 26, width: 'auto', objectFit: 'contain', objectPosition: 'left', mixBlendMode: 'multiply', marginBottom: 'clamp(14px, 2vh, 20px)' }}
                />
                <p
                  className="font-display"
                  style={{
                    fontVariationSettings: '"opsz" 48, "SOFT" 30',
                    fontWeight: 360,
                    fontSize: 'clamp(1.02rem, 1.6vw, 1.4rem)',
                    lineHeight: 1.42,
                    letterSpacing: '-0.01em',
                    color: 'rgba(31,36,32,0.82)',
                    marginBottom: 'clamp(16px, 2.2vh, 24px)',
                  }}
                >
                  {p.description.split(/(".*?")/g).map((part, j) =>
                    part.startsWith('"') && part.endsWith('"')
                      ? <em key={j} style={{ fontStyle: 'italic', color: '#B05329' }}>{part}</em>
                      : part
                  )}
                </p>
                <span
                  className="eyebrow text-signal"
                  style={{ marginTop: 'auto', fontSize: 11, letterSpacing: '0.2em', display: 'inline-flex', alignItems: 'center', gap: 8 }}
                >
                  Read the article
                  <span className="group-hover:translate-x-1" style={{ display: 'inline-block', transition: 'transform 0.3s ease' }}>→</span>
                </span>
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
