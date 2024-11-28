/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
   extend: {
      colors: {
        primary: "#14213d",
        secondary: "#f57e00",
        tertiary: "#011627",
      }
   },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};