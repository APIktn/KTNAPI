import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig({
  plugins: [
    react(),
    basicSsl(),
  ],
  server: {
    https: true,
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./setupTests.js",
  },
  resolve: {
    alias: {
      "\\.(png|jpg|jpeg|svg|gif|mp4|webm)$":
        "/src/__mocks__/fileMock.js",
    },
  },
});
