/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fd6b67',
      },
      backgroundColor: {
        'app-bg': '#D0D4E3',
      },
      opacity: {
        '40': '0.4',
        '60': '0.6',
      },
    },
  },
  plugins: [],
  safelist: [
    'bg-opacity-10',
    'bg-opacity-20',
    'bg-opacity-30',
    'bg-opacity-40',
    'bg-opacity-50',
    'bg-opacity-60',
    'bg-opacity-70',
    'bg-opacity-80',
    'bg-opacity-90',
    'text-opacity-10',
    'text-opacity-20',
    'text-opacity-30',
    'text-opacity-40',
    'text-opacity-50',
    'text-opacity-60',
    'text-opacity-70',
    'text-opacity-80',
    'text-opacity-90',
  ]
}