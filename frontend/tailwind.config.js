/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 6px 20px rgba(37, 99, 235, 0.07)',
        'glow': '0 8px 20px rgba(37, 99, 235, 0.22)',
        'glow-hover': '0 12px 26px rgba(37, 99, 235, 0.28)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '22px',
      }
    },
  },
  plugins: [],
}
