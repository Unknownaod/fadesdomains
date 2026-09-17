/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#08080A',
        panel: '#131316',
        'panel-2': '#1B1B1F',
        chrome: '#E7E8EA',
        steel: '#9DA1A6',
        haze: '#4A4C50',
        paper: '#F5F5F6',
        mint: '#7CFFB2',
        rust: '#FF6B6B',
        hairline: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        chrome: 'linear-gradient(180deg, #F5F5F6 0%, #C9CBCE 52%, #E7E8EA 100%)',
        'chrome-hover': 'linear-gradient(180deg, #FFFFFF 0%, #D6D8DB 52%, #F0F1F2 100%)',
        panel: 'linear-gradient(180deg, #17171B 0%, #0F0F12 100%)',
        sheen: 'linear-gradient(115deg, transparent 20%, rgba(255,255,255,0.06) 36%, rgba(255,255,255,0.14) 44%, rgba(255,255,255,0.02) 52%, transparent 70%)',
        'radial-glow': 'radial-gradient(60% 60% at 50% 0%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 70%)',
      },
      boxShadow: {
        chrome: '0 1px 0 rgba(255,255,255,0.5) inset, 0 -1px 0 rgba(0,0,0,0.25) inset, 0 8px 24px rgba(0,0,0,0.35)',
        panel: '0 1px 0 rgba(255,255,255,0.04) inset, 0 20px 60px rgba(0,0,0,0.5)',
        hairline: '0 0 0 1px rgba(255,255,255,0.08)',
      },
      letterSpacing: {
        tightish: '-0.02em',
      },
    },
  },
  plugins: [],
};
