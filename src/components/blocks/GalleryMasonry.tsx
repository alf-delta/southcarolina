import { useState } from 'react';
import { X } from 'lucide-react';
import RevealOnScroll from '../primitives/RevealOnScroll';

interface GalleryImage {
  src: string;
  alt: string;
  aspect: string;
}

export default function GalleryMasonry({ images }: { images: GalleryImage[] }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null);

  return (
    <section id="gallery" className="bg-bone py-24 md:py-32 px-6">
      <div className="max-w-content mx-auto">
        <RevealOnScroll>
          <p className="eyebrow text-ink2 mb-4">Gallery</p>
          <h3
            className="font-display font-light text-ink text-[clamp(28px,4vw,48px)] mb-12"
            style={{ fontVariationSettings: '"SOFT" 30, "opsz" 72', letterSpacing: '-0.02em' }}
          >
            See the land.
          </h3>
        </RevealOnScroll>

        {/* Mobile: big photo + thumbnail strip */}
        <div className="sm:hidden">
          <div
            className="w-full rounded-xl overflow-hidden cursor-pointer mb-3"
            style={{ aspectRatio: '4/3' }}
            onClick={() => setLightbox(images[active])}
          >
            <img
              src={images[active].src}
              alt={images[active].alt}
              className="w-full h-full object-cover transition-opacity duration-300"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                  active === i ? 'border-signal' : 'border-transparent opacity-50'
                }`}
              >
                <img src={img.src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: masonry columns */}
        <div className="hidden sm:block columns-2 lg:columns-3 gap-4 space-y-4">
          {images.map((img, i) => (
            <button
              key={i}
              className="block w-full break-inside-avoid overflow-hidden group focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 outline-none"
              onClick={() => setLightbox(img)}
              aria-label={`View: ${img.alt}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
                width={800}
                height={600}
              />
            </button>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-night/95 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
        >
          <button
            className="absolute top-6 right-6 text-linen/70 hover:text-linen outline-none"
            onClick={() => setLightbox(null)}
          >
            <X size={24} />
          </button>
          <img
            src={lightbox.src}
            alt={lightbox.alt}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}
