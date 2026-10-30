/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        dte: {
          bg: "#f3f6fb",
          surface: "#ffffff",
          "surface-subtle": "#f8fafc",
          "surface-container": "#e8eef6",
          dark: "#0b192c",
          border: "#cbd5e1",
          primary: {
            DEFAULT: "#0f294a",
            dark: "#081930",
            light: "#1e3a6a",
            subtle: "#e0eaf6",
          },
          secondary: {
            DEFAULT: "#d9381e",
            dark: "#a5220c",
            light: "#ff7455",
            subtle: "#feeae6",
          },
          amber: {
            DEFAULT: "#d97706",
            dark: "#b45309",
            light: "#fbbf24",
            subtle: "#fef3c7",
          },
          emerald: {
            DEFAULT: "#059669",
            dark: "#047857",
            light: "#34d399",
            subtle: "#d1fae5",
          },
          cyan: {
            DEFAULT: "#0284c7",
            dark: "#0369a1",
            light: "#38bdf8",
            subtle: "#e0f2fe",
          },
        },
      },
      fontFamily: {
        headline: ["Montserrat", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "Courier New", "monospace"],
      },
      boxShadow: {
        dte: "0 4px 20px rgba(15, 41, 74, 0.08)",
        "dte-lg": "0 12px 36px rgba(15, 41, 74, 0.14)",
      },
      borderRadius: {
        pill: "9999px",
      },
    },
  },
  plugins: [],
};
