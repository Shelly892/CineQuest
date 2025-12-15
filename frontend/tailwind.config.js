/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // CineQuest custom color palette
        primary: {
          50: "#f5e6ff",
          100: "#e6ccff",
          200: "#cc99ff",
          300: "#b366ff",
          400: "#9933ff",
          500: "#8d25f4", // Main brand color
          600: "#7a1fd4",
          700: "#6619b3",
          800: "#531493",
          900: "#400f72",
        },
        dark: {
          bg: "#141118",
          card: "#211b27",
          border: "#473b54",
          text: "#ab9cba",
        },
      },
      animation: {
        "spin-reverse": "spin 1s linear infinite reverse",
      },
      keyframes: {
        "spin-reverse": {
          from: { transform: "rotate(360deg)" },
          to: { transform: "rotate(0deg)" },
        },
      },
    },
  },
  plugins: [],
};
