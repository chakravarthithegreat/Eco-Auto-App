import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true
      },
      manifest: {
        name: 'Eco-Auto Productivity App',
        short_name: 'EcoAuto',
        description: 'Modern Employee Management System for Artgifts Manufacturing',
        theme_color: '#48C38B',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/vite.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          },
          {
            src: '/vite.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ],
        categories: ['productivity', 'business'],
        lang: 'en',
        dir: 'ltr'
      }
    })
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './tests/setup.js',
    globals: true,
  }
});