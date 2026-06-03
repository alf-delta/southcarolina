import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Decorative text fill styles ───────────────────────────────────────────────

const PINE_SVG_URL = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='22' height='30' viewBox='0 0 22 30'%3E%3Cpolygon points='11,1 21,12 1,12' fill='%23223D1C'/%3E%3Cpolygon points='11,7 22,19 0,19' fill='%232E5226'/%3E%3Cpolygon points='11,14 22,27 0,27' fill='%23223D1C'/%3E%3Crect x='9' y='27' width='4' height='3' fill='%23172B13'/%3E%3C/svg%3E";

const feelingTextStyle: React.CSSProperties = {
  backgroundImage: [
    'radial-gradient(1.5px 1.5px at 7% 32%,  rgba(255,255,255,0.92), transparent)',
    'radial-gradient(1px   1px   at 21% 16%,  rgba(255,255,255,0.80), transparent)',
    'radial-gradient(2px   2px   at 36% 54%,  rgba(255,255,255,0.86), transparent)',
    'radial-gradient(1px   1px   at 50% 24%,  rgba(255,255,255,0.70), transparent)',
    'radial-gradient(1.5px 1.5px at 64% 43%,  rgba(255,255,255,0.90), transparent)',
    'radial-gradient(1px   1px   at 77% 14%,  rgba(255,255,255,0.65), transparent)',
    'radial-gradient(2px   2px   at 89% 61%,  rgba(255,255,255,0.82), transparent)',
    'radial-gradient(1px   1px   at 12% 74%,  rgba(255,255,255,0.60), transparent)',
    'radial-gradient(1.5px 1.5px at 43% 79%,  rgba(255,255,255,0.74), transparent)',
    'radial-gradient(1px   1px   at 82% 87%,  rgba(255,255,255,0.68), transparent)',
    'radial-gradient(1px   1px   at 29% 92%,  rgba(255,255,255,0.55), transparent)',
    'radial-gradient(1.5px 1.5px at 58% 88%,  rgba(255,255,255,0.63), transparent)',
    'radial-gradient(1px   1px   at 94% 30%,  rgba(255,255,255,0.58), transparent)',
    'radial-gradient(2px   2px   at 3%  58%,  rgba(255,255,255,0.72), transparent)',
    'linear-gradient(135deg, #0D1B2A 0%, #1A1035 42%, #0A1628 72%, #0D1B2A 100%)',
  ].join(', '),
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text' as React.CSSProperties['backgroundClip'],
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
  display: 'inline',
};

const landTextStyle: React.CSSProperties = {
  backgroundImage: `url("${PINE_SVG_URL}"), linear-gradient(160deg, #3A6030 0%, #4A7840 45%, #2C4E22 100%)`,
  backgroundSize: '22px 30px, 100% 100%',
  backgroundRepeat: 'repeat, no-repeat',
  WebkitBackgroundClip: 'text',
  backgroundClip: 'text' as React.CSSProperties['backgroundClip'],
  WebkitTextFillColor: 'transparent',
  color: 'transparent',
  display: 'inline',
};

