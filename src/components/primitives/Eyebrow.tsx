interface Props {
  children: string;
  size?: 'sm' | 'lg';
  className?: string;
}

export default function Eyebrow({ children, size = 'sm', className = '' }: Props) {
  return (
    <p className={`${size === 'lg' ? 'eyebrow-lg' : 'eyebrow'} ${className}`}>
      {children}
    </p>
  );
}
