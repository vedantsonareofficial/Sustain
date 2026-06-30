import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        panel: {
          bg: "var(--panel-bg)",
          border: "var(--panel-border)",
        },
        beige: {
          DEFAULT: "var(--beige)",
          dim: "var(--beige-dim)",
        },
      },
    },
  },
  plugins: [],
};
export default config;
