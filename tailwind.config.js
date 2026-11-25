/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        sapphire: {
          DEFAULT: "#07126E",
          deep: "#050C4D",
          soft: "#262C6B",
        },
        gold: {
          DEFAULT: "#B8860B",
          light: "#D4B067",
        },
        cream: "#F4EADC",
        paper: "#FBF8F3",
        ink: {
          DEFAULT: "#3A201D",
          soft: "#6B514D",
        },
      },
      fontFamily: {
        head: ["Fahkwang", "Helvetica Neue", "Arial", "sans-serif"],
        body: ["Outfit", "Helvetica Neue", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};
