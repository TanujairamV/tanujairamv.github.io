/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        agoka: ['Agoka', 'serif'],
        carlo: ['Carlo', 'sans-serif'],
        dream: ['Dream Avenue', 'cursive'],
        caviar: ['Caviar Dreams', 'sans-serif'],
        hatton: ['Hatton', 'serif'],
        unica: ['Unica One', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
