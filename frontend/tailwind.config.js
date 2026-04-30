/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        ocean: {
          50: "#F0F9FB",
          100: "#E0F2F7",
          200: "#B3DFE8",
          300: "#7ECCD8",
          400: "#4EB8CB",
          500: "#2BA3BE",
          550: "#2495AE",
          600: "#1F87A3",
          700: "#1B6B8A",
          800: "#153A4C",
          900: "#0B2E3C",
          950: "#051820",
        },

        cyan: {
          bright: "#00D9FF",
          light: "#00F0FF",
          accent: "#4ED8EB",
        },

        dark: {
          50: "#F8F9FA",
          100: "#F1F3F5",
          500: "#6C757D",
          600: "#495057",
          700: "#343A40",
          800: "#212529",
          900: "#0B0E11",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: ["Poppins", "system-ui", "sans-serif"],
      },

      backgroundImage: {
        "ocean-gradient":
          "linear-gradient(135deg, #0B2E3C 0%, #153A4C 50%, #1B6B8A 100%)",

        "ocean-radial":
          "radial-gradient(circle at 20% 50%, rgba(43,163,190,0.3), transparent 50%)",

        "cyan-glow":
          "radial-gradient(circle at center, rgba(0,217,255,0.1), transparent 70%)",
      },

      boxShadow: {
        ocean: "0 10px 30px rgba(11, 46, 60, 0.2)",
        "ocean-lg": "0 20px 50px rgba(11, 46, 60, 0.3)",
        "ocean-xl": "0 30px 60px rgba(11, 46, 60, 0.4)",
        neon: "0 0 20px rgba(0, 217, 255, 0.3)",
        "neon-lg": "0 0 40px rgba(0, 217, 255, 0.5)",
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        "pulse-cyan": "pulse-cyan 3s ease-in-out infinite",
        glow: "glow 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        "slide-up": "slide-up 0.5s ease-out",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },

        "pulse-cyan": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },

        glow: {
          "0%, 100%": {
            boxShadow: "0 0 20px rgba(0,217,255,0.3)",
          },
          "50%": {
            boxShadow: "0 0 40px rgba(0,217,255,0.6)",
          },
        },

        shimmer: {
          "0%": { backgroundPosition: "-1000px 0" },
          "100%": { backgroundPosition: "1000px 0" },
        },

        "slide-up": {
          "0%": {
            transform: "translateY(20px)",
            opacity: "0",
          },
          "100%": {
            transform: "translateY(0)",
            opacity: "1",
          },
        },
      },
    },
  },

  plugins: [],
};