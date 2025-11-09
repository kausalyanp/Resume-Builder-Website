/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
  extend: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      serif: ['Lora', 'ui-serif', 'Georgia', 'serif'],
      mono: ['ui-monospace', 'SFMono-Regular'],
    },
  },
},
  plugins: [],
}

