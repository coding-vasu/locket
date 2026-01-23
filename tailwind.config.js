/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'monospace'],
    },
    extend: {
        colors: {
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        surfaceHighlight: 'rgb(var(--color-surface-highlight) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        primaryHover: 'rgb(var(--color-primary-hover) / <alpha-value>)',
        // Text colors
        main: 'rgb(var(--color-text-main) / <alpha-value>)',
        muted: 'rgb(var(--color-text-muted) / <alpha-value>)',
        dim: 'rgb(var(--color-text-dim) / <alpha-value>)',
        // Gradient colors
        'gradient-start': 'rgb(var(--color-gradient-start) / <alpha-value>)',
        'gradient-mid': 'rgb(var(--color-gradient-mid) / <alpha-value>)',
        'gradient-end': 'rgb(var(--color-gradient-end) / <alpha-value>)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(99, 102, 241, 0.15)',
        'glow-lg': '0 0 40px rgba(99, 102, 241, 0.3)',
        'glow-purple': '0 0 30px rgba(168, 85, 247, 0.4)',
        'glow-pink': '0 0 30px rgba(236, 72, 153, 0.4)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'spotlight': '0 0 80px rgba(99, 102, 241, 0.5), 0 0 32px rgba(168, 85, 247, 0.3)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-out',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'spotlight': 'spotlight 3s ease-in-out infinite',
        'pulse-icon': 'pulseIcon 0.6s ease-in-out',
        'float': 'float 6s ease-in-out infinite',
        'grid-move': 'gridMove 20s linear infinite',
        'aurora': 'aurora 20s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        spotlight: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        pulseIcon: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        float: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(30px, -30px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        gridMove: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(50px)' },
        },
        aurora: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)', opacity: '0.3' },
          '33%': { transform: 'translate(100px, -100px) scale(1.2)', opacity: '0.5' },
          '66%': { transform: 'translate(-100px, 50px) scale(0.8)', opacity: '0.4' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'shimmer-gradient': 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
      },
    }
  },
  plugins: [],
}
