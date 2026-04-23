import RevealOnScroll from '../primitives/RevealOnScroll';

interface Props {
  headline: string;
  body: string[];
  emphasis: string;
  image: string;
}

export default function DiningEditorial({ headline, body, emphasis, image }: Props) {
  return (
    <section id="table" className="bg-night py-24 md:py-36 px-6">
      <div className="max-w-content mx-auto grid md:grid-cols-2 gap-16 items-start">
        <RevealOnScroll className="md:sticky md:top-24">
          <div className="aspect-[3/4] overflow-hidden bg-nightWarm">
            <img
              src={image}
              alt="Farm table dining"
              className="w-full h-full object-cover"
              loading="lazy"
              width={800}
              height={1067}
            />
          </div>
        </RevealOnScroll>

        <div className="py-4">
          <RevealOnScroll>
            <p className="eyebrow text-linen2/50 mb-6">Dining</p>
            <h3
              className="font-display font-light text-linen text-[clamp(32px,4vw,56px)] mb-10 leading-[1.1]"
              style={{ fontVariationSettings: '"SOFT" 50, "opsz" 72', letterSpacing: '-0.03em' }}
            >
              {headline}
            </h3>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="space-y-6 text-linen/70 text-[17px] md:text-[18px]">
              {body.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <p className="mt-10 font-display font-light text-wiregrass text-lg md:text-xl italic border-l-2 border-wiregrass/40 pl-6"
              style={{ fontVariationSettings: '"SOFT" 50, "opsz" 24' }}>
              {emphasis}
            </p>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
