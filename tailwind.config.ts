import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#FFF9F0",
          secondaryBg: "#F5EBDD",
          gold: "#C6A15B",
          darkGold: "#A9823D",
          lightGold: "#DFBF7F",
          paleGold: "#F9F4EB",
          text: "#332820",
          secondaryText: "#85796B",
          card: "#FFFFFF",
          border: "#E8DCCB",
          accent: "#B88E3E",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-outfit)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 30px -10px rgba(51, 40, 32, 0.08)",
        gold: "0 8px 25px -5px rgba(198, 161, 91, 0.25)",
        card: "0 4px 20px -2px rgba(51, 40, 32, 0.05)",
        elevation: "0 20px 40px -15px rgba(51, 40, 32, 0.12)",
      },
      borderRadius: {
        premium: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;

