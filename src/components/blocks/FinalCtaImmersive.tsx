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
      className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center bg-night"
    >
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

      <motion.div
        className="absolute inset-0 flex items-center justify-center z-[1] pointer-events-none"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <p
          className="font-display text-center leading-[0.88] whitespace-nowrap text-linen/90"
          style={{
            fontSize: 'clamp(56px, 14vw, 220px)',
            fontWeight: 200,
            letterSpacing: '-0.04em',
            fontVariationSettings: '"SOFT" 70, "opsz" 144',
          }}
          aria-hidden="true"
        >
          {bigType}
        </p>
      </motion.div>

      <img
        src={image}
        alt="Longleaf pine forest"
        className="absolute inset-0 w-full h-full object-cover z-[2] mask-bottom"
        style={{ filter: 'brightness(1) saturate(1.05)' }}
        loading="lazy"
        width={2400}
        height={1600}
      />

      <motion.div
        className="relative z-[4] text-center px-6 mt-auto pb-32"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          className="font-display font-light text-linen text-[clamp(28px,4vw,52px)] mb-3 max-w-2xl mx-auto"
          style={{ fontVariationSettings: '"SOFT" 40, "opsz" 72', letterSpacing: '-0.025em' }}
        >
          {headline}
        </h2>
        <p className="text-linen/70 mb-10 text-lg">{sub}</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button href="#" variant="primary">Check Availability</Button>
          <Button href="tel:+18035550180" variant="ghost-light">Call Us</Button>
        </div>
      </motion.div>
    </section>
  );
}
