import { motion, useInView, useReducedMotion, AnimatePresence } from 'framer-motion';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Button from '../primitives/Button';

interface Props {
  bigType: string;
  headline: string;
  sub: string;
  image: string;
}

export default function FinalCtaImmersive({ bigType, headline, sub, image }: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-20%' });
  const reduceMotion = useReducedMotion();
  const [questionOpen, setQuestionOpen] = useState(false);
  const [corpOpen, setCorpOpen] = useState(false);

  return (
    <>
      <section
        ref={ref}
        id="reserve"
        data-zone="dark"
        className="relative min-h-[67vh] md:min-h-screen overflow-hidden flex flex-col bg-night"
      >
        {/* Background blurred */}
        <img
          src={image}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: 'brightness(0.45) saturate(0.7) blur(2px)' }}
          loading="lazy"
          width={2400}
          height={1600}
        />

        {/* WAITING watermark */}
        <motion.div
          className="absolute inset-0 flex justify-center z-[1] pointer-events-none"
          style={{ alignItems: 'flex-start', paddingTop: '12%', mixBlendMode: 'soft-light' }}
          initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="font-display text-center leading-[0.88] whitespace-nowrap"
            style={{
              fontSize: 'clamp(48px, 14vw, 220px)',
              fontWeight: 200,
              letterSpacing: '-0.04em',
              fontVariationSettings: '"SOFT" 70, "opsz" 144',
              color: 'rgba(255, 248, 235, 1)',
              filter: 'drop-shadow(0 0 80px rgba(255, 240, 200, 0.7)) drop-shadow(0 0 20px rgba(255,230,170,0.5))',
            }}
            aria-hidden="true"
          >
            {bigType}
          </p>
        </motion.div>

        {/* Sharp foreground image */}
        <img
          src={image}
          alt="Longleaf pine forest"
          className="absolute inset-0 w-full h-full object-cover z-[2] mask-bottom"
          style={{ filter: 'brightness(1) saturate(1.05)' }}
          loading="lazy"
          width={2400}
          height={1600}
        />

        <div className="flex-1" />

        {/* Content */}
        <motion.div
          className="relative z-[4] text-center px-6 pb-14 md:pb-32"
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2
            className="font-display font-light text-linen text-[clamp(22px,4vw,52px)] mb-2 max-w-2xl mx-auto"
            style={{ fontVariationSettings: '"SOFT" 40, "opsz" 72', letterSpacing: '-0.025em' }}
          >
            {headline}
          </h2>
          {sub && <p className="text-linen/70 mb-8 text-base md:text-lg">{sub}</p>}

          {/* Row 1 */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-3">
            <Button href="#" variant="primary">Check Availability</Button>
            <Button href="tel:+18035550180" variant="ghost-light" className="backdrop-blur-md">Call Us</Button>
          </div>

          {/* Row 2 — stacked, centered */}
          <div className="flex flex-col items-center gap-3 mt-1">
            <button
              onClick={() => setQuestionOpen(true)}
              className="font-eyebrow font-light text-ink hover:text-ink border border-linen/80 hover:border-linen backdrop-blur-md transition-all duration-300 rounded-full px-9 py-3"
              style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', background: 'rgba(231,222,199,0.92)', cursor: 'pointer' }}
            >
              I still have a question
            </button>
            <button
              onClick={() => setCorpOpen(true)}
              className="font-eyebrow font-light text-white hover:brightness-110 transition-all duration-300 rounded-full px-9 py-3"
              style={{ fontSize: 12, letterSpacing: '0.22em', textTransform: 'uppercase', background: '#2E6AB5', cursor: 'pointer' }}
            >
              Corporate quotation
            </button>
          </div>
        </motion.div>
      </section>

      {createPortal(
        <AnimatePresence>
          {questionOpen && <QuestionModal onClose={() => setQuestionOpen(false)} />}
        </AnimatePresence>,
        document.body
      )}
      {createPortal(
        <AnimatePresence>
          {corpOpen && <CorpModal onClose={() => setCorpOpen(false)} />}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

// ── Shared modal shell ─────────────────────────────────────────────────────────

function ModalShell({ onClose, children }: { onClose: () => void; children: React.ReactNode }) {
  return (
    <motion.div
      className="fixed inset-0 z-[400] flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
      style={{ background: 'rgba(20,18,14,0.72)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        className="relative w-full bg-bone"
        style={{ maxWidth: 440, borderRadius: 4 }}
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-ink2 hover:text-ink transition-colors" style={{ fontSize: 22, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
        {children}
      </motion.div>
    </motion.div>
  );
}

function Field({ label, type, ph, val, set, err, multiline }: { label: string; type?: string; ph: string; val: string; set: (v: string) => void; err?: boolean; multiline?: boolean }) {
  const cls = `w-full bg-boneWarm text-ink font-eyebrow font-light text-sm px-3 py-2.5 outline-none border transition-colors ${err ? 'border-signal' : 'border-divider focus:border-signal'}`;
  return (
    <div className="mb-4">
      <label className="block font-eyebrow font-light text-ink2 mb-1" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{label}</label>
      {multiline
        ? <textarea value={val} onChange={e => set(e.target.value)} placeholder={ph} rows={4} className={`${cls} resize-none`} style={{ borderRadius: 0 }} />
        : <input type={type ?? 'text'} value={val} onChange={e => set(e.target.value)} placeholder={ph} className={cls} style={{ borderRadius: 0 }} />
      }
    </div>
  );
}

// ── "I still have a question" modal ───────────────────────────────────────────

function QuestionModal({ onClose }: { onClose: () => void }) {
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [question, setQuestion] = useState('');
  const [done, setDone]         = useState(false);
  const [err, setErr]           = useState(false);

  const submit = () => {
    if (!name || !email || !question) { setErr(true); setTimeout(() => setErr(false), 1200); return; }
    setDone(true);
  };

  return (
    <ModalShell onClose={onClose}>
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center px-10 py-14">
            <p className="font-display italic text-signal mb-2" style={{ fontSize: '1.5rem' }}>Answer on its way.</p>
            <p className="font-eyebrow font-light text-ink2" style={{ fontSize: 12, letterSpacing: '0.1em' }}>We respond within 24 hours.</p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-8 py-10">
            <p className="font-display italic text-ink mb-1" style={{ fontSize: '1.4rem', lineHeight: 1.25 }}>Ask us anything.</p>
            <p className="font-eyebrow font-light text-ink2 mb-5" style={{ fontSize: 12, letterSpacing: '0.1em' }}>We respond within 24 hours.</p>

            {/* FAQ nudge */}
            <a
              href="/faq"
              className="flex items-center justify-between w-full mb-6 px-4 py-3 rounded-sm transition-colors hover:bg-boneWarm"
              style={{ background: 'rgba(212,200,180,0.25)', border: '1px solid rgba(212,200,180,0.6)', textDecoration: 'none' }}
            >
              <div>
                <span className="font-eyebrow font-light block" style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#5A5650' }}>Before you ask</span>
                <span className="font-display text-ink" style={{ fontSize: '0.95rem' }}>Browse our FAQ →</span>
              </div>
              <span className="font-eyebrow text-signal/50" style={{ fontSize: 18 }}>?</span>
            </a>

            <Field label="Your name"     ph="First name"        val={name}     set={setName}     err={err && !name} />
            <Field label="Email address" type="email" ph="you@example.com" val={email} set={setEmail} err={err && !email} />
            <Field label="Your question" ph="What would you like to know?" val={question} set={setQuestion} err={err && !question} multiline />
            <button onClick={submit} className="w-full font-eyebrow font-light text-linen bg-signal hover:bg-signal2 transition-colors py-3 mt-1" style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', borderRadius: 0, border: 'none', cursor: 'pointer' }}>
              Send my question →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalShell>
  );
}

// ── Corporate quotation modal ──────────────────────────────────────────────────

function CorpModal({ onClose }: { onClose: () => void }) {
  const [company, setCompany]   = useState('');
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [guests, setGuests]     = useState('');
  const [details, setDetails]   = useState('');
  const [done, setDone]         = useState(false);
  const [err, setErr]           = useState(false);

  const submit = () => {
    if (!company || !name || !email) { setErr(true); setTimeout(() => setErr(false), 1200); return; }
    setDone(true);
  };

  return (
    <ModalShell onClose={onClose}>
      <AnimatePresence mode="wait">
        {done ? (
          <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center px-10 py-14">
            <p className="font-display italic mb-2" style={{ fontSize: '1.5rem', color: '#2E6AB5' }}>Request received.</p>
            <p className="font-eyebrow font-light text-ink2" style={{ fontSize: 12, letterSpacing: '0.1em' }}>We'll put together a proposal and reach out within 48 hours.</p>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-8 py-10">
            <div className="flex items-center gap-3 mb-1">
              <span style={{ width: 28, height: 2, background: '#2E6AB5', flexShrink: 0 }} />
              <span className="font-eyebrow font-light" style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: '#2E6AB5' }}>Corporate</span>
            </div>
            <p className="font-display italic text-ink mb-1" style={{ fontSize: '1.4rem', lineHeight: 1.25 }}>Request a quotation.</p>
            <p className="font-eyebrow font-light text-ink2 mb-7" style={{ fontSize: 12, letterSpacing: '0.1em' }}>Full-property buyouts, team retreats, executive offsites.</p>
            <Field label="Company"        ph="Company name"      val={company} set={setCompany} err={err && !company} />
            <Field label="Your name"      ph="First and last"    val={name}    set={setName}    err={err && !name} />
            <Field label="Work email"     type="email" ph="you@company.com" val={email} set={setEmail} err={err && !email} />
            <Field label="Estimated guests" type="number" ph="e.g. 12" val={guests} set={setGuests} />
            <Field label="Tell us more"   ph="Dates, needs, questions…" val={details} set={setDetails} multiline />
            <button onClick={submit} className="w-full font-eyebrow font-light text-white hover:brightness-110 transition-all py-3 mt-1" style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', borderRadius: 0, border: 'none', cursor: 'pointer', background: '#2E6AB5' }}>
              Send quotation request →
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </ModalShell>
  );
}
