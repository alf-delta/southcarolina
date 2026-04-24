import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function RoundedEntry({ children, radius = 48, className, style }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.15'],
  });

  const borderRadius = useTransform(scrollYProgress, [0, 1], [radius, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const shadow = useTransform(
    scrollYProgress,
    [0, 1],
    ['0 32px 80px rgba(0,0,0,0.35)', '0 0px 0px rgba(0,0,0,0)']
  );

  return (
    <div ref={ref}>
      <motion.div
        className={className}
        style={{
          borderTopLeftRadius: reduceMotion ? 0 : borderRadius,
          borderTopRightRadius: reduceMotion ? 0 : borderRadius,
          scale: reduceMotion ? 1 : scale,
          boxShadow: reduceMotion ? 'none' : shadow,
          overflow: 'hidden',
          ...style,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
