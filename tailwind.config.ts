import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#050506",
        gloss: "#f8f6ff",
        accent: "#d386ff"
      },
      boxShadow: {
        glow: "0 0 80px rgba(214, 138, 255, 0.25)"
      }
    }
  },
  plugins: []
};

export default config;
