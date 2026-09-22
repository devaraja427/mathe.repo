/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        academic: {
          50: '#f0f4fd',
          100: '#dce6fa',
          200: '#bfd3f6',
          300: '#94b8f0',
          400: '#6295e8',
          500: '#3c73df',
          600: '#2b57d0',
          700: '#2244b7',
          800: '#203994',
          900: '#1e3376',
          950: '#142049',
        },
        primary: {
          DEFAULT: '#2563eb',
          foreground: '#ffffff',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
