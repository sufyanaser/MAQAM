/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './App.tsx',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
      },
      colors: {
        daw: {
          bg: '#121214',
          panel: '#1e1e24',
          text: '#e1e1e6',
          accent: '#00bcd4',
          gold: '#ffc107',
        },
        gray: {
          850: '#1f2937',
        },
      },
    },
  },
  plugins: [],
};
