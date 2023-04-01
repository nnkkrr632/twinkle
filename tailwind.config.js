/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    darkMode: 'class',
    content: [
        './components/**/*.{js,vue,ts}',
        './layouts/**/*.vue',
        './pages/**/*.vue',
        './plugins/**/*.{js,ts}',
        './nuxt.config.{js,ts}',
        './app.vue',
    ],
    safelist: [
        'grid-cols-1',
        'grid-cols-2',
        'grid-cols-3',
    ],
    theme: {
        // @link https://tailwindcss.com/docs/screens#adding-smaller-breakpoints
        screens: {
            xs: '500px',
            ...defaultTheme.screens,
        },
        extend: {},
    },
    plugins: [require('@tailwindcss/line-clamp')],
}
