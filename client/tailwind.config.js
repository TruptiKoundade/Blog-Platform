/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#14171B",
        surface: "#1B1F24",
        surface2: "#20252B",
        paper: "#F1EEE6",
        line: "rgba(233,231,226,0.12)",
        text: {
          DEFAULT: "#E9E7E2",
          muted: "#9B968D",
          faint: "#6B675F",
        },
        jade: {
          DEFAULT: "#2F8F6E",
          bright: "#3FA381",
          dim: "#1E5C46",
        },
        gild: {
          DEFAULT: "#C9A24B",
          bright: "#DDBB6C",
        },
        rust: "#B33A3A",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'IBM Plex Mono'", "monospace"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "3px",
      },
    },
  },
  plugins: [],
};
