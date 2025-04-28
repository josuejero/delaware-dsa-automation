/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand': {
          'red': '#ec1f27',
          'dark': '#231f20',
        },
      },
    },
  },
  plugins: [],
}