const MILESTONES: Array<{ year: string; title: string; body: string[]; accent?: boolean }> = [
  {
    year: '~15,000 BC',
    title: 'When the Ocean Left Its Signature',
    body: [
      'Long before roads, cabins, maps, or county lines, this land was shaped by an older force: the Atlantic. As the shoreline shifted eastward, it left behind ridges of pale sand — quiet evidence of a coast that once lived much farther inland.',
      'What looks like dry pine country today began as a memory of water.',
    ],
  },
  {
    year: '1400s',
    title: 'Before It Was "Land," It Was Home',
    body: [
      'For centuries before European maps reached this place, the Catawba knew the pine belt as lived country. Not wilderness. Not empty land. Home.',
      'They moved through these woods by season, story, fire, and need — long before anyone tried to draw borders around it.',
    ],
  },
  {
    year: '1730',
    title: 'The Road Through the Pines',
    body: [
      "By the 1700s, European settlers began moving through the Sandhills along colonial routes like King's Highway. It was not a highway in the modern sense, but a rough line of movement through heat, sand, pine, and uncertainty.",
      'Every road begins as an intrusion. Then, slowly, it becomes history.',
    ],
  },
  {
    year: '1865',
    title: 'The War Passed Close',
    body: [
      "In 1865, Sherman's army moved through the Carolinas, leaving burned towns, broken railroads, and hard memories behind. But here, in the Sandhills, the violence passed at a distance.",
      'Thirty miles can be very little on a map — and everything to a quiet piece of land.',
    ],
  },
  {
    year: '1939',
    title: 'A Refuge Is Born',
    body: [
      'In 1939, the Carolina Sandhills National Wildlife Refuge was established, setting aside more than 45,000 acres of pine country. What had once been cut, worked, and worn down was given a different future.',
      'Not untouched. Not forgotten. Protected.',
    ],
  },
  {
    year: '1986',
    title: 'The Last Cut',
    body: [
      'By the late 20th century, the old longleaf pine economy was fading. The trees that had once been measured as timber began to be seen differently — as habitat, shade, rhythm, and memory.',
      'The last harvest was not just an ending. It was a change in what the land was worth.',
    ],
  },
  {
    year: 'Today',
    title: '126 Acres. Still Quiet.',
    body: [
      'Today, this place is smaller than the old forests and quieter than the stories around it. But 126 acres is enough to hold a world: sand underfoot, pine above, birdsong, firelight, and the long patience of the land.',
      "Some places don't need to shout to be remembered.",
    ],
    accent: true,
  },
];


