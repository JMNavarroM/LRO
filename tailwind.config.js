/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        space: {
          950: '#020608',
          900: '#050a14',
          850: '#070d1a',
          800: '#0a0e1a',
          750: '#0d1220',
          700: '#111827',
        },
        graphite: {
          900: '#151820',
          800: '#1e2130',
          700: '#252838',
          600: '#2a2d3e',
          500: '#363a50',
          400: '#454868',
        },
        lro: {
          50: '#e0f7ff',
          100: '#b3ecff',
          200: '#80e0ff',
          300: '#4dd3ff',
          400: '#26c8ff',
          500: '#00b4d8',
          600: '#0096b7',
          700: '#007896',
          800: '#005a75',
          900: '#003c54',
          accent: '#38bdf8',
          glow: '#0ea5e9',
          bright: '#67e8f9',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backdropBlur: {
        xs: '2px',
        glass: '20px',
        heavy: '40px',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'scan-line': 'scan-line 2s linear infinite',
        'data-flow': 'data-flow 1s linear infinite',
        'orbit': 'orbit 20s linear infinite',
        'shimmer': 'shimmer 3s ease-in-out infinite',
        'ping-slow': 'ping 2s cubic-bezier(0,0,0.2,1) infinite',
        'flicker': 'flicker 4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 8px rgba(0,180,216,0.4)' },
          '50%': { boxShadow: '0 0 24px rgba(0,180,216,0.8), 0 0 40px rgba(0,180,216,0.3)' },
        },
        'scan-line': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(200%)' },
        },
        'data-flow': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' },
        },
        'orbit': {
          '0%': { transform: 'rotate(0deg) translateX(140px) rotate(0deg)' },
          '100%': { transform: 'rotate(360deg) translateX(140px) rotate(-360deg)' },
        },
        'shimmer': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.8' },
        },
        'flicker': {
          '0%, 95%, 100%': { opacity: '1' },
          '96%': { opacity: '0.6' },
          '97%': { opacity: '1' },
          '98%': { opacity: '0.4' },
          '99%': { opacity: '1' },
        },
      },
      boxShadow: {
        'glow-sm': '0 0 8px rgba(0,180,216,0.3)',
        'glow': '0 0 16px rgba(0,180,216,0.4)',
        'glow-lg': '0 0 32px rgba(0,180,216,0.5)',
        'glow-xl': '0 0 48px rgba(0,180,216,0.6)',
        'inner-glow': 'inset 0 1px 0 rgba(255,255,255,0.1), inset 0 -1px 0 rgba(0,0,0,0.2)',
        'glass': '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)',
        'glass-lg': '0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
      },
    },
  },
  plugins: [],
}
