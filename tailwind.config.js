/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neu-base': '#1a1b2e',
        'neu-dark': '#0a1120',
        'neu-light': '#1e293b',
        'primary': '#4f46e5',
        'accent': '#7c3aed',
        'gold': '#fbbf24',
        'text': {
          primary: '#f8fafc',
          secondary: '#94a3b8'
        }
      },
      boxShadow: {
        'neu': '10px 10px 20px #0a1120, -10px -10px 20px #1e293b',
        'neu-pressed': 'inset 5px 5px 10px #0a1120, inset -5px -5px 10px #1e293b'
      },
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'body': ['Inter', 'sans-serif']
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
      },
    },
  },
  plugins: [],
};