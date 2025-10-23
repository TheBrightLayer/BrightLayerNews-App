/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // Custom dark mode colors
        'dark-bg': '#0b1220',
        'dark-card': '#07101a',
        'dark-text': '#e6eef8',
      },
    },
  },
  plugins: [],
  darkMode: 'class', // Enable class-based dark mode
};