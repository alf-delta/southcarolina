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

  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);
  const radius = useTransform(scrollYProgress, [0, 1], [28, 0]);

  return (
    <div ref={ref} style={{ position: 'sticky', top: 0, zIndex }}>
      <motion.div
        style={{
          scale: reduceMotion ? 1 : scale,
          borderRadius: reduceMotion ? 0 : radius,
          overflow: 'hidden',
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
