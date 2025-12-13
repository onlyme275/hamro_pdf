// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        dancing: ["Dancing Script", "cursive"],
        homemade: ["Homemade Apple", "cursive"],
        greatvibes: ["Great Vibes", "cursive"],
        caveat: ["Caveat", "cursive"],
        satisfy: ["Satisfy", "cursive"],
        alexbrush: ["Alex Brush", "cursive"],
        pacifico: ["Pacifico", "cursive"],
      },
    },
  },
  plugins: [],
};
