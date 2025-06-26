/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tactical-red': '#ED2729',
        'jet-black': '#000000',
        'dark-gray': '#1a1a1a',
        'medium-gray': '#333333',
        'light-gray': '#666666',
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
        'display': ['Orbitron', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'pulse-red': 'pulseRed 2s infinite',
        'glow': 'glow 2s infinite alternate',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 5px #ED2729' },
          '50%': { boxShadow: '0 0 20px #ED2729, 0 0 30px #ED2729' },
        },
        glow: {
          '0%': { textShadow: '0 0 5px #ED2729' },
          '100%': { textShadow: '0 0 10px #ED2729, 0 0 15px #ED2729' },
        },
      },
    },
  },
  plugins: [],
}