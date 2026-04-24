import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  zIndex: number;
}

export default function StackCard({ children, zIndex }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Track when this card slides in from below
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.1'],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [48, 0]);
  const shadow = useTransform(
    scrollYProgress,
    [0, 1],
    ['0 32px 80px rgba(0,0,0,0.45)', '0 0px 0px rgba(0,0,0,0)']
  );

  return (
    <div ref={ref} style={{ position: 'sticky', top: 0, zIndex }}>
      <motion.div
        style={{
          scale: reduceMotion ? 1 : scale,
          borderRadius: reduceMotion ? 0 : radius,
          boxShadow: reduceMotion ? 'none' : shadow,
          overflow: 'hidden',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
