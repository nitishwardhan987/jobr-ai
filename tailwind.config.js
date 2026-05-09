/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        jobr: {
          bg:           '#F5F4F0',
          card:         '#FFFFFF',
          subtle:       '#EEECEA',
          accent:       '#6B4EFF',
          'accent-dim': 'rgba(107,78,255,0.10)',
          'accent-lt':  '#EDE9FF',
          text1:        '#0D0D0D',
          text2:        '#4A4A5A',
          text3:        '#8A8A9A',
          border:       'rgba(13,13,13,0.10)',
          success:      '#10B981',
          warning:      '#F59E0B',
        },
      },
      borderRadius: {
        sm: '6px', md: '10px', lg: '16px', xl: '24px',
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-none': {
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
      });
    },
  ],
};