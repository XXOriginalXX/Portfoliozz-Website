/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        primary: '#0A2647',  // Deep navy blue
        secondary: '#144272', // Medium blue
        accent: '#D4AF37',   // Gold
        success: '#10B981',  // Green
        warning: '#F59E0B',  // Amber
        error: '#EF4444',    // Red
      },
      animation: {
        'scroll-indicator': 'scrollIndicator 2s ease-in-out infinite',
      },
      keyframes: {
        scrollIndicator: {
          '0%, 100%': { transform: 'translateY(0)', opacity: 0 },
          '50%': { transform: 'translateY(10px)', opacity: 1 },
        },
      },
    },
  },
  plugins: [],
};