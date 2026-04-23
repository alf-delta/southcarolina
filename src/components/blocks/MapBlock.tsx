import RevealOnScroll from '../primitives/RevealOnScroll';

interface Direction {
  from: string;
  time: string;
  via: string;
}

export default function MapBlock({ directions }: { directions: Direction[] }) {
  return (
    <section className="bg-dune py-24 md:py-32 px-6">
      <div className="max-w-content mx-auto">
        <RevealOnScroll>
          <p className="eyebrow text-ink2 mb-4">Getting here</p>
          <h3
            className="font-display font-light text-ink text-[clamp(28px,4vw,48px)] mb-12"
            style={{ fontVariationSettings: '"SOFT" 30, "opsz" 72', letterSpacing: '-0.02em' }}
          >
            McBee, South Carolina.
          </h3>
        </RevealOnScroll>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <RevealOnScroll>
            <div className="aspect-[4/3] bg-boneWarm flex items-center justify-center overflow-hidden border border-divider">
              <svg viewBox="0 0 600 450" className="w-full h-full" aria-label="Stylized map of Carolina Sandhills region">
                <rect width="600" height="450" fill="#EAE3D3" />
                <path d="M50 225 Q 150 200 300 210 Q 450 220 550 195" stroke="#C9A96E" strokeWidth="3" fill="none" strokeDasharray="8,4" />
                <path d="M300 50 L 300 400" stroke="#C9A96E" strokeWidth="2" fill="none" strokeDasharray="6,3" />
                <path d="M100 80 Q 200 180 300 210" stroke="#D4C8B4" strokeWidth="1.5" fill="none" />
                <path d="M500 80 Q 400 180 300 210" stroke="#D4C8B4" strokeWidth="1.5" fill="none" />
                <path d="M100 380 Q 200 280 300 210" stroke="#D4C8B4" strokeWidth="1.5" fill="none" />
                <ellipse cx="300" cy="225" rx="28" ry="20" fill="#EAE3D3" stroke="#B05329" strokeWidth="2" />
                <circle cx="300" cy="215" r="5" fill="#B05329" />
                <text x="310" y="248" fontFamily="serif" fontSize="11" fill="#1F2420" fontStyle="italic">McBee, SC</text>
                <text x="80" y="75" fontFamily="sans-serif" fontSize="10" fill="#5A5650">Charlotte</text>
                <text x="460" y="75" fontFamily="sans-serif" fontSize="10" fill="#5A5650">Raleigh</text>
                <text x="60" y="395" fontFamily="sans-serif" fontSize="10" fill="#5A5650">Charleston</text>
                <text x="220" y="120" fontFamily="sans-serif" fontSize="9" fill="#A67C52">I-74 E</text>
                <text x="370" y="120" fontFamily="sans-serif" fontSize="9" fill="#A67C52">US-1 S</text>
              </svg>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="space-y-8">
              {directions.map((d) => (
                <div key={d.from} className="border-b border-divider pb-8">
                  <div className="flex items-baseline justify-between mb-2">
                    <p className="font-body font-medium text-ink">{d.from}</p>
                    <p
                      className="font-display font-light text-ink text-2xl"
                      style={{ fontVariationSettings: '"SOFT" 20, "opsz" 24', letterSpacing: '-0.02em' }}
                    >
                      {d.time}
                    </p>
                  </div>
                  <p className="text-ink2 text-sm">{d.via}</p>
                </div>
              ))}
              <p className="text-ink2 text-sm italic">423 Woodmen Rd, Patrick, SC 29584</p>
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
