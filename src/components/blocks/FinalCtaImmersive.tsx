import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';
import Button from '../primitives/Button';

interface Props {
  bigType: string;
  headline: string;
  sub: string;
  image: string;
}

export default function FinalCtaImmersive({ bigType, headline, sub, image }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const reduceMotion = useReducedMotion();

  return (
    <section
      ref={ref}
      id="reserve"
      data-zone="dark"
      className="relative min-h-[67vh] md:min-h-screen overflow-hidden flex flex-col bg-night"
    >
      {/* Background blurred */}
      <img
        src={image}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.45) saturate(0.7) blur(2px)' }}
        loading="lazy"
        width={2400}
        height={1600}
      />

      {/* WAITING watermark — верхняя половина */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none"
        style={{ alignItems: 'flex-start', paddingTop: '12%' }}
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="font-display text-center leading-[0.88] whitespace-nowrap text-linen/90"
          style={{
            fontSize: 'clamp(48px, 14vw, 220px)',
            fontWeight: 200,
            letterSpacing: '-0.04em',
            fontVariationSettings: '"SOFT" 70, "opsz" 144',
          }}
          aria-hidden="true"
        >
          {bigType}
        </p>
      </motion.div>

      {/* Sharp foreground image */}
      <img
        src={image}
        alt="Longleaf pine forest"
        className="absolute inset-0 w-full h-full object-cover z-[2] mask-bottom"
        style={{ filter: 'brightness(1) saturate(1.05)' }}
        loading="lazy"
        width={2400}
        height={1600}
      />

      {/* Spacer pushes content to bottom */}
      <div className="flex-1" />

      {/* Content — всегда внизу */}
      <motion.div
        className="relative z-[4] text-center px-6 pb-14 md:pb-32"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          className="font-display font-light text-linen text-[clamp(22px,4vw,52px)] mb-2 max-w-2xl mx-auto"
          style={{ fontVariationSettings: '"SOFT" 40, "opsz" 72', letterSpacing: '-0.025em' }}
        >
          {headline}
        </h2>
        <p className="text-linen/70 mb-8 text-base md:text-lg">{sub}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="#" variant="primary">Check Availability</Button>
          <a
            href="tel:+18035550180"
            className="inline-flex items-center justify-center font-eyebrow font-medium uppercase text-[11px] tracking-[0.22em] px-8 py-4 rounded-full border border-linen/60 text-linen backdrop-blur-md bg-linen/10 hover:bg-linen/20 transition-all duration-300 min-h-[44px]"
          >Call Us</a>
        </div>
      </motion.div>
    </section>
  );
}
