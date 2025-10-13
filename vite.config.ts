import { defineConfig } from "vite";
import { resolve } from "path";
import { copyFileSync, existsSync, mkdirSync } from "fs";

export default defineConfig({
  build: {
    outDir: "dist",
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup.html"),
      },
    },
  },
  publicDir: "public",
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  plugins: [
    {
      name: "copy-popup",
      writeBundle() {
        // Copy popup.html to dist root
        const srcPath = resolve(__dirname, "dist/src/popup.html");
        const destPath = resolve(__dirname, "dist/popup.html");
        if (existsSync(srcPath)) {
          copyFileSync(srcPath, destPath);
        }
      },
    },
  ],
});
