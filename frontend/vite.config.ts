import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc'; // Ojo: Si usas @vitejs/plugin-react (sin swc), ajusta esta línea.
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    host: true, // Esto ayuda a exponerlo en red si lo necesitas
  }
});