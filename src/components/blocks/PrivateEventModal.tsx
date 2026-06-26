import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

/** Fire from any private-hire / corporate CTA to open the inquiry form. */
export const openPrivateEvent = () => window.dispatchEvent(new CustomEvent('open-private-event'));

const ACCENT = '#2E6AB5';

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

export default function PrivateEventModal() {
  const [open, setOpen] = useState(false);
  const [company, setCompany] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [guests, setGuests] = useState('');
  const [details, setDetails] = useState('');
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(false);

  useEffect(() => {
    const onOpen = () => { setDone(false); setOpen(true); };
    window.addEventListener('open-private-event', onOpen);
    return () => window.removeEventListener('open-private-event', onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const submit = () => {
    if (!company || !name || !email) { setErr(true); setTimeout(() => setErr(false), 1200); return; }
    setDone(true);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[400] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
          style={{ background: 'rgba(20,18,14,0.72)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <motion.div
            className="relative w-full bg-bone"
            style={{ maxWidth: 440, borderRadius: 4 }}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-ink2 hover:text-ink transition-colors" style={{ fontSize: 22, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center px-10 py-14">
                  <p className="font-display italic mb-2" style={{ fontSize: '1.5rem', color: ACCENT }}>Request received.</p>
                  <p className="font-eyebrow font-light text-ink2" style={{ fontSize: 12, letterSpacing: '0.1em' }}>We'll put together a proposal and reach out within 48 hours.</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-8 py-10">
                  <div className="flex items-center gap-3 mb-1">
                    <span style={{ width: 28, height: 2, background: ACCENT, flexShrink: 0 }} />
                    <span className="font-eyebrow font-light" style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: ACCENT }}>Private hire</span>
                  </div>
                  <p className="font-display italic text-ink mb-1" style={{ fontSize: '1.4rem', lineHeight: 1.25 }}>Plan your private getaway.</p>
                  <p className="font-eyebrow font-light text-ink2 mb-7" style={{ fontSize: 12, letterSpacing: '0.1em' }}>Full-property buyouts, team retreats, celebrations & events.</p>
                  <Field label="Company / Group" ph="Company or group name" val={company} set={setCompany} err={err && !company} />
                  <Field label="Your name"      ph="First and last"    val={name}    set={setName}    err={err && !name} />
                  <Field label="Work email"     type="email" ph="you@company.com" val={email} set={setEmail} err={err && !email} />
                  <Field label="Estimated guests" type="number" ph="e.g. 40" val={guests} set={setGuests} />
                  <Field label="Tell us more"   ph="Dates, headcount, what you have in mind…" val={details} set={setDetails} multiline />
                  <button onClick={submit} className="w-full font-eyebrow font-light text-white hover:brightness-110 transition-all py-3 mt-1" style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', borderRadius: 0, border: 'none', cursor: 'pointer', background: ACCENT }}>
                    Send request →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
