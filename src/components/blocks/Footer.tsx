import { useState } from 'react';

const cols = [
  {
    title: 'Stay',
    links: [
      { label: 'The Boxble', href: '#stays' },
      { label: 'The House', href: '#stays' },
      { label: 'Rates & Availability', href: '#reserve' },
      { label: 'Gift Cards', href: '#' },
    ],
  },
  {
    title: 'Explore',
    links: [
      { label: 'The Land', href: '#land' },
      { label: 'Activities', href: '#day' },
      { label: 'Dining', href: '#table' },
      { label: 'Gallery', href: '#gallery' },
    ],
  },
  {
    title: 'Plan',
    links: [
      { label: 'Getting Here', href: '#' },
      { label: 'FAQ', href: '#' },
      { label: 'Events & Buyouts', href: '#' },
      { label: 'Press Inquiries', href: '#' },
    ],
  },
  {
    title: 'Connect',
    links: [
      { label: 'Instagram', href: '#' },
      { label: 'Newsletter', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
];

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer data-zone="dark" className="bg-nightWarm text-linen/70 pt-16 pb-10 px-6">
      <div className="max-w-content mx-auto">
        <div className="mb-12 pb-12 border-b border-linen/10">
          <p className="eyebrow text-linen/40 mb-3">The occasional letter</p>
          <p className="font-display font-light text-linen text-xl mb-6"
            style={{ fontVariationSettings: '"SOFT" 30, "opsz" 24', letterSpacing: '-0.01em' }}>
            Season notes, availability, and what the pines look like this month.
          </p>
          <form
            onSubmit={(e) => { e.preventDefault(); setEmail(''); }}
            className="flex flex-col sm:flex-row gap-3 max-w-md"
          >
            <label htmlFor="footer-email" className="sr-only">Email address</label>
            <input
              id="footer-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1 bg-linen/10 border border-linen/20 text-linen placeholder-linen/40 px-4 py-3 text-sm focus-visible:ring-2 focus-visible:ring-signal outline-none"
              required
            />
            <button
              type="submit"
              className="eyebrow bg-signal text-linen px-6 py-3 hover:bg-signal2 transition-colors focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 focus-visible:ring-offset-nightWarm outline-none"
            >
              Subscribe
            </button>
          </form>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {cols.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-linen/40 mb-5">{col.title}</p>
              <ul className="space-y-3 list-none p-0 m-0">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-linen/60 text-sm hover:text-linen transition-colors focus-visible:outline-none focus-visible:text-linen">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-linen/10">
          <a href="#" className="font-display font-light text-linen text-xl"
            style={{ fontVariationSettings: '"SOFT" 50, "opsz" 36', letterSpacing: '-0.02em' }}>
            Horizons Sandhills
          </a>
          <p className="text-linen/40 text-sm">© 2025 Horizons Hospitality. McBee, South Carolina.</p>
        </div>
      </div>
    </footer>
  );
}
