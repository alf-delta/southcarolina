import type { ImgHTMLAttributes } from 'react';

interface ImgProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
}

/**
 * Drop-in replacement for <img>.
 * Automatically serves a .webp version via <picture> when the src ends in
 * .png / .jpg / .jpeg, with the original format as a fallback for older browsers.
 */
export default function Img({ src, alt = '', ...rest }: ImgProps) {
  const isConvertible = /\.(png|jpe?g)$/i.test(src);
  if (!isConvertible) return <img src={src} alt={alt} {...rest} />;

  const webpSrc = src.replace(/\.(png|jpe?g)$/i, '.webp');

  return (
    <picture style={{ display: 'contents' }}>
      <source srcSet={webpSrc} type="image/webp" />
      <img src={src} alt={alt} {...rest} />
    </picture>
  );
}
