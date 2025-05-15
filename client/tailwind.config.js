module.exports = {
    content: [
      './src/**/*.{js,ts,jsx,tsx}',
      "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        fontFamily: {
          sans: ['Inter', 'sans-serif'],
        },
        colors: {
          navy: {
            900: '#0a192f',
            700: '#172a45',
            600: '#1f3a5c',
          },
          sky: {
            600: '#00b4d8',
            700: '#0096c7',
            200: '#caf0f8',
          },
          red: {
            600: '#e63946',
          }
        },
      },
    },
    plugins: [],
  }