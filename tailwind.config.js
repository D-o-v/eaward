/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eloy: {
          primary: '#c5a47e',
          secondary: '#b8956f',
          dark: '#444444'
        }
      }
    },
  },
  plugins: [],
}