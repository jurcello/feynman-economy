/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts}",
    "./src/*.{vue,js,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Source Sans 3", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Noto Sans", "Liberation Sans", "Arial", "sans-serif"],
        serif: ["Lora", "ui-serif", "Georgia", "Cambria", "Times New Roman", "Times", "serif"],
      },
      colors: {
        trust: {
          50: "#eef6ff",
          100: "#d8ebff",
          200: "#b5d8ff",
          300: "#84bfff",
          400: "#4fa0fa",
          500: "#2a7ddf", // calm, trustworthy blue
          600: "#1f61b3",
          700: "#1b4f8e",
          800: "#193f70",
          900: "#152f52",
        },
        growth: {
          50: "#f0f8f4",
          100: "#d9efe4",
          200: "#b5dfca",
          300: "#88caa9",
          400: "#5fae88",
          500: "#3d906d", // natural green (not money-green)
          600: "#2f7559",
          700: "#275e49",
          800: "#204b3b",
          900: "#18352a",
        },
        earth: {
          50: "#faf6f1",
          100: "#efe6d9",
          200: "#e2d2ba",
          300: "#cbb28e",
          400: "#a88b63",
          500: "#8a6f4a",
          600: "#6e583a",
          700: "#59462e",
          800: "#473826",
          900: "#302418",
        },
        accent: {
          50: "#fff7e6",
          100: "#ffe9bf",
          200: "#ffd586",
          300: "#ffbb4d",
          400: "#ffa31f",
          500: "#ff8a0a", // warm orange accent
          600: "#e67300",
          700: "#b35a00",
          800: "#8c4700",
          900: "#5c2f00",
          yellow: {
            300: "#fde68a",
            400: "#fbbf24",
            500: "#f59e0b",
          },
        },
      },
      keyframes: {
        flow: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        flow: 'flow 12s ease-in-out infinite',
        float: 'float 6s ease-in-out infinite',
        fade: 'fadeIn 600ms ease-out both',
      },
      borderRadius: {
        'organic': '2rem',
        'blob': '40% 60% 70% 30% / 40% 30% 70% 60%'
      },
    },
  },
  plugins: [],
};