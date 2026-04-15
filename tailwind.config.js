/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#eef2f6',
          100: '#dce5ed',
          200: '#baccdd',
          300: '#8baad0',
          400: '#5a84bf',
          500: '#3865a3',
          600: '#284f88',
          700: '#203f6f',
          800: '#1c345a',
          900: '#1a2e4c',
          950: '#0a1122', /* Deeper navy */
        }
      }
    },
  },
  plugins: [],
}
