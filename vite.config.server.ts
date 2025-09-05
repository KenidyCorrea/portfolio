import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  root: "./client",
  build: {
    outDir: "../dist",
  },
  resolve: {
    alias: {
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
});
