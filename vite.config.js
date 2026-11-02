import { defineConfig } from "vite";
import path from "path"

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.js"),
      // global name exposed by the UMD build: window.canvasTextParagraphs
      name: 'canvasTextParagraphs',
      fileName: (format) => `index.${format}.js`,
      formats: ['cjs', 'es', 'umd']
    },
    rollupOptions: {
      output: {
        globals: {}
      }
    },
    sourcemap: true,
    emptyOutDir: true,
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.test.js'],
    setupFiles: ['tests/setup.js'],
  },
})