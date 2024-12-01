import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue"; 
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  server: {
    host: "0.0.0.0", // Permite conexiones desde cualquier IP
    port: 3000, // Cambia el puerto si es necesario
  },
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      //
      manifest: {
        name: 'InternAI',
        short_name: 'InternAI',
        description: 'Sistema Tutor Inteligente',
        theme_color: '#00838F',
        background_color: "#00838F",
        display: "standalone",
        orientation: 'portrait',
        lang: "es",
        start_url:"/",
        icons: [
          {
            src: "./icons/icono-medicina-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "./icons/icono-medicina-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "./icons/icono-medicina-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "./icons/icono-medicina-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
      }, // manifest
      workbox: {
        // Ruta SPA: todas las solicitudes de navegación van a index.html
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [
          /^\/$/, // Evitar manejar la raíz
        ],
        runtimeCaching: [
          {
            urlPattern: ({ request }) => request.destination === 'image',
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 días
              },
            },
          },
          {
            urlPattern: ({ request }) =>
              ['script', 'style', 'worker'].includes(request.destination),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'assets-cache',
            },
          },
        ],
      },

    }) //pwa
  
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
