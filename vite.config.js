import { defineConfig } from "vite";
import path from "path"
import pkg from "./package.json"

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      name: pkg.name,
      fileName: (format) => `index.${format}.js`,
      formats: ['cjs', 'es', 'umd']
    },
    rollupOptions: {
    },
    sourcemap: true,
    emptyOutDir: true,
  },
})