export default function LandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [when, setWhen] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);

  const handleSubmit = () => {
    if (!name || !phone) {
      setPhoneError(true);
      setTimeout(() => setPhoneError(false), 1200);
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      <section ref={sectionRef} data-zone="light" className="bg-bone py-20 px-6 md:py-28 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]" style={{ gap: 'clamp(24px, 3.5vw, 52px)', alignItems: 'start' }}>

            {/* Left inner — drop cap + body1 + timeline */}
            <div>

              {/* Drop cap + headline */}
              <div className="mb-9">
                <span
                  className="font-display float-left text-signal"
                  style={{ fontSize: 'clamp(5rem, 13vw, 9rem)', lineHeight: 0.82, fontWeight: 400, marginRight: '0.12em' }}
                >T</span>
                <p
                  className="font-display text-ink overflow-hidden"
                  style={{ fontSize: 'clamp(1.5rem, 3.2vw, 2.35rem)', lineHeight: 1.22, fontWeight: 400, paddingTop: '0.1em' }}
                >
                  he Sandhills run through the middle of the Carolinas like an old memory of the coast.
                </p>
              </div>

              {/* Body 1 */}
              <p className="font-display text-ink2 mb-7" style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', lineHeight: 1.6, fontWeight: 400 }}>
                Ridges of white sand left behind when the ocean moved east, now covered in longleaf pine and wiregrass so quiet the forest almost sounds hollow. In the evening, you can hear a dropped pinecone from the dock. In the morning, a whip-poor-will works its way across the tree line.{' '}
                <span className="text-signal italic">Nothing has hurried here since the Pleistocene.</span>
              </p>

              {/* Timeline */}
              <div className="my-10" style={{ position: 'relative', paddingLeft: 28 }}>
                {/* Bar */}
                <div style={{
                  position: 'absolute', left: 0, top: 5, bottom: 5,
                  width: 10, borderRadius: 6,
                  background: 'linear-gradient(to bottom, rgba(212,128,78,0.45) 0%, #B05329 100%)',
                }} />
                {MILESTONES.map((m, i) => {
                  const isOpen = activeMilestone === i;
                  return (
                    <div key={m.year} className="relative" style={{ paddingBottom: 4 }}>
                      {/* Dot */}
                      <div style={{
                        position: 'absolute', left: -28, top: 16,
                        width: 10, height: 10, borderRadius: '50%',
                        background: 'rgba(231,222,199,0.92)',
                        boxShadow: '0 0 0 2px rgba(176,83,41,0.25)',
                        zIndex: 1,
                      }} />
                      {/* Row button */}
                      <button
                        onClick={() => setActiveMilestone(isOpen ? null : i)}
                        style={{
                          display: 'flex', alignItems: 'flex-start', gap: 8,
                          width: '100%', textAlign: 'left', background: 'none', border: 'none',
                          cursor: 'pointer', paddingLeft: 20, paddingTop: 10, paddingBottom: 10, paddingRight: 0,
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span className="font-display" style={{ fontSize: 'clamp(13px, 1.3vw, 15px)', fontStyle: 'italic', fontWeight: 700, color: '#B05329', display: 'block', marginBottom: 3 }}>
                            {m.year}
                          </span>
                          <p className="font-display" style={{ fontSize: 'clamp(13px, 1.4vw, 15px)', lineHeight: 1.45, fontWeight: 400, fontStyle: m.accent ? 'italic' : 'normal', color: m.accent ? '#1F2420' : '#5A5650', margin: 0, transition: 'color 0.2s', textDecoration: 'underline', textDecorationColor: 'rgba(90,86,80,0.30)', textUnderlineOffset: '3px' }}>
                            {m.title}
                          </p>
                        </div>
                        <span style={{ fontSize: 18, color: '#B05329', opacity: isOpen ? 0.9 : 0.35, marginTop: 10, flexShrink: 0, transition: 'opacity 0.2s', lineHeight: 1 }}>
                          {isOpen ? '−' : '+'}
                        </span>
                      </button>
                      {/* Expanded body */}
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            key="body"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                            style={{ overflow: 'hidden', paddingLeft: 20 }}
                          >
                            <div style={{
                              borderLeft: '2px solid rgba(176,83,41,0.22)',
                              paddingLeft: 16, paddingRight: 4, paddingTop: 4, paddingBottom: 18,
                            }}>
                              {m.body.map((para, pi) => (
                                <p key={pi} className="font-display text-ink2" style={{ fontSize: 'clamp(13px, 1.35vw, 14.5px)', lineHeight: 1.65, fontWeight: 400, marginBottom: pi < m.body.length - 1 ? 10 : 0 }}>
                                  {para}
                                </p>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Right inner — question + body2 + tagline + CTA (sticky on lg+) */}
            <div className="lg:sticky" style={{ top: '108px' }}>
              <div style={{
                background: 'linear-gradient(145deg, #EAE3D3 0%, #E2D9C6 100%)',
                borderRadius: 20,
                padding: 'clamp(24px, 3vw, 36px)',
                boxShadow: '0 2px 0 rgba(255,255,255,0.72) inset, 0 12px 40px rgba(31,36,32,0.08)',
                border: '1px solid rgba(212,200,180,0.6)',
              }}>

                {/* Question */}
                <div className="mb-6">
                  <p className="font-display italic text-signal" style={{ fontSize: 'clamp(1.6rem, 3.2vw, 2.2rem)', lineHeight: 1.28, fontWeight: 600 }}>
                    We know the{' '}
                    <span style={feelingTextStyle}>feeling</span>
                    . The{' '}
                    <span style={landTextStyle}>land</span>
                    {' '}is ready when you are.
                  </p>
                </div>

                {/* Body 2 */}
                <p className="font-display text-ink2 mb-6" style={{ fontSize: 'clamp(13px, 1.5vw, 15px)', lineHeight: 1.7, fontWeight: 400 }}>
                  Our hundred and twenty-six acres sit in the middle of this. An eighteen-acre lake with a dock that creaks in a good way. Six villas, spaced so your neighbor stays a rumor. A sauna above the water. A house at the far end for the people who brought everyone with them.
                </p>

                {/* Tagline */}
                <p className="font-display italic text-signal" style={{ fontSize: 'clamp(0.95rem, 1.7vw, 1.1rem)', lineHeight: 1.4 }}>
                  No neon. No muzak. No app to download.
                </p>

                {/* Divider */}
                <div style={{ height: 1, background: 'rgba(176,83,41,0.15)', margin: '24px 0' }} />

                {/* CTA */}
                <button
                  className="font-eyebrow font-light text-linen bg-signal hover:bg-signal2 transition-colors rounded-full px-9 py-3"
                  style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase' }}
                  onClick={() => setModalOpen(true)}
                >
                  Ready? Let's talk →
                </button>

              </div>
            </div>

        </div>


      </section>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center p-4"
          style={{ background: 'rgba(30,28,24,0.62)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}
        >
          <div className="bg-bone border border-divider w-full relative" style={{ maxWidth: 400, padding: '2.25rem 2rem' }}>
            <button
              className="absolute top-4 right-5 text-ink2 font-light leading-none hover:text-ink transition-colors"
              style={{ fontSize: 22 }}
              onClick={() => setModalOpen(false)}
            >×</button>

            {!submitted ? (
              <>
                <p className="font-display italic text-ink mb-1" style={{ fontSize: '1.5rem', lineHeight: 1.25 }}>
                  We'll reach out.<br />You just rest.
                </p>
                <p className="font-eyebrow font-light text-ink2 mb-7" style={{ fontSize: 12, letterSpacing: '0.1em' }}>
                  Leave your number — we'll call with dates and a quiet offer.
                </p>

                {[
                  { label: 'Your name', type: 'text', placeholder: 'First name', value: name, onChange: (v: string) => setName(v), error: false },
                  { label: 'Phone number', type: 'tel', placeholder: '+1 (___) ___-____', value: phone, onChange: (v: string) => setPhone(v), error: phoneError },
                ].map((f) => (
                  <div key={f.label} className="mb-4">
                    <label className="block font-eyebrow font-light text-ink2 mb-1" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={f.value}
                      onChange={(e) => f.onChange(e.target.value)}
                      className={`w-full bg-boneWarm text-ink font-eyebrow font-light text-sm px-3 py-2.5 outline-none border transition-colors ${f.error ? 'border-signal' : 'border-divider focus:border-signal'}`}
                      style={{ borderRadius: 0 }}
                    />
                  </div>
                ))}

                <div className="mb-4">
                  <label className="block font-eyebrow font-light text-ink2 mb-1" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>When are you thinking?</label>
                  <select
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                    className="w-full bg-boneWarm border border-divider text-ink font-eyebrow font-light text-sm px-3 py-2.5 outline-none focus:border-signal appearance-none"
                    style={{ borderRadius: 0 }}
                  >
                    <option value="" disabled>— select a window —</option>
                    <option value="month">Within a month</option>
                    <option value="1-3mo">1–3 months from now</option>
                    <option value="summer">This summer</option>
                    <option value="fall">Fall or later</option>
                    <option value="exploring">Just exploring</option>
                  </select>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full font-eyebrow font-light text-linen bg-signal hover:bg-signal2 transition-colors py-3 mt-1"
                  style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', borderRadius: 0 }}
                >
                  Call me about Sandhills
                </button>
                <p className="font-eyebrow font-light text-ink2/50 text-center mt-4" style={{ fontSize: 10, letterSpacing: '0.08em' }}>
                  No spam. No pressure. Just a conversation.
                </p>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="font-display italic text-signal mb-2" style={{ fontSize: '1.4rem' }}>We'll be in touch soon.</p>
                <p className="font-eyebrow font-light text-ink2" style={{ fontSize: 12, letterSpacing: '0.1em' }}>The pines aren't going anywhere.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
