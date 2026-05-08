/** @type {import('tailwindcss').Config} */
// ─────────────────────────────────────────────────────────────────────────────
// tailwind.config.js — full replacement for your project root
//
// Changes from your original:
//  • Added `scrollbar-none` utility for hiding scrollbars on tab rows
//  • Added `font-mono` pointing to Space Mono (matches your existing globals.css)
// ─────────────────────────────────────────────────────────────────────────────

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        jobr: {
          black:   '#0a0a0a',
          dark:    '#111111',
          card:    '#161616',
          accent:  '#e8ff47',
          muted:   '#888888',
        },
      },
    },
  },
  plugins: [
    // Inline plugin — adds `.scrollbar-none` utility
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