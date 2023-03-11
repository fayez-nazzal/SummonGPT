let colors = {
  background: {
    light: "#ffffff80",
    dark: "#1b233b80",
  },
  textPrimary: {
    light: "#222222",
    dark: "#ffffff",
  },
  primary: {
    light: "#00afb9",
    dark: " #007d8a",
  },
  secondary: {
    light: "#e0e1dd",
    dark: "#1b263b",
  },
  melt: {
    light: "#c0c0c0",
    dark: "#ebebeb",
  },
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      sans: ["et-book", "sans-serif"],
    },
    extend: {
      colors,
    },
  },
  plugins: [require("tailwindcss-theme-shift")(colors, "light", true)],
};
