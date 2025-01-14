/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#3c303e',
        'secondary': '#6e4377',
        'tertiary': '#824b8e', 
        'accent-green': '#9ede63',
        'accent-orange': '#ffc26c',
        'accent-red': '#e06060',

        'primary-light': '#c6a4cb',
        'secondary-light': '#a572af',
        'tertiary-light': '#985ea4', 
        'accent-green-light': '#5BA714',
        'accent-orange-light': '#F7A93B',
        'accent-red-light': '#D43A3A',
      },
    },
  },
  plugins: [],
}

