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
        rapunzel: {
          50: "#faf5ff",
          100: "#f3e8ff",
          200: "#e9d5ff",
          300: "#d8b4fe",
          400: "#c084fc",
          500: "#a855f7",
          600: "#9333ea",
          700: "#7e22ce",
          800: "#6b21a8",
          900: "#581c87",
        },
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        rose: {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
        sage: {
          50: "#f6f7f4",
          100: "#e8ebe3",
          200: "#d2d8c8",
          300: "#b3bda4",
          400: "#95a183",
          500: "#788567",
          600: "#5e6a50",
          700: "#4a5440",
          800: "#3d4436",
          900: "#343a2f",
        },
      },
      backgroundImage: {
        "rapunzel-gradient": "linear-gradient(135deg, #e9d5ff 0%, #fef3c7 50%, #ffe4e6 100%)",
        "rapunzel-gradient-soft": "linear-gradient(135deg, #faf5ff 0%, #fffbeb 50%, #fff1f2 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
