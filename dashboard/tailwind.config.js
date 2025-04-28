/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/app/**/*.{ts,tsx}', './src/components/**/*.{ts,tsx}'],
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
