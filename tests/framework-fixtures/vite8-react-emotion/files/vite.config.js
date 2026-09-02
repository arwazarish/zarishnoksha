import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react({ jsxImportSource: "@emotion/react" })],
  server: { host: "127.0.0.1", strictPort: false },
});
