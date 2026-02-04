/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        background: '#e7e7e7', // 
        foreground: '#050505', // 
        muted: '#a1a1aa', // zinc-400

        'tc-black': '#050505',
        'tc-dark': '#0a0a0a',
        'tc-border': '#27272a',
        'tc-light': '#f1f1f1', // Very light gray
        'tc-hologram': '#52525b', // Zinc 600 (Legacy reference, though we use blue now)
      },
      fontFamily: {
        sans: ['Bai Jamjuree', 'Titillium Web', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
