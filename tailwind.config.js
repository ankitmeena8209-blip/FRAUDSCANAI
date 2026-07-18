/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: '#060816',
        slateBlue: '#111731',
        cyber: '#4C6FFF',
        violet: '#8B5CF6',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        premium: '0 25px 80px rgba(76, 111, 255, 0.25)',
      },
      backgroundImage: {
        aurora: 'radial-gradient(circle at 20% 20%, rgba(76,111,255,0.28), transparent 32%), radial-gradient(circle at 80% 10%, rgba(139,92,246,0.2), transparent 25%), linear-gradient(135deg, rgba(7,10,22,0.95), rgba(15,23,42,0.9))',
      },
    },
  },
  plugins: [],
};
