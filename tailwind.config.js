let colors = {
  background: {
    light: "#f7fafd",
    dark: "#1b233b",
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
  error: {
    light: "#f33800",
    dark: "#f24073",
  },
  success: {
    light: "#63c132",
    dark: "#0cce6b",
  },
  plane: {
    light: "#f2f2f2",
    dark: "#1b233b",
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
