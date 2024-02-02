/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Open Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
        prose: ["Space Grotesk", "sans-serif"],
      },
    },
  },
  plugins: [
    "@tailwindcss/typography",
    "tailwindcss-animate",
    "tailwindcss-react-aria-components",
  ],
};
