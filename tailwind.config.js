/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sky: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
        },
        pastel: {
          pink: '#ffd1dc',
          rose: '#ffe4e6',
          lavender: '#ede9fe',
          cream: '#fffbeb',
          mint: '#e6fffa',
          peach: '#ffedd5',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        handwriting: ['Caveat', 'cursive'],
      },
      keyframes: {
        floatUp: {
          '0%': { transform: 'translateY(105vh) scale(0.7) rotate(0deg)', opacity: '0' },
          '15%': { opacity: '0.75' },
          '80%': { opacity: '0.8' },
          '100%': { transform: 'translateY(-10vh) scale(1.1) rotate(25deg)', opacity: '0' },
        },
        pulseSubtle: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.9' },
          '50%': { transform: 'scale(1.05)', opacity: '1' },
        },
        equalizer: {
          '0%, 100%': { height: '4px' },
          '50%': { height: '18px' },
        }
      },
      animation: {
        'float-up': 'floatUp 10s linear infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'equalizer': 'equalizer 1s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}

