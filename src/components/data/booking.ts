// ── Cloudbeds booking ─────────────────────────────────────────────────────────
// We never link to the bare reservation page (it looks broken and kills the
// funnel). Every booking CTA opens a date-picker modal, then hands off to
// Cloudbeds with checkin/checkout pre-filled so the user lands on the nicer
// date view.

export const CLOUDBEDS_RESERVATION_URL = 'https://us2.cloudbeds.com/en/reservation/Dc79Gd/';

export const MAX_GUESTS = 4;
export const MIN_NIGHTS = 2;

/** Local YYYY-MM-DD (avoids the UTC day-shift that toISOString causes). */
export function fmtIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function buildBookingUrl(checkin: Date, checkout: Date, currency = 'usd'): string {
  const params = new URLSearchParams({
    currency,
    checkin: fmtIso(checkin),
    checkout: fmtIso(checkout),
  });
  return `${CLOUDBEDS_RESERVATION_URL}?${params.toString()}`;
}

/** Fire from any booking button to open the global booking modal. */
export const openBooking = () => window.dispatchEvent(new CustomEvent('open-booking'));
