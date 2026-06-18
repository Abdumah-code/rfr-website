/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./App.tsx"
  ],
  theme: {
    extend: {
      colors: {
        bg0: '#07050A',
        bg1: '#0D0A12',
        card: 'rgba(201, 160, 48, 0.035)',
        card2: 'rgba(201, 160, 48, 0.07)',
        stroke: 'rgba(201, 160, 48, 0.2)',
        'stroke-hover': 'rgba(201, 160, 48, 0.5)',
        gold: '#C9A030',
        'gold-light': '#E8C558',
        'gold-glow': 'rgba(201, 160, 48, 0.18)',
        crimson: '#7C1C2E',
        'crimson-light': '#A82840',
        'text-main': '#EAE0CC',
        muted: '#9A8A72',
        neutral: {
          550: '#636b74',
          650: '#3d444d',
          750: '#2a2f36',
          850: '#1a1d21',
        },
        indigo: {
          650: '#4338ca',
        },
      },
      fontFamily: {
        heading: ['Cinzel', 'Palatino Linotype', 'serif'],
        body: ['Crimson Text', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};
