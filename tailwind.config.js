/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        "youtube-red": "#FF0000",
        "youtube-dark": "#0F0F0F",
        "youtube-light": "#F9F9F9",
        "youtube-gray": "#606060",
        "youtube-light-gray": "#AAAAAA",
      },
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(0, 0, 0, 0.2)",
        elevated: "0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)",
      },
    },
  },
  plugins: [],
};
