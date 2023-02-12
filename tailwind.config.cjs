/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      spaceGrotesk: ["var(--font-spaceGrotesk)"],
    },
    extend: {
      backgroundImage: {
        login: "url('/loginbg.jpg')",
        "login-1": "url('/loginbg1.jpg')",
        "login-2": "url('/loginbg2.jpg')",
      },
    },
  },
  plugins: [],
};
