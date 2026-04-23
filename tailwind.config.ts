import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bone: '#F2EDE3',
        boneWarm: '#EAE3D3',
        surface: '#E6DECC',
        dune: '#D4C8B4',
        pineLight: '#DDE2D6',
        ink: '#1F2420',
        ink2: '#5A5650',
        longleaf: '#3E4F3A',
        pineDeep: '#2A3A2A',
        honey: '#A67C52',
        honeyDark: '#3D2F1F',
        wiregrass: '#C9A96E',
        signal: '#B05329',
        signal2: '#9A4722',
        ember: '#D4804E',
        divider: '#D9CEB8',
        night: '#1A1F1B',
        nightWarm: '#232924',
        linen: '#E7DEC7',
        linen2: '#D4C8A8',
      },
      fontFamily: {
        display: ['Fraunces', 'Canela', 'Georgia', 'serif'],
        sans2: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        eyebrow: ['"Inter Tight"', 'Inter', 'sans-serif'],
      },
      maxWidth: {
        content: '1400px',
        text: '680px',
      },
      keyframes: {
        bounceCue: {
          '0%,100%': { transform: 'translateY(0)', opacity: '0.6' },
          '50%': { transform: 'translateY(10px)', opacity: '1' },
        },
      },
      animation: {
        bounceCue: 'bounceCue 2.4s ease-in-out infinite',
      },
    },
  },
} satisfies Config;
