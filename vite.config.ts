import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    // listen on all interfaces so other devices on the LAN can reach it
    host: "0.0.0.0",
    port: 8081,
    hmr: {
      overlay: false,
      // when accessing from another machine, the client websocket needs to
      // connect back using the network IP rather than `localhost`.
      host: "192.168.0.42",
      port: 8081,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
