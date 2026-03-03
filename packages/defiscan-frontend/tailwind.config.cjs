/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#FAFAFE',
          card: '#FFFFFF',
          muted: '#F3F0F8',
          dark: '#1E1B2E',
        },
        // Institutional dark theme
        inst: {
          bg: '#0a0e17',
          surface: '#111827',
          card: '#1a2332',
          border: '#1f2d3d',
          'border-bright': '#2a3a4e',
          text: '#e2e8f0',
          'text-dim': '#8892a4',
          'text-muted': '#4a5568',
          accent: '#3b82f6',
          'accent-dim': '#1e40af',
          green: '#10b981',
          red: '#ef4444',
          amber: '#f59e0b',
          cyan: '#06b6d4',
        },
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
          primary: '#1E1B2E',
          secondary: '#6B7280',
          muted: '#9CA3AF',
        },
        status: {
          red: '#EF4444',
          amber: '#F59E0B',
          green: '#10B981',
          blue: '#3B82F6',
        },
        risk: {
          critical: '#EF4444',
          high: '#F97316',
          medium: '#F59E0B',
          low: '#10B981',
          minimal: '#06B6D4',
        },
        capital: '#10B981',
        token: '#F59E0B',
        border: '#E5E1ED',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
    },
  },
  plugins: [],
}
