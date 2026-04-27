import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Users, X } from 'lucide-react';

interface Props {
  propertyId: string;
  roomTypeId?: string;
  maxGuests: number;
  priceFrom: number;
}

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function fmtIso(d: Date) {
  return d.toISOString().slice(0, 10);
}

function fmtShort(d: Date | null) {
  if (!d) return null;
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function calDays(year: number, month: number): (Date | null)[] {
  const firstDow = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = Array(firstDow).fill(null);
  for (let d = 1; d <= total; d++) days.push(new Date(year, month, d));
  return days;
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function addDays(d: Date, n: number) {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

export default function BookingWidget({ propertyId, roomTypeId, maxGuests, priceFrom }: Props) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [pickMode, setPickMode] = useState<'in' | 'out' | null>(null);
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [hover, setHover] = useState<Date | null>(null);
  const [cal, setCal] = useState(() => ({ year: today.getFullYear(), month: today.getMonth() }));

  const calRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (calRef.current && !calRef.current.contains(e.target as Node)) {
        setPickMode(null);
        setHover(null);
      }
      if (guestsRef.current && !guestsRef.current.contains(e.target as Node)) {
        setGuestsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const prevMonth = () => setCal(c => {
    const d = new Date(c.year, c.month - 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });
  const nextMonth = () => setCal(c => {
    const d = new Date(c.year, c.month + 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const MIN_NIGHTS = 2;

  const handleDayClick = (d: Date) => {
    if (pickMode === 'in') {
      setCheckIn(d);
      setCheckOut(null);
      setPickMode('out');
    } else if (pickMode === 'out' && checkIn) {
      if (d <= checkIn) {
        setCheckIn(d);
        setCheckOut(null);
        return;
      }
      setCheckOut(d);
      setPickMode(null);
      setHover(null);
    }
  };

  const clearDates = () => {
    setCheckIn(null);
    setCheckOut(null);
    setPickMode('in');
    setHover(null);
  };

  const nights = checkIn && checkOut
    ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000)
    : null;

  const buildUrl = () => {
    const params = new URLSearchParams({
      adults: String(adults),
      children: String(children),
    });
    if (checkIn) params.set('checkin', fmtIso(checkIn));
    if (checkOut) params.set('checkout', fmtIso(checkOut));
    if (roomTypeId) params.set('roomtype_id', roomTypeId);
    return `https://hotels.cloudbeds.com/reservation/${propertyId}?${params}`;
  };

  const days = calDays(cal.year, cal.month);
  const rangeEnd = checkOut ?? hover;
  const calPrevDisabled =
    cal.year === today.getFullYear() && cal.month === today.getMonth();

  return (
    <div>
      {/* Price row */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-baseline gap-1.5">
          <span
            className="font-display font-light text-ink text-[clamp(28px,3vw,40px)]"
            style={{ letterSpacing: '-0.02em' }}
          >
            ${priceFrom}
          </span>
          <span className="font-eyebrow text-sm text-ink2">/ night</span>
        </div>
        <span className="font-eyebrow text-xs text-ink2/50">2-night min</span>
      </div>

      {/* Date fields */}
      <div ref={calRef} className="relative mb-0">
        <div className="grid grid-cols-2 border border-divider rounded-t-xl overflow-hidden">
          <button
            onClick={() => { setPickMode('in'); setGuestsOpen(false); }}
            className={`p-3.5 border-r border-divider text-left transition-colors focus:outline-none ${
              pickMode === 'in' ? 'bg-bone' : 'hover:bg-bone/60'
            }`}
          >
            <p className="font-eyebrow text-[10px] text-ink2 uppercase tracking-widest mb-1">Check-in</p>
            <p className={`font-eyebrow text-sm font-medium ${checkIn ? 'text-ink' : 'text-ink/35'}`}>
              {fmtShort(checkIn) ?? 'Add date'}
            </p>
          </button>
          <button
            onClick={() => { setPickMode(checkIn ? 'out' : 'in'); setGuestsOpen(false); }}
            className={`p-3.5 text-left transition-colors focus:outline-none ${
              pickMode === 'out' ? 'bg-bone' : 'hover:bg-bone/60'
            }`}
          >
            <p className="font-eyebrow text-[10px] text-ink2 uppercase tracking-widest mb-1">Checkout</p>
            <p className={`font-eyebrow text-sm font-medium ${checkOut ? 'text-ink' : 'text-ink/35'}`}>
              {fmtShort(checkOut) ?? 'Add date'}
            </p>
          </button>
        </div>

        {/* Calendar popover */}
        {pickMode && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-divider rounded-2xl shadow-2xl z-40 p-4 select-none">
            {/* Month nav */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevMonth}
                disabled={calPrevDisabled}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bone transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={16} strokeWidth={1.5} />
              </button>
              <p className="font-eyebrow text-xs text-ink uppercase tracking-widest">
                {MONTH_NAMES[cal.month]} {cal.year}
              </p>
              <button
                onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-bone transition-colors"
              >
                <ChevronRight size={16} strokeWidth={1.5} />
              </button>
            </div>

            {/* Day labels */}
            <div className="grid grid-cols-7 mb-1">
              {DAY_LABELS.map(l => (
                <div key={l} className="text-center font-eyebrow text-[10px] text-ink2/40 py-1">{l}</div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7">
              {days.map((d, i) => {
                if (!d) return <div key={`empty-${i}`} />;

                const isPast = d < today;
                const isCheckIn = checkIn && sameDay(d, checkIn);
                const isCheckOut = checkOut && sameDay(d, checkOut);
                const isSelected = isCheckIn || isCheckOut;
                const inRange = checkIn && rangeEnd && d > checkIn && d < rangeEnd;
                const isToday = sameDay(d, today);

                // Disable: past days, and when picking checkout — days that would give < 2 nights
                const tooClose = pickMode === 'out' && checkIn && d <= addDays(checkIn, MIN_NIGHTS - 1);
                const disabled = isPast || !!tooClose;

                // Shape the range highlight: round left edge on checkIn, round right on checkOut
                const isRangeStart = checkIn && sameDay(d, checkIn) && !!rangeEnd && rangeEnd > checkIn;
                const isRangeEnd = rangeEnd && sameDay(d, rangeEnd) && checkIn && rangeEnd > checkIn;

                return (
                  <div
                    key={fmtIso(d)}
                    className={`relative h-9 flex items-center justify-center ${
                      inRange ? 'bg-signal/8' : ''
                    } ${isRangeStart ? 'rounded-l-full' : ''} ${isRangeEnd ? 'rounded-r-full' : ''}`}
                  >
                    <button
                      disabled={disabled}
                      onClick={() => !disabled && handleDayClick(d)}
                      onMouseEnter={() => !disabled && pickMode === 'out' && setHover(d)}
                      onMouseLeave={() => setHover(null)}
                      className={`
                        w-8 h-8 rounded-full text-center font-eyebrow text-xs transition-colors focus:outline-none
                        ${disabled ? 'text-ink/20 cursor-not-allowed' : 'cursor-pointer'}
                        ${isSelected ? 'bg-signal text-linen font-semibold' : ''}
                        ${!isSelected && !disabled && inRange ? 'text-ink' : ''}
                        ${!isSelected && !disabled && !inRange ? 'hover:bg-signal/10 text-ink' : ''}
                        ${isToday && !isSelected ? 'ring-1 ring-signal/40' : ''}
                      `}
                    >
                      {d.getDate()}
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-divider/60">
              <p className="font-eyebrow text-[10px] text-ink2/40">
                {pickMode === 'in' ? 'Select check-in' : `Select checkout · ${MIN_NIGHTS}-night min`}
              </p>
              {(checkIn || checkOut) && (
                <button
                  onClick={clearDates}
                  className="flex items-center gap-1 font-eyebrow text-[10px] text-ink2/60 hover:text-ink transition-colors"
                >
                  <X size={10} />
                  Clear
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Guests field */}
      <div ref={guestsRef} className="relative">
        <button
          onClick={() => { setGuestsOpen(v => !v); setPickMode(null); setHover(null); }}
          className={`w-full border-x border-b border-divider rounded-b-xl p-3.5 flex items-center justify-between transition-colors focus:outline-none ${
            guestsOpen ? 'bg-bone' : 'hover:bg-bone/60'
          }`}
        >
          <div className="text-left">
            <p className="font-eyebrow text-[10px] text-ink2 uppercase tracking-widest mb-1">Guests</p>
            <p className="font-eyebrow text-sm font-medium text-ink">
              {adults + children} guest{adults + children !== 1 ? 's' : ''}
              {children > 0 ? ` · ${children} child${children > 1 ? 'ren' : ''}` : ''}
            </p>
          </div>
          <Users size={15} strokeWidth={1.5} className="text-ink2/60 shrink-0" />
        </button>

        {/* Guests dropdown */}
        {guestsOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-divider rounded-2xl shadow-2xl z-40 p-5">
            {([
              { label: 'Adults', sub: 'Ages 13+', value: adults, set: setAdults, min: 1, max: maxGuests },
              { label: 'Children', sub: 'Ages 2–12', value: children, set: setChildren, min: 0, max: Math.max(0, maxGuests - adults) },
            ] as const).map(({ label, sub, value, set, min, max }, idx, arr) => (
              <div
                key={label}
                className={`flex items-center justify-between ${idx < arr.length - 1 ? 'pb-4 mb-4 border-b border-divider/60' : ''}`}
              >
                <div>
                  <p className="font-eyebrow text-sm text-ink">{label}</p>
                  <p className="font-eyebrow text-[10px] text-ink2/60 mt-0.5">{sub}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => set((v: number) => Math.max(min, v - 1))}
                    disabled={value <= min}
                    className="w-8 h-8 rounded-full border border-divider flex items-center justify-center text-ink2 text-lg leading-none hover:border-ink hover:text-ink disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                  >
                    −
                  </button>
                  <span className="font-eyebrow text-sm text-ink w-4 text-center tabular-nums">{value}</span>
                  <button
                    onClick={() => set((v: number) => Math.min(max, v + 1))}
                    disabled={value >= max}
                    className="w-8 h-8 rounded-full border border-divider flex items-center justify-center text-ink2 text-lg leading-none hover:border-ink hover:text-ink disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
            <p className="font-eyebrow text-[10px] text-ink2/40 text-center mt-1">
              Max {maxGuests} guests
            </p>
          </div>
        )}
      </div>

      {/* Night summary + CTA */}
      <div className="mt-4 space-y-3">
        {nights && nights > 0 && (
          <div className="flex justify-between font-eyebrow text-xs text-ink2">
            <span>${priceFrom.toLocaleString()} × {nights} night{nights !== 1 ? 's' : ''}</span>
            <span className="text-ink font-medium">${(priceFrom * nights).toLocaleString()}</span>
          </div>
        )}
        <a
          href={buildUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full text-center bg-signal hover:bg-signal2 active:scale-[0.98] text-linen font-eyebrow text-xs uppercase tracking-widest py-3.5 rounded-xl transition-all duration-200"
        >
          {checkIn && checkOut ? 'Reserve' : 'Check Availability'}
        </a>
        <p className="font-eyebrow text-xs text-ink2/50 text-center">Free cancellation · 14 days out</p>
      </div>
    </div>
  );
}
