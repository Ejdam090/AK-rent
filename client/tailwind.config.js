/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily:{
        headText : ['Lemon', 'serif']
      },
      colors:{
        primary : '#EF7B00',
      },
    },
  },
  plugins: [],
}

