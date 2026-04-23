import RevealOnScroll from '../primitives/RevealOnScroll';
import Button from '../primitives/Button';

interface Stay {
  tier: string;
  name: string;
  sleeps: string;
  description: string;
  priceFrom: number;
  image: string;
}

export default function StaysGrid({ stays }: { stays: Stay[] }) {
  return (
    <section id="stays" className="bg-nightWarm py-24 md:py-36 px-6">
      <div className="max-w-content mx-auto">
        <RevealOnScroll>
          <p className="eyebrow text-linen2 text-center mb-4">Where you'll sleep</p>
          <h3
            className="font-display font-light text-linen text-center text-[clamp(36px,5vw,72px)] mb-16"
            style={{ fontVariationSettings: '"SOFT" 40, "opsz" 72', letterSpacing: '-0.025em' }}
          >
            Two ways to stay
          </h3>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-8">
          {stays.map((stay, i) => (
            <RevealOnScroll key={stay.name} delay={i * 0.15}>
              <article className="bg-night overflow-hidden group">
                <div className="aspect-[4/3] overflow-hidden bg-surface">
                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                </div>
                <div className="p-8 md:p-10">
                  <p className="eyebrow text-linen2/60 mb-3">{stay.tier}</p>
                  <h4
                    className="font-display font-light text-linen text-[clamp(28px,3vw,44px)] mb-3"
                    style={{ fontVariationSettings: '"SOFT" 40, "opsz" 48', letterSpacing: '-0.02em' }}
                  >
                    {stay.name}
                  </h4>
                  <p className="eyebrow text-linen2/50 mb-4">{stay.sleeps}</p>
                  <p className="text-linen/70 mb-6">{stay.description}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-linen/50 text-sm">
                      From <span className="text-linen font-medium text-xl">${stay.priceFrom}</span> / night
                    </p>
                    <Button href="#reserve" variant="ghost-light" className="py-2.5 px-6">Reserve</Button>
                  </div>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
