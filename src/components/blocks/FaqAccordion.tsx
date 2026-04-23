import RevealOnScroll from '../primitives/RevealOnScroll';

interface FaqItem {
  q: string;
  a: string;
}

export default function FaqAccordion({ items }: { items: FaqItem[] }) {
  return (
    <section className="bg-bone py-24 md:py-32 px-6">
      <div className="max-w-text mx-auto">
        <RevealOnScroll>
          <p className="eyebrow text-ink2 mb-4">Questions</p>
          <h3
            className="font-display font-light text-ink text-[clamp(28px,4vw,48px)] mb-12"
            style={{ fontVariationSettings: '"SOFT" 30, "opsz" 72', letterSpacing: '-0.02em' }}
          >
            The honest answers.
          </h3>
        </RevealOnScroll>

        <div className="space-y-0 border-t border-divider">
          {items.map((item) => (
            <RevealOnScroll key={item.q}>
              <details className="border-b border-divider group">
                <summary className="flex items-center justify-between py-6 cursor-pointer list-none">
                  <span className="font-body font-medium text-ink pr-8">{item.q}</span>
                  <span className="chev text-ink2 text-2xl font-light flex-shrink-0">+</span>
                </summary>
                <div className="pb-6 text-ink/75 text-[17px]">
                  <p>{item.a}</p>
                </div>
              </details>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
