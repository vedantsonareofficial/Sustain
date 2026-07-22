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
        primary: {
          DEFAULT: "var(--primary)",
          container: "var(--primary-container)",
          fixed: {
            DEFAULT: "var(--primary-fixed)",
            dim: "var(--primary-fixed-dim)",
          },
        },
        "on-primary": {
          DEFAULT: "var(--on-primary)",
          container: "var(--on-primary-container)",
          fixed: {
            DEFAULT: "var(--on-primary-fixed)",
            variant: "var(--on-primary-fixed-variant)",
          },
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          container: "var(--secondary-container)",
          fixed: {
            DEFAULT: "var(--secondary-fixed)",
            dim: "var(--secondary-fixed-dim)",
          },
        },
        "on-secondary": {
          DEFAULT: "var(--on-secondary)",
          container: "var(--on-secondary-container)",
          fixed: {
            DEFAULT: "var(--on-secondary-fixed)",
            variant: "var(--on-secondary-fixed-variant)",
          },
        },
        tertiary: {
          DEFAULT: "var(--tertiary)",
          container: "var(--tertiary-container)",
          fixed: {
            DEFAULT: "var(--tertiary-fixed)",
            dim: "var(--tertiary-fixed-dim)",
          },
        },
        "on-tertiary": {
          DEFAULT: "var(--on-tertiary)",
          container: "var(--on-tertiary-container)",
          fixed: {
            DEFAULT: "var(--on-tertiary-fixed)",
            variant: "var(--on-tertiary-fixed-variant)",
          },
        },
        surface: {
          DEFAULT: "var(--surface)",
          variant: "var(--surface-variant)",
          bright: "var(--surface-bright)",
          dim: "var(--surface-dim)",
          tint: "var(--surface-tint)",
          container: {
            DEFAULT: "var(--surface-container)",
            low: "var(--surface-container-low)",
            high: "var(--surface-container-high)",
            highest: "var(--surface-container-highest)",
            lowest: "var(--surface-container-lowest)",
          },
        },
        "on-surface": {
          DEFAULT: "var(--on-surface)",
          variant: "var(--on-surface-variant)",
        },
        background: "var(--background)",
        "on-background": "var(--on-background)",
        outline: {
          DEFAULT: "var(--outline)",
          variant: "var(--outline-variant)",
        },
        error: {
          DEFAULT: "var(--error)",
          container: "var(--error-container)",
        },
        "on-error": {
          DEFAULT: "var(--on-error)",
          container: "var(--on-error-container)",
        },
        "inverse-surface": "var(--inverse-surface)",
        "inverse-on-surface": "var(--inverse-on-surface)",
        "inverse-primary": "var(--inverse-primary)",
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
      fontFamily: {
        headline: ["Plus Jakarta Sans", "sans-serif"],
        body: ["Fira Sans", "sans-serif"],
      },
      borderRadius: {
        card: "24px",
      },
    },
  },
  plugins: [],
};

export default config;
