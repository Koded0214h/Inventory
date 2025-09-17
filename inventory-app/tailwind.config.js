/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",   // 👈 add this
    "./components/**/*.{js,jsx,ts,tsx}", // 👈 add this
  ],
  theme: {
    extend: {
      colors: {
        primary: "#bd8bc2",
      },
    },
  },
  plugins: [],
};
