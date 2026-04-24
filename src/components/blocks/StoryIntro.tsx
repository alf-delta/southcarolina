import RevealOnScroll from '../primitives/RevealOnScroll';

interface Props {
  eyebrow: string;
  lede: string;
  body: string[];
  emphasis: string;
}

export default function StoryIntro({ eyebrow, lede, body, emphasis }: Props) {
  return (
    <section id="story" data-zone="light" data-bg="#F2EDE3" className="bg-bone py-24 md:py-36 px-6">
      <div className="max-w-text mx-auto">
        <RevealOnScroll>
          <p className="eyebrow text-ink2 mb-8 ornament">{eyebrow}</p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.1}>
          <p
            className="font-display font-light text-ink text-[clamp(28px,4vw,52px)] leading-[1.15] mb-10 drop-cap"
            style={{ fontVariationSettings: '"SOFT" 30, "opsz" 72', letterSpacing: '-0.02em' }}
          >
            {lede}
          </p>
        </RevealOnScroll>

        <RevealOnScroll delay={0.2}>
          <div className="space-y-6 text-ink/80 text-[17px] md:text-[18px]">
            {body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll delay={0.3}>
          <p className="mt-10 font-display font-light text-signal text-xl md:text-2xl italic"
            style={{ fontVariationSettings: '"SOFT" 60, "opsz" 36' }}>
            {emphasis}
          </p>
        </RevealOnScroll>
      </div>
    </section>
  );
}
