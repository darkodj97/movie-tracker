/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: "#E50914",
          dark: "#141414",
          gray: "#2F2F2F",
          lightgray: "#B3B3B3",
        }
      }
    },
  },
  plugins: [],
}