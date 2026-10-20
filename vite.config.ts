import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" makes the built site work from any sub-path (GitHub Pages, Azure Static Web Apps, a plain folder…)
export default defineConfig({ plugins: [react()], base: "./" });
