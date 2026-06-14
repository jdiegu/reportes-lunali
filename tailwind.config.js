export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        blush: {
          50: "#fdf4f7",
          100: "#fce7ef",
          200: "#f9d0df",
          300: "#f4a9c3",
          400: "#ec729f",
          500: "#e71a55",
          600: "#d1154c",
          700: "#a31040",
          800: "#7f1036",
          900: "#5b0d2a",
        },

        dark: {
          950: "#1a0f15",
        },
      },

      fontFamily: {
        body: ["Inter", "sans-serif"],
        display: ["Poppins", "sans-serif"],
      },

      boxShadow: {
        rose: "0 0 20px rgba(231,26,85,0.35)",
      },
    },
  },

  plugins: [],
}