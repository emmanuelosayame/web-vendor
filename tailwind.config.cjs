/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/components/radix/**/*.{js,ts,jsx,tsx}",
  ],
  // darkMode: "media",
  theme: {
    data: {
      closed: 'state~="closed"',
      checked: 'state~="checked"',
      unchecked: 'state~="unchecked"',
      cancel: 'state~="cancel"',
    },
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
