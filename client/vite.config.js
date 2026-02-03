/// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./setupTests.js",
  },
  resolve: {
    alias: {
      "\\.(png|jpg|jpeg|svg|gif|mp4|webm)$": "/src/__mocks__/fileMock.js",
    },
  },
});
