// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontSize: {
        'display-xl': ['clamp(2.5rem, 5vw + 1rem, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2rem, 3.5vw + 1rem, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'display-md': ['clamp(1.5rem, 2vw + 1rem, 2.25rem)', { lineHeight: '1.2', letterSpacing: '-0.015em' }],
        'eyebrow': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.1em' }],
      },
      fontFamily: {
        sans: ['var(--font-space-grotesk)', ...fontFamily.sans],
        serif: ['var(--font-display-serif)', ...fontFamily.serif],
        mono: ['var(--font-display-mono)', ...fontFamily.mono],
      },
      colors: {
        primary: {
          50: 'rgb(var(--primary-50) / <alpha-value>)',
          100: 'rgb(var(--primary-100) / <alpha-value>)',
          200: 'rgb(var(--primary-200) / <alpha-value>)',
          300: 'rgb(var(--primary-300) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          600: 'rgb(var(--primary-600) / <alpha-value>)',
          700: 'rgb(var(--primary-700) / <alpha-value>)',
          800: 'rgb(var(--primary-800) / <alpha-value>)',
          900: 'rgb(var(--primary-900) / <alpha-value>)',
          950: 'rgb(var(--primary-950) / <alpha-value>)',
        },
        gray: colors.gray,
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.600'),
              '&:hover': {
                color: `${theme('colors.primary.600')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h3: {
              fontWeight: '600',
            },
            code: {
              color: theme('colors.indigo.500'),
            },
            p: {
              lineHeight: '1.75',
            },
            'h2,h3': {
              scrollMarginTop: '5rem',
            },
            figcaption: {
              textAlign: 'center',
              fontStyle: 'italic',
              color: theme('colors.gray.500'),
            },
            blockquote: {
              fontStyle: 'italic',
              borderLeftColor: theme('colors.primary.500'),
              color: theme('colors.gray.700'),
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.primary.400'),
              '&:hover': {
                color: `${theme('colors.primary.400')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
            blockquote: {
              color: theme('colors.gray.300'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
