import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#e1f5ee",
          100: "#9fe1cb",
          200: "#5dcaa5",
          400: "#1d9e75",
          600: "#0f6e56",
          800: "#085041",
          900: "#04342c",
        },
        accent: {
          50: "#faeeda",
          200: "#ef9f27",
          400: "#ba7517",
          600: "#854f0b",
        },
      },
      borderRadius: {
        card: "12px",
      },
    },
  },
  plugins: [],
};

export default config;
