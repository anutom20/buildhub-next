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
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "var(--primary)",
        darkPrimary: "var(--darkPrimary)",
        lightPrimary: "var(--lightPrimary)",
        veryLightPrimary: "var(--veryLightPrimary)",
        chatInput: "var(--chatInput)",
        userChatInput: "var(--userChatInput)",
        charcoal: "var(--charcoal)",
        lightBg: "var(--lightBg)",
        darkBg: "var(--darkBg)",
        darkCharcoal: "var(--darkCharcoal)",
        hoverBg: "var(--hoverBg)",
        numbersBg: "var(--numbersBg)",
        darkYellow: "var(--darkYellow)",
      },
    },
  },
  plugins: [],
};
export default config;
