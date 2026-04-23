import { motion, useScroll, useTransform, useInView, useReducedMotion } from 'framer-motion';
import { useRef } from 'react';

type MaskVariant = 'center' | 'left' | 'right' | 'bottom';

interface Props {
  numeral: string;
  subtitle: string;
  bigType: string;
  image: string;
  subjectImage?: string;
  mask?: MaskVariant;
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
  subjectImage,
  mask = 'center',
  zone = 'night',
  bigTypeSize,
  minHeight = '100vh',
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const reduceMotion = useReducedMotion();

  // Element-relative scroll: [start entering viewport] → [fully exited top]
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const h = typeof window !== 'undefined' ? window.innerHeight : 800;
  const bgY = useTransform(scrollYProgress, [0, 1], [0, -h * 0.2]);
  const fgY = useTransform(scrollYProgress, [0, 1], [0, -h * 0.07]);

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
      {/* Layer 0 — background, recedes at 20% scroll speed */}
      <motion.div
        className="absolute inset-0"
        style={{ y: reduceMotion ? 0 : bgY, willChange: 'transform', zIndex: 0 }}
      >
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
          style={{ filter: 'brightness(0.55) saturate(0.78) blur(3px)' }}
          loading="lazy"
          width={2400}
          height={1600}
        />
      </motion.div>

      {/* Layer 1 — display type, static */}
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

      {/* Layer 2 — foreground cutout, floats at 7% scroll speed */}
      <motion.div
        className="absolute inset-0"
        style={{ y: reduceMotion ? 0 : fgY, willChange: 'transform', zIndex: 20 }}
      >
        <img
          src={subjectImage || image}
          alt={subtitle}
          className={`w-full h-full object-cover mask-${mask}`}
          style={{ filter: 'brightness(1) saturate(1.05)' }}
          loading="lazy"
          width={2400}
          height={1600}
        />
      </motion.div>

      {/* Meta — above all layers */}
      <div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 text-center text-linen/85"
        style={{ zIndex: 30 }}
      >
        <p className="numeral text-linen/70 mb-2">— {numeral} —</p>
        <p className="eyebrow text-linen/50">{subtitle}</p>
      </div>
    </section>
  );
}
