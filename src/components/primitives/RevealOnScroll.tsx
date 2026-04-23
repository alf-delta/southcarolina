import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';
import type { ReactNode } from 'react';

type Variant = 'fade' | 'stagger-parent' | 'stagger-child';

interface Props {
  children: ReactNode;
  variant?: Variant;
  className?: string;
  delay?: number;
}

const ease = [0.22, 1, 0.36, 1] as const;

const fadeVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0 },
};

const staggerParent: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const staggerChild: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

export default function RevealOnScroll({ children, variant = 'fade', className, delay = 0 }: Props) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  if (variant === 'stagger-parent') {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerParent}
      >
        {children}
      </motion.div>
    );
  }

  if (variant === 'stagger-child') {
    return (
      <motion.div className={className} variants={staggerChild}>
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={fadeVariants}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}
