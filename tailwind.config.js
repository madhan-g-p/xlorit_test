/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/**/*.{js,ts,jsx,tsx,html}",
      'node_modules/preline/dist/*.js'
    ],
    theme: {
      extend: {
        screens: {
          'xsm': {'min': '468px'},
          'lg': { 'min': '1025px'},
          'max-xsm': { 'max': '468px'},
          'max-sm': { 'max': '639px' },
          'max-md': { 'max': '767px' },
          'max-lg': { 'max': '1024px' },
          'max-xl': { 'max': '1279px' },
          'max-2xl': { 'max': '1535px' },
        },
      },
    },
    plugins: [
      require('preline/plugin')
    ],
  }
  
  