/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // or 'media' for OS preference-based
  theme: {
    extend: {
      animation: {
        'fade-in': 'fadeInUp 0.5s ease-out forwards',
        'float': 'float 10s ease-in-out infinite',
        'shine': 'shine 1.5s linear infinite',
      },
      colors: {
        'manga-dark': '#0f0f1a',
        'manga-accent': '#ec4899',
      },
    },
  },
  plugins: [],
} 