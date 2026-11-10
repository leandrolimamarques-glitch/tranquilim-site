/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// O app é publicado em tranquilim.com.br/app/ pelo GitHub Pages, a partir da
// pasta /app na raiz do repositório (o build é commitado junto com o código).
export default defineConfig({
  base: "/app/",
  build: { outDir: "../app", emptyOutDir: true },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Tranquilim",
        short_name: "Tranquilim",
        description: "Orientação em saúde infantil feita por médicos.",
        lang: "pt-BR",
        start_url: "/app/",
        scope: "/app/",
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
  test: { environment: "node" },
});
