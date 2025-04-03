/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#13A753', // Green color from the design
        dark: '#1E1E1E',    // Dark background color - exact Figma color
        'dark-bg': '#121212', // Darker background color for the main page
        light: '#FFFFFF',   // White color
        gray: {
          100: '#E6E6E6',
          200: '#C2C2C2',
          300: '#313131',
        },
        social: {
          facebook: '#3C5A9A',
          google: {
            blue: '#4285F4',
            green: '#34A853',
            yellow: '#FBBC05',
            red: '#EB4335',
          }
        }
      },
      borderRadius: {
        'xl': '40px',
        '2xl': '60px',
        '3xl': '100px',
        '25': '25px',
      },
      fontFamily: {
        'manrope': ['Manrope', 'sans-serif'],
        'michael': ['michael', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out forwards',
        'slide-up': 'slideUp 0.3s ease-in-out forwards',
        'scale-in': 'scaleIn 0.3s ease-in-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: 0 },
          '100%': { transform: 'scale(1)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}

