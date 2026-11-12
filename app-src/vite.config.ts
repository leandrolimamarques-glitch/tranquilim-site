/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// O app é servido pelo próprio servidor (server/index.ts) em app.tranquilim.com.br.
// O build do Vite vai para dist/public; o do servidor, para dist/index.js.
export default defineConfig({
  base: "/",
  build: { outDir: "dist/public", emptyOutDir: true },
  server: { proxy: { "/api": "http://localhost:8080" } },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      workbox: {
        // Rotas do servidor nunca caem no index.html do app (ex.: abrir a foto da carteira).
        navigateFallbackDenylist: [/^\/api\//],
        // Fontes e ícones também ficam guardados para abrir sem internet.
        globPatterns: ["**/*.{js,css,html,woff2,png,svg,webp}"],
      },
      manifest: {
        name: "Tranquilim",
        short_name: "Tranquilim",
        description: "Orientação em saúde infantil feita por médicos.",
        lang: "pt-BR",
        start_url: "/",
        scope: "/",
        display: "standalone",
        background_color: "#FBF7F0",
        theme_color: "#1E2A47",
        icons: [
          { src: "icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png" },
          { src: "icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
        ],
      },
    }),
  ],
  test: { environment: "node", include: ["src/**/*.test.ts", "server/**/*.test.ts"] },
});
