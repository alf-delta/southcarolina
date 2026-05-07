import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN as string;

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
const PROPERTY_COORDS: [number, number] = [-80.042, 34.576];

const TOWNS = [
  { name: 'Cheraw, SC',        note: 'Nearest town',      time: '18 min',  coords: [-79.875, 34.700] as [number, number] },
  { name: 'Camden, SC',        note: 'Historic district', time: '32 min',  coords: [-80.607, 34.247] as [number, number] },
  { name: 'Florence, SC',      note: 'Regional center',   time: '45 min',  coords: [-79.763, 34.195] as [number, number] },
  { name: 'Columbia, SC',      note: 'State capital',     time: '1 hr',    coords: [-81.035, 33.999] as [number, number] },
  { name: 'Charlotte, NC',     note: 'Major city',        time: '1 hr 30', coords: [-80.843, 35.227] as [number, number] },
  { name: 'Raleigh-Durham, NC',note: 'Research triangle', time: '2 hr 30', coords: [-78.898, 35.994] as [number, number] },
];

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

const TIMER_SPEED_BASE = 1;
const TIMER_SPEED_SCROLL = 100;
const TIMER_CTA_THRESHOLD = 480;
const SCROLL_DECAY_MS = 280;

const hints = [
  'scroll to feel time move.',
  'keep going.',
  'still counting.',
  'rest used to be the default.',
  'then it became a reward.',
  'then an apology.',
  'the pines don\u2019t have a schedule.',
];

