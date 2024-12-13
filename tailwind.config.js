/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",         // Include your index.html file
    "./src/**/*.{js,ts}",   // Include all JavaScript/TypeScript files in src/
  ],
  theme: {
    extend: {}, // Add custom theming here if needed
  },
  plugins: [], // Enable Tailwind plugins (if required)
};