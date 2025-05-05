/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        'slow-countup': 'slow-countup 5s steps(10, end)',
        'spin-up': 'spin-up 0.3s ease-in-out',
        'dramatic-flip': 'dramatic-flip 1.5s ease-in-out',
      },
      keyframes: {
        'slow-countup': {
          '0%': { transform: 'translateY(0)' },
          '10%': { transform: 'translateY(-100%)' },
          '20%': { transform: 'translateY(-200%)' },
          '30%': { transform: 'translateY(-300%)' },
          '40%': { transform: 'translateY(-400%)' },
          '50%': { transform: 'translateY(-500%)' },
          '60%': { transform: 'translateY(-600%)' },
          '70%': { transform: 'translateY(-700%)' },
          '80%': { transform: 'translateY(-800%)' },
          '90%': { transform: 'translateY(-900%)' },
          '100%': { transform: 'translateY(-1000%)' },
        },
        'spin-up': {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(360deg)' },
        },
        'dramatic-flip': {
          '0%': { transform: 'rotateX(0deg)' },
          '20%': { transform: 'rotateX(180deg)' },
          '40%': { transform: 'rotateX(360deg)' },
          '60%': { transform: 'rotateX(540deg)' },
          '80%': { transform: 'rotateX(720deg)' },
          '100%': { transform: 'rotateX(900deg)' },
        },
      },
    },
  },
  plugins: [],
};