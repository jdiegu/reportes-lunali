export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fdf6f9",
          100: "#fdf0f4",
          200: "#fce7ef",
          300: "#f5d6e0",
          400: "#f2c4d3",
          500: "#d46a8a",
          600: "#c45a7a",
          700: "#a34565",
          800: "#7f3650",
          900: "#5b2a3c",
        },
        rose: {
          50: "#fdf6f9",
          100: "#fdf0f4",
          200: "#fce7ef",
          300: "#f5d6e0",
          400: "#f2c4d3",
          500: "#d46a8a",
          600: "#c45a7a",
          700: "#a34565",
          800: "#7f3650",
          900: "#5b2a3c",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
        body: ["DM Sans", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
    },
  },
  plugins: [],
}
