/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        slenadb: {
          bg: '#0c1410',
          card: '#131c18',
          border: '#1f2e26',
          text: '#e8efeb',
          textSub: '#8a9d93',
        }
      },
      fontFamily: {
        sans: ['"Hiragino Sans"', '"Yu Gothic"', 'sans-serif'],
        serif: ['"Hiragino Mincho ProN"', 'serif']
      }
    },
  },
  plugins: [],
}
