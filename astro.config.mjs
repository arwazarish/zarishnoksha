import { defineConfig } from "astro/config";
import { zarishnokshaShikiThemes } from "./site/lib/zarishnoksha-shiki-theme.mjs";

export default defineConfig({
  site: "https://zarishnoksha.pages.dev",
  srcDir: "./site",
  publicDir: "./site/public",
  output: "static",
  markdown: {
    shikiConfig: {
      themes: zarishnokshaShikiThemes,
      defaultColor: false,
    },
  },
  devToolbar: {
    enabled: false,
  },
  build: {
    format: "directory",
  },
  outDir: "./build",
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
  },
});
