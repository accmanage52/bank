/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      boxShadow: {
        'glow': '0 10px 30px rgba(0,0,0,0.25)',
      },
      backgroundImage: {
        'cred-gradient': 'radial-gradient(100% 100% at 0% 0%, #0b1324 0%, #0a0f1e 40%, #060b14 100%)'
      },
      colors: {
        credBlue: '#0c1326',
        credTeal: '#49e3d8',
        credPurple: '#7c4dff'
      }
    },
  },
  plugins: [],
}
