import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'dev-html-rewrite',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/' || req.url === '/index.html') {
            req.url = '/index.dev.html'
          }
          next()
        })
      },
    },
  ],
  server: {
    host: true,
    port: 5173,
  },
  base: './',
  build: {
    rollupOptions: {
      input: {
        main: './index.dev.html',
      },
    },
  },
})

