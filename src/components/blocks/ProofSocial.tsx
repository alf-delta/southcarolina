import { Star } from 'lucide-react';
import RevealOnScroll from '../primitives/RevealOnScroll';

interface Review {
  rating: number;
  quote: string;
  body: string;
  author: string;
  location: string;
  date: string;
}

interface Props {
  reviews: Review[];
  pressQuote: { quote: string; source: string };
}

export default function ProofSocial({ reviews, pressQuote }: Props) {
  return (
    <section data-zone="light" data-bg="#E6DECC" className="bg-surface py-24 md:py-32 px-6">
      <div className="max-w-content mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-14">
            <p className="eyebrow text-ink2 mb-3">What guests say</p>
            <div className="flex items-center justify-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={16} className="fill-wiregrass text-wiregrass" />
              ))}
            </div>
            <p className="font-display font-light text-ink text-lg" style={{ fontVariationSettings: '"SOFT" 20, "opsz" 24' }}>
              4.98 · 94 reviews
            </p>
          </div>
        </RevealOnScroll>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {reviews.map((r, i) => (
            <RevealOnScroll key={r.author} delay={i * 0.12}>
              <article className="bg-bone p-8 h-full flex flex-col">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} size={12} className="fill-wiregrass text-wiregrass" />
                  ))}
                </div>
                <p className="font-display font-light text-ink text-xl mb-4 italic"
                  style={{ fontVariationSettings: '"SOFT" 50, "opsz" 24', letterSpacing: '-0.01em' }}>
                  "{r.quote}"
                </p>
                <p className="text-ink/70 text-sm flex-1 mb-6">{r.body}</p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-divider">
                  <div>
                    <p className="font-medium text-ink text-sm">{r.author}</p>
                    <p className="text-ink2 text-xs">{r.location}</p>
                  </div>
                  <p className="text-ink2 text-xs">{r.date}</p>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>

        <RevealOnScroll>
          <div className="text-center py-12 border-t border-divider">
            <p
              className="font-display font-light text-ink text-[clamp(22px,3vw,38px)] mb-4 italic max-w-3xl mx-auto"
              style={{ fontVariationSettings: '"SOFT" 50, "opsz" 48', letterSpacing: '-0.02em' }}
            >
              "{pressQuote.quote}"
            </p>
            <p className="eyebrow text-ink2">{pressQuote.source}</p>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
