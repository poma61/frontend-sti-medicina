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
        theme_color: '#ffffff',
        background_color: "#ffffff",
        display: "standalone",
        orientation: 'portrait',
        lang: "es",
        icons: [
          {
            src: "./icons/icono-medicina.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "./icons/icono-medicina.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "./icons/icono-medicina.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable"
          },
          {
            src: "./icons/icono-medicina.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable"
          }
        ],
      }, // manifest
      workbox: {
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
