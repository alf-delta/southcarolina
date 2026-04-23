import type { ReactNode } from 'react';

type Variant = 'primary' | 'ghost-light' | 'secondary';

interface Props {
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  children: ReactNode;
  className?: string;
}

const base = 'inline-flex items-center justify-center font-eyebrow font-medium uppercase text-[11px] tracking-[0.22em] px-8 py-4 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 outline-none min-h-[44px]';

const variants: Record<Variant, string> = {
  primary: 'bg-signal text-linen hover:bg-signal2 active:scale-[0.98]',
  secondary: 'border border-ink text-ink hover:bg-ink hover:text-bone active:scale-[0.98]',
  'ghost-light': 'border border-linen/60 text-linen hover:bg-linen/10 active:scale-[0.98]',
};

export default function Button({ href, onClick, variant = 'primary', children, className = '' }: Props) {
  const cls = `${base} ${variants[variant]} ${className}`;
  if (href) {
    return <a href={href} className={cls}>{children}</a>;
  }
  return <button onClick={onClick} className={cls}>{children}</button>;
}
