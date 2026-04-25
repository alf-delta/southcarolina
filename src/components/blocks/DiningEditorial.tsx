import RevealOnScroll from '../primitives/RevealOnScroll';

const stats = [
  { num: '$800M+', label: 'Annual tourist spend', desc: 'In the Sandhills region annually — double-digit growth, year over year.' },
  { num: '89', label: 'Cost of living index', desc: 'vs. 122 in Charleston. Your dollar stays a dollar here.' },
  { num: '0/10', label: 'Flood risk', desc: '230,000 SC coastal residents live in flood zones. We don\'t.' },
];

const beachRows = [
  '12 million visitors. One coastline. No land left at scale.',
  'Hurricane track. Rising sea levels. Long-term capital risk.',
  'Peak season traffic. Off-season silence of a different kind.',
  'Neon, chain restaurants, app-based everything.',
];

const usRows = [
  'Ancient coastal geology. Longleaf pine. Wiregrass. 96,000 acres of state forest nearby.',
  'Elevated terrain. Flood risk: 1 out of 10. Built to last decades, not seasons.',
  'Spring and fall peak. Genuine off-season with fire, fog, and open skies.',
  'No neon. No muzak. No app to download.',
];

const privateStats = [
  { num: '1', label: 'Owner. Not a fund.', desc: 'No private equity. No quarterly targets. Every decision here is made by someone who sleeps under the same pines.' },
  { num: '6', label: 'Villas. Not 60.', desc: 'We chose density you can\'t hear. Your neighbor stays a rumor. That\'s a deliberate choice, not a constraint.' },
  { num: '18', label: 'Acres of lake.', desc: 'A dock that creaks in a good way. A sauna above the water. Local sourdough, eggs from six miles north, honey from our own longleafs.' },
  { num: '0', label: 'Corporate playbook.', desc: 'No loyalty program. No upsell at check-in. The pantry box arrives because someone thought you\'d like it, not because it\'s a line item.' },
];

const XIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width={16} height={16} style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="8" cy="8" r="7" stroke="#C4B49A" strokeWidth="1"/>
    <path d="M5 8h6M5 8l2-2M5 8l2 2" stroke="#C4B49A" strokeWidth="1" strokeLinecap="round"/>
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" width={16} height={16} style={{ flexShrink: 0, marginTop: 2 }}>
    <circle cx="8" cy="8" r="7" stroke="#7A6A50" strokeWidth="1"/>
    <path d="M5 8l2 2 4-4" stroke="#C4531A" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function DiningEditorial() {
  return (
    <section id="table" data-zone="light" data-bg="#F2EDE3" className="bg-bone py-16 md:py-24 px-6">
      <div className="max-w-content mx-auto">

        <RevealOnScroll>
          <p className="eyebrow-lg text-ink2 mb-6" style={{ fontSize: '16px' }}>Why Horizons — Why Here</p>
          <h2
            className="font-display font-light text-ink mb-4 leading-[1.15]"
            style={{ fontSize: 'clamp(32px,5vw,52px)', letterSpacing: '-0.02em', fontVariationSettings: '"SOFT" 30, "opsz" 72' }}
          >
            The coast is <em style={{ fontStyle: 'italic', color: '#C4531A' }}>crowded.</em><br />
            We found something better.
          </h2>
        </RevealOnScroll>

        {/* Section label */}
        <div className="flex items-center gap-4 mb-5">
          <span className="eyebrow text-signal/70" style={{ fontSize: '12px', letterSpacing: '0.25em' }}>The numbers behind the shift</span>
          <div className="flex-1 h-px bg-divider" />
        </div>

        {/* Stats */}
        <RevealOnScroll>
          <div className="grid sm:grid-cols-3 gap-px mb-8" style={{ background: 'rgba(100,90,70,0.15)' }}>
            {stats.map((s) => (
              <div key={s.label} className="bg-bone p-5 transition-colors duration-200 hover:bg-surface">
                <p className="font-display text-signal mb-2" style={{ fontSize: 'clamp(32px,4vw,44px)', fontWeight: 400, lineHeight: 1 }}>{s.num}</p>
                <p className="eyebrow text-ink2 mb-1" style={{ fontSize: '11px', letterSpacing: '0.1em' }}>{s.label}</p>
                <p className="text-ink2" style={{ fontSize: '15px', fontWeight: 300, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Section label */}
        <div className="flex items-center gap-4 mb-5">
          <span className="eyebrow text-signal/70" style={{ fontSize: '12px', letterSpacing: '0.25em' }}>Sandhills vs. the beach</span>
          <div className="flex-1 h-px bg-divider" />
        </div>

        {/* Versus */}
        <RevealOnScroll>
          <div className="mb-8 border border-divider relative overflow-hidden" style={{ background: '#DDD5C2', boxShadow: '0 2px 24px rgba(60,45,25,0.10)' }}>
            {/* Watermark VS */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
              style={{ zIndex: 0 }}
            >
              <span
                className="font-display italic text-ink/[0.04]"
                style={{ fontSize: 'clamp(140px, 20vw, 240px)', fontWeight: 400, lineHeight: 1, letterSpacing: '-0.05em' }}
              >VS</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 relative" style={{ zIndex: 1 }}>
              {/* Beach col */}
              <div className="p-6 md:p-8 sm:border-r border-divider" style={{ background: '#D4CBBA' }}>
                <p className="eyebrow text-ink2/50 mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>Myrtle Beach</p>
                <p
                  className="font-display text-ink2/50 italic mb-6"
                  style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em' }}
                >
                  12 million visitors.<br />One coastline.
                </p>
                <div>
                  {beachRows.map((r, i) => (
                    <div key={r} className={`flex gap-3 items-start py-3 ${i < beachRows.length - 1 ? 'border-b border-divider' : ''}`}>
                      <XIcon />
                      <span style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.5, color: '#9A8F7E' }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Us col */}
              <div className="p-6 md:p-8 border-t border-divider sm:border-t-0 relative" style={{ background: '#E4DCCB' }}>
                <div className="absolute top-0 left-0 w-full h-0.5 sm:h-full sm:w-0.5 bg-signal" />
                <p className="eyebrow text-signal mb-4" style={{ fontSize: '10px', letterSpacing: '0.2em' }}>Horizons Sandhills</p>
                <p
                  className="font-display text-ink italic mb-6"
                  style={{ fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 400, lineHeight: 1.1, letterSpacing: '-0.02em' }}
                >
                  126 acres.<br />Six villas.
                </p>
                <div>
                  {usRows.map((r, i) => (
                    <div key={r} className={`flex gap-3 items-start py-3 ${i < usRows.length - 1 ? 'border-b border-divider' : ''}`}>
                      <CheckIcon />
                      <span style={{ fontSize: '14px', fontWeight: 300, lineHeight: 1.5, color: '#5A4A38' }}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Section label */}
        <div className="flex items-center gap-4 mb-5">
          <span className="eyebrow text-signal/70" style={{ fontSize: '12px', letterSpacing: '0.25em' }}>Privately owned. Personally run.</span>
          <div className="flex-1 h-px bg-divider" />
        </div>

        {/* Private stats */}
        <RevealOnScroll>
          <div className="grid sm:grid-cols-4 gap-px mb-8" style={{ background: 'rgba(100,90,70,0.15)' }}>
            {privateStats.map((s) => (
              <div key={s.label} className="bg-bone p-5">
                <p className="font-display text-signal/80 mb-1" style={{ fontSize: 'clamp(26px,3vw,32px)', fontWeight: 400, lineHeight: 1 }}>{s.num}</p>
                <p className="eyebrow text-ink2 mb-2" style={{ fontSize: '11px', letterSpacing: '0.15em' }}>{s.label}</p>
                <p className="text-ink2" style={{ fontSize: '15px', fontWeight: 300, lineHeight: 1.5 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Manifesto */}
        <RevealOnScroll>
          <blockquote className="border-l-2 border-signal pl-8 py-4 bg-surface mb-8">
            <p className="font-display font-light text-ink italic mb-3" style={{ fontSize: 'clamp(17px,2.2vw,21px)', lineHeight: 1.5, fontVariationSettings: '"SOFT" 50, "opsz" 24' }}>
              "Glamping is growing because people are tired of the beach — not the water, but what surrounds it. Crowds, concrete, commerce. The Sandhills offer something rarer: a landscape that feels borrowed, not built."
            </p>
            <p className="text-ink2" style={{ fontSize: '15px', fontWeight: 200, letterSpacing: '0.05em' }}>
              — From our market research on the shift away from coastal travel, 2025
            </p>
          </blockquote>
        </RevealOnScroll>

        {/* CTA */}
        <RevealOnScroll>
          <div className="flex items-center gap-8 flex-wrap">
            <a
              href="#reserve"
              className="eyebrow text-linen bg-signal px-9 py-3 rounded-full transition-colors duration-200 hover:bg-signal/80"
              style={{ fontSize: '12px', letterSpacing: '0.2em' }}
            >
              Ready? Let's talk →
            </a>
            <p className="font-display italic text-ink2" style={{ fontSize: '15px', fontWeight: 200 }}>
              No app to download. Just a conversation.
            </p>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  );
}
