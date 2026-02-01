/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#fef3e2',
                    100: '#fde4b8',
                    200: '#fcd489',
                    300: '#fbc45a',
                    400: '#fab836',
                    500: '#f9ac12',
                    600: '#f8a410',
                    700: '#f7990d',
                    800: '#f68f0a',
                    900: '#f57c05',
                },
                dark: {
                    50: '#f5f7fa',
                    100: '#e4e7eb',
                    200: '#cbd2d9',
                    300: '#9aa5b1',
                    400: '#7b8794',
                    500: '#616e7c',
                    600: '#52606d',
                    700: '#3e4c59',
                    800: '#323f4b',
                    900: '#1f2933',
                }
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'bounce-slow': 'bounce 2s infinite',
                'slide-up': 'slide-up 0.5s ease-out',
            }
        },
    },
    plugins: [],
}
