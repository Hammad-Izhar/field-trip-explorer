/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ceti: {
          black: '#171B22',
          white: '#FFFFFF',
          grey: '#D0D4DF',
          turquoise: '#00CFF8',
          royal: '#4F1CCB',
          accent: '#4B06EB',
          shallow: '#A7DCE5',
          salmon: '#C54D9B',
          slate: '#4B5B7E',
          teal: '#6EC8C0',
          blue: '#1285BA',
          violet: '#54479C',
          lavender: '#7E5BA5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"DM Serif Display"', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'ceti-ocean':
          'linear-gradient(135deg, #00CFF8 0%, #75C1EB 28%, #4B06EB 72%, #4F1CCB 100%)',
        'ceti-royal': 'linear-gradient(90deg, #4B06EB 0%, #4F1CCB 100%)',
        'ceti-shallow': 'linear-gradient(135deg, #EAF3FA 0%, #A7DCE5 55%, #00CFF8 100%)',
      },
      boxShadow: {
        ceti: '0 18px 45px rgba(23, 27, 34, 0.12)',
        'ceti-focus': '0 0 0 3px rgba(0, 207, 248, 0.35)',
      },
    },
  },
}
