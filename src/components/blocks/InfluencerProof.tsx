import { motion } from 'framer-motion';

const POSTS = [
  {
    handle: '@placeholder_one',
    followers: '48k',
    caption: 'Spent three days here and barely touched my phone. The sauna at dawn, the lake completely to yourself — this is the reset I didn\'t know I needed.',
    image: '/images/sandhills/sauna_session.webp',
    platform: 'instagram',
  },
  {
    handle: '@placeholder_two',
    followers: '112k',
    caption: 'No crowds, no agenda. Just pines, a private lake, and the best breakfast I\'ve made in years from a pantry stocked before we arrived.',
    image: '/images/sandhills/canoes.webp',
    platform: 'instagram',
  },
  {
    handle: '@placeholder_three',
    followers: '29k',
    caption: 'The e-bike trails through longleaf pine are genuinely one of the most beautiful things I\'ve experienced in the Carolinas.',
    image: '/images/sandhills/twelve_miles.webp',
    platform: 'instagram',
  },
  {
    handle: '@placeholder_four',
    followers: '67k',
    caption: 'Woke up to mist on the lake and absolute silence. 126 acres and it felt like it was all ours — because it was.',
    image: '/images/sandhills/Forest_bathing_walk.webp',
    platform: 'instagram',
  },
] as const;

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
    </svg>
  );
}

export default function InfluencerProof() {
  return (
    <section
      data-zone="dark"
      style={{ background: '#161B17', paddingTop: 'clamp(52px, 8vh, 96px)', paddingBottom: 'clamp(52px, 8vh, 96px)' }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 clamp(20px, 4vw, 64px)' }}>

        {/* Header */}
        <div style={{ marginBottom: 'clamp(28px, 4vh, 48px)' }}>
          <p
            style={{
              fontFamily: 'Inter Tight, Inter, system-ui, sans-serif',
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.26em',
              textTransform: 'uppercase',
              color: '#B05329',
              marginBottom: 12,
            }}
          >
            As seen by
          </p>
          <h2
            className="font-display"
            style={{
              fontVariationSettings: '"opsz" 72, "SOFT" 40',
              fontWeight: 350,
              fontSize: 'clamp(1.7rem, 3.5vw, 3rem)',
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              color: 'rgba(231,222,199,0.92)',
              margin: 0,
            }}
          >
            People who came,<br />
            <span style={{ fontStyle: 'italic', color: 'rgba(231,222,199,0.42)' }}>and didn't want to leave.</span>
          </h2>
        </div>

        {/* Grid */}
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: 'clamp(8px, 1.2vw, 16px)' }}
        >
          {POSTS.map((post, i) => (
            <motion.article
              key={post.handle}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
              style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', cursor: 'default' }}
            >
              {/* Photo */}
              <div style={{ aspectRatio: '4/5', position: 'relative' }}>
                <img
                  src={post.image}
                  alt=""
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />

                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(8,6,4,0.92) 0%, rgba(8,6,4,0.3) 45%, transparent 70%)',
                }} />

                {/* Instagram icon top-right */}
                <div style={{
                  position: 'absolute', top: 12, right: 12,
                  color: 'rgba(255,255,255,0.6)',
                }}>
                  <InstagramIcon />
                </div>

                {/* Caption bottom */}
                <div style={{ position: 'absolute', inset: 'auto 0 0 0', padding: 'clamp(10px, 2.5vw, 16px)' }}>
                  <p
                    style={{
                      fontFamily: 'Inter Tight, Inter, system-ui, sans-serif',
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      color: '#B05329',
                      marginBottom: 5,
                    }}
                  >
                    {post.handle}
                    <span style={{ color: 'rgba(231,222,199,0.35)', fontWeight: 400, letterSpacing: '0.08em', marginLeft: 6 }}>
                      {post.followers}
                    </span>
                  </p>
                  <p
                    className="hidden md:block"
                    style={{
                      fontFamily: 'Inter, system-ui, sans-serif',
                      fontSize: 12,
                      lineHeight: 1.55,
                      color: 'rgba(231,222,199,0.65)',
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {post.caption}
                  </p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

      </div>
    </section>
  );
}
