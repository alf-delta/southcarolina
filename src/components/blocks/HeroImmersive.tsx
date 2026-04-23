import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ChevronDown, TreePine, Waves, Tent, MapPin } from 'lucide-react';
import Button from '../primitives/Button';

interface Props {
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  env: string;
  subject: string; // зарезервировано, не используется
}

export default function HeroImmersive({ eyebrow, primaryCta, secondaryCta }: Props) {
  const reduceMotion = useReducedMotion();
  const { scrollY } = useScroll();
  const h = typeof window !== 'undefined' ? window.innerHeight : 800;

  const bgY = useTransform(scrollY, [0, h], [0, -h * 0.2]);

  return (
    <section
      data-zone="dark"
      className="relative overflow-hidden bg-night"
      style={{ height: '100dvh' }}
    >
      {/* Фото с параллаксом */}
      <motion.div
        className="absolute inset-x-0"
        style={{ y: reduceMotion ? 0 : bgY, willChange: 'transform', zIndex: 0, top: '-20%', bottom: '-20%' }}
      >
        <picture>
          <source media="(max-width: 767px)" srcSet="/images/sandhills/mobile.webp" />
          <source media="(min-width: 768px)" srcSet="/images/sandhills/desktop.webp" />
          <img
            src="/images/sandhills/desktop.webp"
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.58) saturate(0.85)' }}
            width={2400}
            height={1600}
          />
        </picture>
      </motion.div>

      {/* Градиент снизу — усиливает читаемость subtitle и CTA */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: 'linear-gradient(to bottom, transparent 40%, rgba(26,31,27,0.7) 100%)',
        }}
      />

      {/* Мобайл */}
      <div className="md:hidden absolute inset-0" style={{ zIndex: 10 }}>
        <motion.div
          className="flex flex-col items-center justify-between text-center pointer-events-none h-full px-6 pt-28"
          style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom))' }}
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Верх: текст + лого */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex flex-col items-center gap-0">
              <span className="font-eyebrow font-medium uppercase text-linen/90" style={{ fontSize: '14px', letterSpacing: '0.20em', textShadow: '0 1px 12px rgba(0,0,0,0.7), 0 0 20px rgba(231,222,199,0.25)' }}>
                {eyebrow.split(' · ')[0]}
              </span>
              <span className="font-display" style={{ fontStyle: 'italic', fontSize: '17px', fontWeight: 300, letterSpacing: '0.04em', fontVariationSettings: '"SOFT" 40, "opsz" 24', color: '#eb8355' }}>
                {eyebrow.split(' · ')[1]}
              </span>
            </div>
            <img src="/Sandhills logo.svg" alt="Horizons Sandhills" className="w-auto" style={{ maxWidth: '48vw', filter: 'drop-shadow(0 3px 20px rgba(0,0,0,0.7)) brightness(1.12)' }} />
          </div>

          {/* Низ: инфографика + кнопка */}
          <div className="flex flex-col items-center gap-6">
            <div className="flex items-start justify-center gap-8">
              {[
                { icon: TreePine, value: '126', label: 'Acres of\nlongleaf pine' },
                { icon: Waves,    value: '18',  label: 'Acre\nprivate lake' },
                { icon: Tent,     value: '7',   label: 'Cabins &\nvillas' },
                { icon: MapPin,   value: '90',  label: 'Min from\nCharlotte' },
              ].map(({ icon: Icon, value, label }) => (
                <div key={value + label} className="flex flex-col items-center gap-1.5">
                  <Icon size={20} className="text-signal opacity-90" strokeWidth={1.4} />
                  <span className="text-linen font-eyebrow font-medium" style={{ fontSize: '18px', letterSpacing: '0.04em' }}>{value}</span>
                  <span className="text-linen/55 font-eyebrow uppercase text-center whitespace-pre-line" style={{ fontSize: '8px', letterSpacing: '0.18em', lineHeight: 1.5 }}>{label}</span>
                </div>
              ))}
            </div>
            <Button href={secondaryCta.href} variant="ghost-light" className="pointer-events-auto">{secondaryCta.label}</Button>
          </div>
        </motion.div>
      </div>

      {/* Десктоп */}
      <div className="hidden md:flex absolute inset-0 flex-col items-center justify-evenly px-6 pb-20 pt-24" style={{ zIndex: 10 }}>
        <motion.div
          className="flex flex-col items-center gap-4"
          initial={reduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src="/Sandhills logo.svg"
            alt="Horizons Sandhills"
            style={{ width: 'clamp(181px, 45vw, 510px)', height: 'auto', filter: 'drop-shadow(0 3px 20px rgba(0,0,0,0.7)) brightness(1.12)' }}
          />
        </motion.div>
        <motion.div
          className="flex flex-col items-center gap-4 text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="flex flex-col items-center gap-0">
            <span className="font-eyebrow font-medium uppercase text-linen/90" style={{ fontSize: '17px', letterSpacing: '0.20em', textShadow: '0 1px 12px rgba(0,0,0,0.7), 0 0 20px rgba(231,222,199,0.25)' }}>
              {eyebrow.split(' · ')[0]}
            </span>
            <span className="font-display" style={{ fontStyle: 'italic', fontSize: 'clamp(18px, 2.2vw, 28px)', fontWeight: 300, letterSpacing: '0.04em', fontVariationSettings: '"SOFT" 40, "opsz" 24', color: '#eb8355' }}>
              {eyebrow.split(' · ')[1]}
            </span>
          </div>
          <div className="flex items-start justify-center gap-10 xl:gap-14">
            {[
              { icon: TreePine, value: '126', label: 'Acres of\nlongleaf pine' },
              { icon: Waves,    value: '18',  label: 'Acre\nprivate lake' },
              { icon: Tent,     value: '7',   label: 'Cabins &\nvillas' },
              { icon: MapPin,   value: '90',  label: 'Min from\nCharlotte' },
            ].map(({ icon: Icon, value, label }) => (
              <div key={value + label} className="flex flex-col items-center gap-1.5">
                <Icon size={22} className="text-signal opacity-90" strokeWidth={1.4} />
                <span className="text-linen font-eyebrow font-medium" style={{ fontSize: '22px', letterSpacing: '0.04em' }}>{value}</span>
                <span className="text-linen/55 font-eyebrow uppercase text-center whitespace-pre-line" style={{ fontSize: '9px', letterSpacing: '0.18em', lineHeight: 1.5 }}>{label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-row gap-4 justify-center">
            <Button href={primaryCta.href} variant="primary">{primaryCta.label}</Button>
            <Button href={secondaryCta.href} variant="ghost-light">{secondaryCta.label}</Button>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-linen/50 animate-bounceCue">
        <ChevronDown size={24} />
      </div>
    </section>
  );
}
