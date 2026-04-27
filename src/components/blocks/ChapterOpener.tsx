import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

interface Props {
  numeral: string;
  subtitle: string;
  bigType: string;
  image: string;
  zone?: 'night' | 'pine-deep' | 'honey-dark';
  bigTypeSize?: string;
  minHeight?: string;
  id?: string;
}

export default function ChapterOpener({
  numeral,
  subtitle,
  bigType,
  image,
  zone = 'night',
  bigTypeSize,
  minHeight = '100vh',
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const h = typeof window !== 'undefined' ? window.innerHeight : 800;
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -h * 0.2]);

  const zoneBg = {
    'night': 'bg-night',
    'pine-deep': 'bg-pineDeep',
    'honey-dark': 'bg-honeyDark',
  }[zone];

  return (
    <section
      ref={ref}
      id={id}
      data-zone="dark"
      className={`relative overflow-hidden ${zoneBg}`}
      style={{ height: minHeight }}
    >
      {/* Background with parallax */}
      <motion.div
        className="absolute inset-x-0"
        style={{ y: reduceMotion ? 0 : bgY, willChange: 'transform', zIndex: 0, top: '-20vh', bottom: '-20vh' }}
      >
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.55) saturate(0.85)' }}
          loading="lazy"
          width={2400}
          height={1600}
        />
      </motion.div>

      {/* Display type */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <motion.h2
          className="font-display text-center leading-[0.9] whitespace-nowrap text-linen/90"
          style={{
            fontSize: bigTypeSize || 'clamp(80px, 18vw, 260px)',
            fontWeight: 200,
            fontVariationSettings: '"SOFT" 70, "opsz" 144',
          }}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96, letterSpacing: '0.01em' }}
          animate={inView ? { opacity: 1, scale: 1, letterSpacing: '-0.045em' } : {}}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          {bigType}
        </motion.h2>
      </div>

      {/* Meta */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center"
        style={{ zIndex: 20 }}
      >
        <p className="numeral text-signal mb-3" style={{ fontSize: '17px' }}>— {numeral} —</p>
        <p className="eyebrow text-linen/60" style={{ fontSize: '13px', letterSpacing: '0.20em' }}>{subtitle}</p>
      </div>
    </section>
  );
}
