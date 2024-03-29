const plugin = require('tailwindcss/plugin')

module.exports = {
  purge: [
    './public/**/*.html',
    './src/**/*.vue',
  ],
  darkMode: false,
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
      },
      screens: {
        'sm': '640px',  
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px'
      },
    },
    backdropFilter: {
      'none': 'none',
      'blur': 'blur(8px)',
    },
    extend: {
      cursor: {
        'nesw-resize': 'nesw-resize'
      },
      animation: {
        'spin-slow': 'spin 2s linear infinite',
      },
      fontFamily: {
        'neue-machina': ['NeueMachina', 'sans-serif'],
        'swiss-black': ['SwissBlack', 'sans-serif'],
        'hadogenes-regular': ['Hadogenes', 'sans-serif'],
        'beaufort-regular': ['Beaufort', 'sans-serif'],
      },
      colors: {
        primary: '#bcbfd4',
        secondary: '#e4fd41'
      },
      boxShadow: {
        primary: '0px 0px .25rem .25rem rgba(188, 191, 212, 1)',
        secondary: '0px 0px .25rem .25rem rgba(228, 253, 65, 1)',
        'secondary-large': '0px 0px 2rem 2rem rgba(228, 253, 65, 1)',
        black: '0px 0px .5rem .25rem rgba(0, 0, 0, .2)'
      },
    },
  },
  variants: {
    animation: ['responsive', 'motion-safe', 'motion-reduce'],
    mixBlendMode: ['responsive'],
    backgroundBlendMode: ['responsive'],
    isolation: ['responsive'],
    extend: {
      margin: ['hover'],
      padding: ['first'],
      transitionProperty: ['hover']
    },
  },
  plugins: [
    plugin(function({ addUtilities }){
      const newUtilities = {
        '.safe-top' : {
          paddingTop: 'constant(safe-area-inset-top)',
          paddingTop: 'env(safe-area-inset-top)'
        },
        '.safe-left' : {
          paddingLeft: 'constant(safe-area-inset-left)',
          paddingLeft: 'env(safe-area-inset-left)'
        },
        '.safe-right' : {
          paddingRight: 'constant(safe-area-inset-right)',
          paddingRight: 'env(safe-area-inset-right)'
        },
        '.safe-bottom' : {
          paddingBottom: 'constant(safe-area-inset-bottom)',
          paddingBottom: 'env(safe-area-inset-bottom)'
        },
        '.disable-scrollbars' : {
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar' : {
            width: '0px',
            background: 'transparent',
            display: 'none'
          },
          '& *::-webkit-scrollbar' : {
            width: '0px',
            background: 'transparent',
            display: 'none'
          },
          '& *' : {
            scrollbarWidth: 'none',
            '-ms-overflow-style': 'none'
          }
        }
      }
      addUtilities( newUtilities );
    }),
    require('tailwindcss-filters'),
  ],
}
