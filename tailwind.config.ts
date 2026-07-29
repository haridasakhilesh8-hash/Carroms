import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        board: "0 24px 80px rgba(7, 10, 14, 0.22)"
      }
    }
  },
  plugins: []
};

export default config;
