/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        ink: {
          950: '#070b0a',
          900: '#0a1110',
          850: '#0d1614',
          800: '#111c1a',
          750: '#15221f',
          700: '#1a2a26',
          600: '#243a35',
          500: '#33534c',
          400: '#517671',
          300: '#7ba099',
          200: '#a8c4be',
          100: '#d4e6e1',
        },
        emerald: {
          DEFAULT: '#10b981',
          glow: '#34d399',
          deep: '#047857',
        },
        amber: {
          DEFAULT: '#f59e0b',
          glow: '#fbbf24',
          deep: '#b45309',
        },
        priority: {
          critical: '#ef4444',
          high: '#f59e0b',
          medium: '#3b82f6',
          low: '#64748b',
        },
      },
      boxShadow: {
        glow: '0 0 24px -4px rgba(16, 185, 129, 0.45)',
        'glow-amber': '0 0 24px -4px rgba(245, 158, 11, 0.45)',
        'glow-red': '0 0 28px -4px rgba(239, 68, 68, 0.55)',
        panel: '0 8px 40px -12px rgba(0, 0, 0, 0.6)',
      },
      keyframes: {
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.6)' },
          '70%': { boxShadow: '0 0 0 10px rgba(239,68,68,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0)' },
        },
        'blink': { '50%': { opacity: '0.3' } },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out',
        'slide-up': 'slide-up 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slide-in-right 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-ring': 'pulse-ring 1.4s infinite',
        'blink': 'blink 1s infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
};
