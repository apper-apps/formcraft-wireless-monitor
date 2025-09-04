/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
colors: {
        primary: {
          50: '#e6f9ff',
          100: '#ccf2ff',
          200: '#99e6ff',
          300: '#66d9ff',
          400: '#33ccff',
          500: '#00d4ff', // Electric Blue
          600: '#00a3cc',
          700: '#007299',
          800: '#004266',
          900: '#001133',
        },
        accent: {
          50: '#f3e8ff',
          100: '#e9d5ff',
          200: '#d8b4fe',
          300: '#c084fc',
          400: '#a855f7',
          500: '#8b5cf6', // Neon Purple
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        cyber: {
          50: '#e6fff4',
          100: '#ccffe9',
          200: '#99ffd4',
          300: '#66ffbe',
          400: '#33ffa9',
          500: '#00ff88', // Cyber Green
          600: '#00cc6d',
          700: '#009952',
          800: '#006637',
          900: '#00331c',
        },
        neural: {
          50: '#fff0e6',
          100: '#ffe0cc',
          200: '#ffcc99',
          300: '#ffb366',
          400: '#ff9933',
          500: '#ff6b35', // Neural Orange
          600: '#cc562a',
          700: '#99401f',
          800: '#662b15',
          900: '#33150a',
        },
        surface: {
          50: '#0f0f17', // Deep Space Black
          100: '#1a1a2e', // Dark Gray
          200: '#2a2a40', // Slate
          300: '#3a3a50',
          400: '#4a4a60',
          500: '#5a5a70',
          600: '#6a6a80',
          700: '#7a7a90',
          800: '#8a8aa0',
          900: '#f8fafc', // Ghost White
        },
        background: '#0a0a0f',
        success: '#00ff88',
        warning: '#ff6b35',
        error: '#ff3366',
        info: '#00d4ff',
      },
      fontFamily: {
        'display': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.15)',
        'field': '0 1px 4px rgba(0, 0, 0, 0.08)',
'field-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fit, minmax(300px, 1fr))',
        'auto-fill': 'repeat(auto-fill, minmax(250px, 1fr))',
      },
      gridColumn: {
        'span-full': '1 / -1',
      },
      spacing: {
        'grid-gap-tight': '0.5rem',
        'grid-gap-normal': '1rem',
        'grid-gap-relaxed': '1.5rem',
        'grid-gap-loose': '2rem',
      },
    },
  },
  plugins: [],
}