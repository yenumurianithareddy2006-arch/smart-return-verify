/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#071224',
          900: '#0a192f',
          850: '#0f274a',
          800: '#15325b',
          700: '#1e3a8a',
          600: '#25499f',
        },
        brand: {
          primary: '#1d4ed8', // Royal Blue
          secondary: '#4338ca', // Indigo / Purple
          accent: '#0284c7', // Sky Blue
          cyan: '#06b6d4',
          success: '#10b981', // Subtle Green
          surface: '#f8fbfe',
          surfaceAlt: '#f0f7ff',
          card: '#ffffff',
          border: '#e2e8f0',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 39, 74, 0.06), 0 2px 6px -1px rgba(15, 39, 74, 0.03)',
        'soft-lg': '0 12px 30px -4px rgba(15, 39, 74, 0.08), 0 4px 12px -2px rgba(15, 39, 74, 0.04)',
        'soft-xl': '0 20px 40px -6px rgba(15, 39, 74, 0.12), 0 8px 16px -4px rgba(15, 39, 74, 0.06)',
      }
    },
  },
  plugins: [],
}
