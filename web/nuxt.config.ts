// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: "2025-03-24",
  css: ["./assets/css/main.css"],
  vite: {
    plugins: [tailwindcss()],
  },
});
