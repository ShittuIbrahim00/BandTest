// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
    content: [
      './pages//*.{js,jsx}',
      './components//*.{js,jsx}',
      './app//*.{js,jsx}',
      './src//*.{js,jsx}', 
    ],
    theme: {
      extend: {
        backgroundImage: {
          'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
          'gradient-conic':
            'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        },
        fontFamily: {
          cormorant: ['var(--font-cormorant)'],
          encode: ['var(--font-encode)'],
          merienda: ['var(--font-merienda)'],
          noto: ['var(--font-notojp)'],
          opensans: ['var(--font-opensans)'],
          jakarta: ['var(--font-jakarta)'],
        },
      },
    },
    plugins: [],
  }