import { useRef, useEffect, useState } from 'react';

const TIMER_SPEED_BASE = 1;
const TIMER_SPEED_SCROLL = 100;
const TIMER_CTA_THRESHOLD = 2400;
const SCROLL_DECAY_MS = 280;

const hints = [
  'scroll to see how fast time moves',
  'keep going\u2026',
  'still counting.',
  'and counting.',
  '',
];

export default function LandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const accRef = useRef(0);
  const hoursRef = useRef(0);
  const speedRef = useRef(TIMER_SPEED_BASE);
  const lastTsRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const ctaShownRef = useRef(false);
  const animIdRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [displayHours, setDisplayHours] = useState<string>('—');
  const [hint, setHint] = useState(hints[0]);
  const [question, setQuestion] = useState('When did you last slow down like this?');
  const [ctaVisible, setCtaVisible] = useState(false);
  const [numFast, setNumFast] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [when, setWhen] = useState('');
  const [phoneError, setPhoneError] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const frame = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.1);
      lastTsRef.current = ts;

      accRef.current += speedRef.current * dt * 120;
      const h = Math.floor(accRef.current);

      if (h !== hoursRef.current) {
        hoursRef.current = h;
        setDisplayHours(h.toLocaleString());
      }

      if (h > 300 && h < TIMER_CTA_THRESHOLD) {
        const idx = Math.min(Math.floor(h / 480), hints.length - 1);
        setHint(hints[idx]);
      }

      if (h >= TIMER_CTA_THRESHOLD && !ctaShownRef.current) {
        ctaShownRef.current = true;
        setCtaVisible(true);
        setQuestion('We know the feeling. The land is ready when you are.');
      }

      animIdRef.current = requestAnimationFrame(frame);
    };

    const startTimer = () => {
      if (runningRef.current) return;
      runningRef.current = true;
      accRef.current = 0;
      hoursRef.current = 0;
      lastTsRef.current = null;
      setDisplayHours('0');
      animIdRef.current = requestAnimationFrame(frame);
    };

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startTimer();
        observer.disconnect();
      }
    }, { threshold: 0.25 });

    observer.observe(section);

    lastScrollYRef.current = window.scrollY;
    const onScroll = () => {
      if (!runningRef.current) return;
      const dy = Math.abs(window.scrollY - lastScrollYRef.current);
      lastScrollYRef.current = window.scrollY;
      speedRef.current = 1 + Math.min(dy * 3, TIMER_SPEED_SCROLL);
      setNumFast(true);
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
      slowTimerRef.current = setTimeout(() => {
        speedRef.current = TIMER_SPEED_BASE;
        setNumFast(false);
      }, SCROLL_DECAY_MS);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(animIdRef.current);
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    };
  }, []);

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
      <section ref={sectionRef} className="bg-bone py-20 px-6 md:py-28">
        <div style={{ maxWidth: 660, margin: '0 auto' }}>

          {/* Section mark */}
          <div className="flex items-center gap-3 mb-10">
            <div className="flex-1 h-px bg-divider" style={{ maxWidth: 80 }} />
            <span className="font-eyebrow font-light text-ink2" style={{ fontSize: 13, letterSpacing: '0.15em' }}>§</span>
            <div className="flex-1 h-px bg-divider" style={{ maxWidth: 80 }} />
          </div>

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

          {/* Timer */}
          <div className="my-9 py-6 px-7 bg-boneWarm border-l-2 border-signal">
            <p
              className="font-display italic text-ink2 mb-3"
              style={{ fontSize: 'clamp(1rem, 2.2vw, 1.2rem)', lineHeight: 1.4 }}
            >
              {question}
            </p>
            <p className="font-eyebrow font-light text-ink2 mb-1" style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              hours since your last real rest
            </p>
            <div className="flex items-baseline gap-3">
              <span
                className={`font-display text-signal transition-colors duration-300 ${numFast ? 'opacity-60' : ''}`}
                style={{ fontSize: 'clamp(2.2rem, 6vw, 3.4rem)', fontWeight: 400, lineHeight: 1, minWidth: '4ch' }}
              >
                {displayHours}
              </span>
              <span className="font-eyebrow font-light text-ink2" style={{ fontSize: 13, letterSpacing: '0.12em' }}>hrs</span>
            </div>
            {!ctaVisible && (
              <p className="font-eyebrow italic text-ink2/50 mt-2" style={{ fontSize: 13, minHeight: '1.2em' }}>
                {hint}
              </p>
            )}
          </div>

          {/* Body 2 */}
          <p className="font-display text-ink2" style={{ fontSize: 'clamp(15px, 1.8vw, 17px)', lineHeight: 1.6, fontWeight: 400 }}>
            Our hundred and twenty-six acres sit in the middle of this. An eighteen-acre lake with a dock that creaks in a good way. Six villas, spaced so your neighbor stays a rumor. A sauna above the water. A house at the far end for the people who brought everyone with them.
          </p>

          {/* Tagline */}
          <p className="font-display italic text-signal mt-8" style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.25rem)', lineHeight: 1.4 }}>
            No neon. No muzak. No app to download.
          </p>

          {/* CTA */}
          <div
            className="mt-9 transition-all duration-700"
            style={{ opacity: ctaVisible ? 1 : 0, transform: ctaVisible ? 'translateY(0)' : 'translateY(6px)', pointerEvents: ctaVisible ? 'auto' : 'none' }}
          >
            <button
              className="font-eyebrow font-light text-linen bg-signal hover:bg-signal2 transition-colors rounded-full px-9 py-3"
              style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase' }}
              onClick={() => setModalOpen(true)}
            >
              Ready? Let's talk →
            </button>
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