export default function LandStory() {
  const sectionRef = useRef<HTMLElement>(null);
  const accRef = useRef(0);
  const hoursRef = useRef(0);
  const speedRef = useRef(TIMER_SPEED_BASE);
  const lastTsRef = useRef<number | null>(null);
  const runningRef = useRef(false);
  const ctaShownRef = useRef(false); // kept for question text change logic
  const animIdRef = useRef(0);
  const lastScrollYRef = useRef(0);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const lastHintIdxRef = useRef(-1);
  const [displayHours, setDisplayHours] = useState<string>('—');
  const [shownHints, setShownHints] = useState<string[]>([]);
  const [question, setQuestion] = useState('When did you last slow down like this?');
  const [numFast, setNumFast] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [when, setWhen] = useState('');
  const [phoneError, setPhoneError] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const originMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const townsRef = useRef<HTMLDivElement>(null);
  const [activeMilestone, setActiveMilestone] = useState<number | null>(null);
  const [activeCity, setActiveCity] = useState<string | null>(null);
  const [hoveredCity, setHoveredCity] = useState<string | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;
    mapboxgl.accessToken = MAPBOX_TOKEN;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: PROPERTY_COORDS,
      zoom: 13.5,
      attributionControl: false,
      logoPosition: 'bottom-right',
    });

    mapRef.current = map;

    map.on('style.load', () => {
      map.addSource('route', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
      map.addLayer({ id: 'route-line', type: 'line', source: 'route', layout: { 'line-join': 'round', 'line-cap': 'round' }, paint: { 'line-color': '#B05329', 'line-width': 2.5, 'line-opacity': 0.8 } });

      const layers = map.getStyle().layers;
      layers.forEach(layer => {
        try {
          // Land / background
          if (layer.id === 'land' || layer.id === 'background') {
            map.setPaintProperty(layer.id, 'background-color', '#EAE3D3');
          }
          // Land fill polygons
          if (layer.type === 'fill') {
            const id = layer.id;
            if (id === 'water' || id.includes('water')) {
              map.setPaintProperty(id, 'fill-color', '#C9B898');
              map.setPaintProperty(id, 'fill-opacity', 0.6);
            } else if (id.includes('park') || id.includes('landuse') || id.includes('green') || id.includes('wood') || id.includes('forest')) {
              map.setPaintProperty(id, 'fill-color', 'rgba(62,79,58,0.14)');
            } else if (!id.includes('building') && !id.includes('tunnel')) {
              map.setPaintProperty(id, 'fill-color', '#EAE3D3');
            } else if (id.includes('building')) {
              map.setPaintProperty(id, 'fill-color', 'rgba(31,36,32,0.07)');
            }
          }
          // Roads & lines
          if (layer.type === 'line') {
            const id = layer.id;
            if (id.includes('road') || id.includes('street') || id.includes('path') || id.includes('transit')) {
              const isMajor = id.includes('motorway') || id.includes('trunk') || id.includes('primary');
              map.setPaintProperty(id, 'line-color', isMajor ? 'rgba(31,36,32,0.45)' : 'rgba(31,36,32,0.20)');
            } else if (id.includes('water')) {
              map.setPaintProperty(id, 'line-color', '#B8A888');
            }
          }
          // Labels
          if (layer.type === 'symbol') {
            map.setPaintProperty(layer.id, 'text-color', '#5A5650');
            map.setPaintProperty(layer.id, 'text-halo-color', '#EAE3D3');
            map.setPaintProperty(layer.id, 'text-halo-width', 1.2);
          }
        } catch (_) { /* skip layers that don't support the property */ }
      });
    });

    const el = document.createElement('div');
    el.style.cssText = 'width:14px;height:14px;border-radius:50%;background:#B05329;border:2px solid #EAE3D3;box-shadow:0 0 0 5px rgba(176,83,41,0.20)';
    new mapboxgl.Marker({ element: el }).setLngLat(PROPERTY_COORDS).addTo(map);

    map.scrollZoom.disable();
    map.addControl(new mapboxgl.NavigationControl({ showCompass: false }), 'bottom-right');

    return () => map.remove();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const frame = (ts: number) => {
      if (!lastTsRef.current) lastTsRef.current = ts;
      const dt = Math.min((ts - lastTsRef.current) / 1000, 0.1);
      lastTsRef.current = ts;

      accRef.current += speedRef.current * dt * 3.9;
      const h = Math.floor(accRef.current);
      const m = Math.floor((accRef.current - h) * 60);
      const totalMin = h * 60 + m;

      if (totalMin !== hoursRef.current) {
        hoursRef.current = totalMin;
        setDisplayHours(`${h}:${String(m).padStart(2, '0')}`);
      }

      if (h > 60 && h < TIMER_CTA_THRESHOLD) {
        const idx = Math.min(Math.floor((h - 60) / 60), hints.length - 1);
        if (idx > lastHintIdxRef.current) {
          lastHintIdxRef.current = idx;
          setShownHints(prev => [...prev, hints[idx]]);
        }
      }

      if (h >= TIMER_CTA_THRESHOLD && !ctaShownRef.current) {
        ctaShownRef.current = true;
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
      lastHintIdxRef.current = -1;
      setDisplayHours('0:00');
      setShownHints([]);
      animIdRef.current = requestAnimationFrame(frame);
    };

    const landEl = document.getElementById('land');
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startTimer();
        observer.disconnect();
      }
    }, { threshold: 0.1 });

    observer.observe(landEl ?? section);

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

  const resetRoute = () => {
    const map = mapRef.current;
    if (!map || !map.getSource('route')) return;
    setActiveCity(null);
    (map.getSource('route') as mapboxgl.GeoJSONSource).setData({ type: 'FeatureCollection', features: [] });
    originMarkerRef.current?.remove();
    originMarkerRef.current = null;
    map.flyTo({ center: PROPERTY_COORDS, zoom: 13.5, duration: 1000 });
  };

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (activeCity && townsRef.current && !townsRef.current.contains(e.target as Node)) {
        resetRoute();
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, [activeCity]);

  const showRoute = async (town: typeof TOWNS[0]) => {
    const map = mapRef.current;
    if (!map || !map.getSource('route')) return;

    if (activeCity === town.name) {
      resetRoute();
      return;
    }

    setActiveCity(town.name);
    setRouteLoading(true);
    try {
      const res = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${town.coords[0]},${town.coords[1]};${PROPERTY_COORDS[0]},${PROPERTY_COORDS[1]}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`
      );
      const data = await res.json();
      const geometry = data.routes?.[0]?.geometry;
      if (!geometry) return;

      (map.getSource('route') as mapboxgl.GeoJSONSource).setData({ type: 'Feature', properties: {}, geometry });

      originMarkerRef.current?.remove();
      const el = document.createElement('div');
      el.style.cssText = 'width:10px;height:10px;border-radius:50%;background:#5A5650;border:2px solid #EAE3D3;box-shadow:0 0 0 3px rgba(90,86,80,0.18)';
      originMarkerRef.current = new mapboxgl.Marker({ element: el }).setLngLat(town.coords).addTo(map);

      const bounds = new mapboxgl.LngLatBounds();
      bounds.extend(town.coords);
      bounds.extend(PROPERTY_COORDS);
      map.fitBounds(bounds, { padding: 56, duration: 1100, maxZoom: 12 });
    } catch (_) {
      setActiveCity(null);
    } finally {
      setRouteLoading(false);
    }
  };

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
        <div style={{ display: 'grid', gridTemplateColumns: 'clamp(120px, 15vw, 172px) 1fr', gap: 'clamp(32px, 5vw, 72px)', alignItems: 'start' }}>

          {/* Left — label + timer square */}
          <div style={{ position: 'sticky', top: '88px' }}>
            <p className="font-eyebrow font-light text-ink2 mb-3" style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase' }}>
              hours since your<br />last real rest
            </p>
            <div style={{
              width: '100%',
              aspectRatio: '1 / 1',
              background: '#1A1F1B',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '14px 16px',
            }}>
              <span className="font-eyebrow font-light" style={{ fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', display: 'block', marginBottom: 6, color: 'rgba(231,222,199,0.45)' }}>hr : min</span>
              <span
                className={`font-display transition-opacity duration-300 ${numFast ? 'opacity-50' : ''}`}
                style={{ fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 400, lineHeight: 1, color: '#E7DEC7' }}
              >
                {displayHours}
              </span>
            </div>
            {shownHints.length > 0 && (
              <div className="mt-4">
                <AnimatePresence>
                  {shownHints.map((line, i) => (
                    <motion.p
                      key={i}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                      className="font-eyebrow italic"
                      style={{ fontSize: 10, letterSpacing: '0.06em', lineHeight: 1.75, color: `rgba(90,86,80,${0.28 + i * 0.08})` }}
                    >
                      {line}
                    </motion.p>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Right — Text column (inner 2-col: accordion left, text+CTA right) */}
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 0.9fr)', gap: 'clamp(24px, 3.5vw, 52px)', alignItems: 'start' }}>

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

            {/* Right inner — question + body2 + tagline + CTA (sticky, unaffected by accordion) */}
            <div style={{ position: 'sticky', top: '108px' }}>
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
                    {question.includes('feeling') ? (
                      <>
                        We know the{' '}
                        <span style={feelingTextStyle}>feeling</span>
                        . The{' '}
                        <span style={landTextStyle}>land</span>
                        {' '}is ready when you are.
                      </>
                    ) : question}
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
        </div>

        {/* ── Map + nearby towns ─────────────────────────────────────────── */}
        <div style={{ marginTop: 'clamp(24px, 3.5vh, 40px)', borderTop: '1px solid rgba(31,36,32,0.10)', paddingTop: 'clamp(28px, 4vh, 48px)' }}>
          <p className="font-eyebrow text-ink2 mb-8" style={{ fontSize: 13, letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600 }}>
            Getting here
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.55fr) minmax(0, 1fr)', gap: 'clamp(28px, 5vw, 64px)', alignItems: 'stretch' }}>

            {/* Map + button */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                flex: 1,
                boxShadow: '0 20px 60px rgba(31,36,32,0.18), 0 8px 24px rgba(31,36,32,0.10)',
              }}>
                <div ref={mapContainerRef} style={{ position: 'absolute', inset: 0 }} />
              </div>
              <a
                href="https://www.google.com/maps/dir/?api=1&destination=423+Woodmen+Rd,+Patrick+SC+29584"
                target="_blank"
                rel="noopener noreferrer"
                className="font-eyebrow text-linen bg-signal hover:bg-signal2 transition-colors rounded-full inline-flex items-center gap-2 mt-4"
                style={{ fontSize: 13, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 300, padding: '13px 28px', textDecoration: 'none' }}
              >
                Get directions ↗
              </a>
            </div>

            {/* Towns list */}
            <div ref={townsRef}>
              {TOWNS.map((t, i) => {
                const isActive = activeCity === t.name;
                return (
                  <button
                    key={t.name}
                    onClick={() => showRoute(t)}
                    onMouseEnter={() => setHoveredCity(t.name)}
                    onMouseLeave={() => setHoveredCity(null)}
                    disabled={routeLoading && !isActive}
                    className="group"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto auto',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      textAlign: 'left',
                      background: isActive ? 'rgba(176,83,41,0.06)' : hoveredCity === t.name ? 'rgba(176,83,41,0.04)' : 'rgba(255,255,255,0.5)',
                      border: `1px solid rgba(31,36,32,${isActive ? '0.14' : '0.08'})`,
                      borderLeft: `3px solid ${isActive ? '#B05329' : hoveredCity === t.name ? 'rgba(176,83,41,0.45)' : 'rgba(176,83,41,0.15)'}`,
                      borderRadius: 10,
                      paddingLeft: 12,
                      paddingRight: 10,
                      paddingTop: 'clamp(10px, 1.4vh, 16px)',
                      paddingBottom: 'clamp(10px, 1.4vh, 16px)',
                      marginBottom: 6,
                      cursor: routeLoading && !isActive ? 'default' : 'pointer',
                      transition: 'opacity 0.2s, border-color 0.25s, background 0.2s',
                      opacity: routeLoading && !isActive ? 0.4 : 1,
                    }}
                  >
                    <div>
                      <span className="font-display group-hover:text-signal transition-colors duration-200" style={{ fontSize: 'clamp(1rem, 1.5vw, 1.15rem)', fontWeight: 400, lineHeight: 1.2, display: 'block', color: isActive ? '#B05329' : '#1F2420' }}>
                        {t.name}
                      </span>
                      <span className="font-eyebrow font-light" style={{ fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase', color: isActive ? 'rgba(176,83,41,0.6)' : 'rgba(90,86,80,0.45)', transition: 'color 0.25s' }}>
                        {isActive ? 'Route shown ↩' : t.note}
                      </span>
                    </div>
                    <span className="font-eyebrow font-light" style={{ fontSize: 11, letterSpacing: '0.14em', whiteSpace: 'nowrap', color: isActive ? '#B05329' : 'rgba(90,86,80,0.55)', transition: 'color 0.25s' }}>
                      {t.time}
                    </span>
                    <span className="font-eyebrow text-signal/30 group-hover:text-signal group-hover:translate-x-0.5 transition-all duration-200" style={{ fontSize: 13 }}>
                      →
                    </span>
                  </button>
                );
              })}
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
