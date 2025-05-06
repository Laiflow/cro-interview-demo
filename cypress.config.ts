import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:5173",
    viewportWidth: 375,
    viewportHeight: 667,
    supportFile: "cypress/support/e2e.ts",
  },
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
