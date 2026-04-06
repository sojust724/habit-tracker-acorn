/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#4F7942',
        secondary: '#8B5E3C',
        acorn: '#C4873A',
        'acorn-gold': '#F0C040',
        background: '#FDF6EC',
        surface: '#FFFFFF',
        'text-primary': '#2D2D2D',
        'text-secondary': '#7A7A7A',
      },
    },
  },
  plugins: [],
};
