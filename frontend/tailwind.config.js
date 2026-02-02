/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // 1. COLORES (Para el modo oscuro estilo Cruip)
      colors: {
        slate: {
            900: '#0f172a', // Fondo principal
            800: '#1e293b', // Fondo tarjetas
        },
        purple: {
            600: '#7c3aed', // Botón primario
            500: '#8b5cf6', // Hover
        }
      },
      
      // 2. TIPOGRAFÍA
      fontFamily: {
        sans: ['Inter', 'sans-serif'], 
      },
      
      // 3. IMÁGENES DE FONDO (El brillo superior)
      backgroundImage: {
        'hero-glow': "radial-gradient(ellipse at top, rgba(124, 58, 237, 0.3), transparent 70%)",
      },

      // 4. ANIMACIONES PERSONALIZADAS
      animation: {
        "fade-in-up": "fadeInUp 0.8s ease-out forwards", 
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "gradient-x": "gradient-x 15s ease infinite",
      },
      
      // 5. KEYFRAMES (La lógica de las animaciones)
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "gradient-x": {
          "0%, 100%": {
             "background-size": "200% 200%",
             "background-position": "left center"
          },
          "50%": {
             "background-size": "200% 200%",
             "background-position": "right center"
          },
        },
      },
    },
  },
  plugins: [],
}