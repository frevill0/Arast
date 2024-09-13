/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customBlue: '#001937', // Nombre del color personalizado
        customYellow: '#FFC800',
      },
    },
  },
  plugins: [],
}

