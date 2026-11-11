/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#07050F',
        surface: '#110D1F',
        elevated: '#1A1430',
        primary: { 400: '#A78BFA', 500: '#8B5CF6', 600: '#7C3AED' },
        accent: { pink: '#EC4899', cyan: '#22D3EE' },
        ink: { DEFAULT: '#F5F3FF', muted: '#A1A1B5' },
        success: '#34D399',
        danger: '#F87171',
      },
      borderColor: { soft: 'rgba(255,255,255,0.08)' },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 8px 30px rgba(139,92,246,.35)',
        'glow-lg': '0 12px 40px rgba(139,92,246,.5)',
      },
      backgroundImage: {
        brand: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
      },
      maxWidth: { content: '1400px' },
    },
  },
  plugins: [],
};
