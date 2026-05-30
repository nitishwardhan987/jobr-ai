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
        display: ['"Plus Jakarta Sans"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
        sans:    ['"Inter"', 'sans-serif'],
      },
      colors: {
        canvas:   '#F8F5F0',
        bg:       '#F5F1EA',
        surface:  '#FFFFFF',
        elevated: '#FCFAF7',
        accent:   {
          DEFAULT: '#F97316',
          hover:   '#EA580C',
          active:  '#C2410C',
          soft:    '#FFF7ED',
          border:  '#FED7AA',
        },
        ink: {
          1: '#18181B',
          2: '#52525B',
          3: '#71717A',
          4: '#A1A1AA',
        },
        border: {
          DEFAULT: '#E7E5E4',
          subtle:  '#F0EDEA',
          strong:  '#D6D3D1',
        },
        success: '#16A34A',
        warning: '#D97706',
        error:   '#DC2626',
      },
      borderRadius: {
        sm:  '8px',
        md:  '12px',
        lg:  '20px',
        xl:  '28px',
        '2xl': '36px',
      },
      maxWidth: {
        content: '1440px',
        reading: '720px',
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
