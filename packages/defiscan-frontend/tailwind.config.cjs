/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#f9f9ff',
          card: '#F8FAFC',
          muted: '#f0f3ff',
          dark: '#151c27',
        },
        accent: '#2563EB',
        'accent-dark': '#004ac6',
        'accent-tint': '#dce2f3',
        'accent-tint-light': '#e7eefe',
        hover: '#F1F5F9',
        purple: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        text: {
          primary: '#0f172a',
          secondary: '#434655',
          muted: '#64748b',
        },
        status: {
          red: '#DC2626',
          amber: '#D97706',
          green: '#006243',
          blue: '#2563EB',
        },
        risk: {
          critical: '#DC2626',
          high: '#F97316',
          medium: '#D97706',
          low: '#059669',
          minimal: '#06B6D4',
        },
        capital: '#059669',
        token: '#D97706',
        terminal: {
          blue: '#60a5fa',
          green: '#85f8c4',
        },
        border: '#E2E8F0',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        'heading-1': '-0.05em',
        'heading-2': '-0.01em',
        'data-label': '0.01em',
      },
    },
  },
  plugins: [],
}
