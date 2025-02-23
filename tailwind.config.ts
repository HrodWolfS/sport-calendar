import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        strava: {
          orange: "#FC4C02",
          gray: {
            100: "#F7F7FA",
            200: "#E6E6EB",
            300: "#D1D1DB",
            400: "#9999A6",
            500: "#6B6B76",
            600: "#4C4C55",
            700: "#38383F",
            800: "#242428",
            900: "#18181B",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
