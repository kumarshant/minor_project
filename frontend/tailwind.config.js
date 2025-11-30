/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  "#F3F2FF",
          100: "#E4E1FF",
          200: "#C7C3FF",
          300: "#A9A2FF",
          400: "#887EFF",
          500: "#5440FF",   // your main purple
          600: "#4837D9",
          700: "#3729A8",
          800: "#251A73",
          900: "#140F40",
        },
        dark: "#1A1A1A",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
}