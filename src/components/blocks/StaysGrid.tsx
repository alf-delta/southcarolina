import { useNavigate } from 'react-router-dom';
import RevealOnScroll from '../primitives/RevealOnScroll';
import Button from '../primitives/Button';

interface Stay {
  slug?: string;
  tier: string;
  name: string;
  sleeps: string;
  description: string;
  priceFrom: number;
  image: string;
}

export default function StaysGrid({ stays }: { stays: Stay[] }) {
  const navigate = useNavigate();

  return (
    <section id="stays" data-zone="dark" className="bg-nightWarm pt-12 pb-24 md:pt-16 md:pb-36 px-6">
      <div className="max-w-content mx-auto">
        <RevealOnScroll>
          <p className="eyebrow-lg text-linen2 text-center mb-4" style={{ fontSize: "16px" }}>Where you'll living</p>
          <h3
            className="font-display font-light text-linen text-center text-[clamp(36px,5vw,72px)] mb-16"
            style={{ fontVariationSettings: '"SOFT" 40, "opsz" 72', letterSpacing: '-0.025em' }}
          >
            Two ways to stay
          </h3>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {stays.map((stay, i) => (
            <RevealOnScroll key={stay.name} delay={i * 0.15} className="flex">
              <article
                className="bg-night overflow-hidden rounded-2xl group flex flex-col w-full cursor-pointer"
                onClick={() => stay.slug && navigate(`/stays/${stay.slug}`)}
              >
                <div className="aspect-[16/9] overflow-hidden bg-surface">
                  <img
                    src={stay.image}
                    alt={stay.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                    width={800}
                    height={450}
                  />
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <p className="eyebrow text-linen2/60 mb-2">{stay.tier}</p>
                  <h4
                    className="font-display font-light text-linen text-[clamp(24px,2.5vw,36px)] mb-2"
                    style={{ fontVariationSettings: '"SOFT" 40, "opsz" 48', letterSpacing: '-0.02em' }}
                  >
                    {stay.name}
                  </h4>
                  <p className="eyebrow text-linen2/50 mb-3">{stay.sleeps}</p>
                  <p className="text-linen/70 text-sm mb-5">{stay.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <p className="text-linen/50 text-sm">
                      From <span className="text-linen font-medium text-lg">${stay.priceFrom}</span> / night
                    </p>
                    <Button
                      href={stay.slug ? `/stays/${stay.slug}` : '#reserve'}
                      variant="ghost-light"
                      className="py-2.5 px-6 whitespace-nowrap"
                    >
                      View details
                    </Button>
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
