/** @type {import('tailwindcss').Config} */
export default {
  content: 
    [
      './src/**/*.{html,tsx}',
      './index.html'
    ],
  theme: {
    extend: {   
      colors: {
        backgroundPrincipal: 'rgba(15, 23, 42, 1)',
        textColorPrincipal: 'rgba(248, 250, 252, 1)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif' ],
      }
    },
  },
  plugins: [],
}

