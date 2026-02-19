/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f20d0d',
        'soft-bg': '#f8f5f5',
        'dark-bg': '#110808',
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
    },
  },
  plugins: [],
}
