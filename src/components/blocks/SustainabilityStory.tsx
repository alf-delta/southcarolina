import RevealOnScroll from '../primitives/RevealOnScroll';

interface Props {
  headline: string;
  lede: string;
  body: string;
  stats: { value: string; label: string }[];
  certs: string[];
  image: string;
}

export default function SustainabilityStory({ headline, lede, body, stats, certs, image }: Props) {
  return (
    <section data-zone="light" data-bg="#DDE2D6" className="bg-pineLight py-24 md:py-32 px-6">
      <div className="max-w-content mx-auto grid md:grid-cols-2 gap-16 items-center">
        <RevealOnScroll>
          <div className="aspect-[4/5] overflow-hidden bg-surface">
            <img
              src={image}
              alt="Longleaf pine conservation"
              className="w-full h-full object-cover"
              loading="lazy"
              width={800}
              height={1000}
            />
          </div>
        </RevealOnScroll>

        <div>
          <RevealOnScroll>
            <p className="eyebrow text-ink2 mb-4">Land stewardship</p>
            <h3
              className="font-display font-light text-ink text-[clamp(28px,4vw,48px)] mb-6 leading-[1.1]"
              style={{ fontVariationSettings: '"SOFT" 30, "opsz" 72', letterSpacing: '-0.02em' }}
            >
              {headline}
            </h3>
            <p className="text-ink/80 mb-4 font-medium">{lede}</p>
            <p className="text-ink/70">{body}</p>
          </RevealOnScroll>

          <RevealOnScroll delay={0.15}>
            <div className="grid grid-cols-3 gap-6 mt-10 py-8 border-t border-divider">
              {stats.map((s) => (
                <div key={s.label} className="text-center">
                  <p
                    className="font-display font-light text-ink text-[clamp(28px,3vw,44px)] leading-none mb-1"
                    style={{ fontVariationSettings: '"SOFT" 20, "opsz" 48', letterSpacing: '-0.02em' }}
                  >
                    {s.value}
                  </p>
                  <p className="text-ink2 text-xs leading-snug">{s.label}</p>
                </div>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div className="flex flex-wrap gap-2 mt-6">
              {certs.map((c) => (
                <span key={c} className="eyebrow border border-ink/20 text-ink/60 px-3 py-1.5 text-[10px]">{c}</span>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
