import RevealOnScroll from '../primitives/RevealOnScroll';

interface Scene {
  roman: string;
  label: string;
  time: string;
  headline: string;
  body: string;
  image: string;
}

export default function DayScenes({ scenes }: { scenes: Scene[] }) {
  return (
    <section id="day" data-zone="light" data-bg="#EAE3D3" className="bg-boneWarm py-24 md:py-36 px-6">
      <div className="max-w-content mx-auto">
        <RevealOnScroll>
          <p className="eyebrow text-ink2 mb-14 text-center">A day at Horizons</p>
        </RevealOnScroll>

        <div className="space-y-24 md:space-y-32">
          {scenes.map((scene, i) => (
            <RevealOnScroll key={scene.roman} delay={0.1}>
              <article className={`grid md:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'md:[&>*:first-child]:order-2' : ''}`}>
                <div className="aspect-[4/3] overflow-hidden bg-surface">
                  <img
                    src={scene.image}
                    alt={scene.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    width={800}
                    height={600}
                  />
                </div>
                <div className="py-4">
                  <div className="flex items-baseline gap-4 mb-6">
                    <span className="numeral text-ink2/50">{scene.roman}</span>
                    <span className="eyebrow text-ink2">{scene.label}</span>
                    <span className="font-body text-ink2 text-sm ml-auto">{scene.time}</span>
                  </div>
                  <h3
                    className="font-display font-light text-ink text-[clamp(22px,3vw,38px)] mb-6 leading-[1.2]"
                    style={{ fontVariationSettings: '"SOFT" 30, "opsz" 48', letterSpacing: '-0.02em' }}
                  >
                    {scene.headline}
                  </h3>
                  <p className="text-ink/75 leading-relaxed">{scene.body}</p>
                </div>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
