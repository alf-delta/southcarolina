import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { TERRITORY } from './HeroImmersive';

const TOTAL = TERRITORY.length;

function RoadNode({ progress, index }: { progress: MotionValue<number>; index: number }) {
  const side = index % 2 === 0 ? 'right' : 'left';
  const start = index / TOTAL;
  const end = (index + 0.75) / TOTAL;

  const opacity = useTransform(progress, [start, end], [0, 1]);
  const x = useTransform(progress, [start, end], [side === 'right' ? 26 : -26, 0]);

  // Dot lights up as the spine fill reaches it
  const dotT = useTransform(progress, [start - 0.04, start + 0.05], [0, 1]);
  const dotScale = useTransform(dotT, [0, 1], [0.55, 1]);
  const dotBg = useTransform(dotT, [0, 1], ['rgba(242,237,227,0.2)', '#B05329']);
  const dotShadow = useTransform(dotT, [0, 1], ['0 0 0 rgba(176,83,41,0)', '0 0 0 5px rgba(176,83,41,0.2)']);

  const Icon = TERRITORY[index].icon;

  const content = (
    <motion.div
      style={{
        opacity, x,
        display: 'flex', flexDirection: 'column',
        alignItems: side === 'right' ? 'flex-start' : 'flex-end',
        textAlign: side === 'right' ? 'left' : 'right',
        paddingLeft: side === 'right' ? 22 : 4,
        paddingRight: side === 'right' ? 4 : 22,
      }}
    >
      <Icon size={34} weight="duotone" className="text-signal" style={{ opacity: 0.95, marginBottom: 9 }} />
      <span
        className="font-display"
        style={{ fontVariationSettings: '"wght" 380, "opsz" 72, "SOFT" 40', fontSize: 'clamp(1.15rem, 5.6vw, 1.55rem)', lineHeight: 1.12, letterSpacing: '-0.01em', color: 'rgba(242,237,227,0.95)' }}
      >
        {TERRITORY[index].value[0]}<br />{TERRITORY[index].value[1]}
      </span>
      <span
        style={{ marginTop: 8, fontFamily: 'Inter, system-ui, sans-serif', fontSize: 'clamp(11.5px, 3.4vw, 13px)', lineHeight: 1.5, color: 'rgba(231,222,199,0.62)' }}
      >
        {TERRITORY[index].label}
      </span>
    </motion.div>
  );

  return (
    <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', minHeight: 'clamp(150px, 30vw, 200px)' }}>
      {/* Dot on the spine */}
      <motion.div
        style={{
          position: 'absolute', left: '50%', top: '50%', translateX: '-50%', translateY: '-50%',
          width: 13, height: 13, borderRadius: 999, zIndex: 2,
          border: '2px solid #100D09',
          scale: dotScale, background: dotBg, boxShadow: dotShadow,
        }}
      />
      {/* Content on its side */}
      {side === 'right'
        ? (<><div /> {content}</>)
        : (<>{content} <div /></>)}
    </div>
  );
}

export default function MobileRoadmap() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.82', 'end 0.55'] });
  const fillHeight = useTransform(scrollYProgress, [0, 1], ['2%', '98%']);

  return (
    <div ref={ref} style={{ position: 'relative', margin: '6px 8px 0', paddingTop: 8, paddingBottom: 8 }}>
      {/* Spine — base */}
      <div style={{ position: 'absolute', left: '50%', top: 8, bottom: 8, width: 2, transform: 'translateX(-50%)', background: 'rgba(242,237,227,0.13)', borderRadius: 2 }} />
      {/* Spine — scroll fill */}
      <motion.div style={{ position: 'absolute', left: '50%', top: 8, width: 2, transform: 'translateX(-50%)', height: fillHeight, background: '#B05329', borderRadius: 2, boxShadow: '0 0 10px rgba(176,83,41,0.45)' }} />

      {TERRITORY.map((_, i) => (
        <RoadNode key={i} progress={scrollYProgress} index={i} />
      ))}
    </div>
  );
}
