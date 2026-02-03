/// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./setupTests.js",
    exclude: [
      "node_modules",
      "dist",
      "coverage",
    ],
  },
  resolve: {
    alias: {
      "\\.(css|less|scss)$": "/__mocks__/fileMock.js",
      "\\.(jpg|jpeg|png|gif|svg|mp4|webm)$": "/__mocks__/fileMock.js",
    },
  },
});
