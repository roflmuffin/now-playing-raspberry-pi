import { defineNuxtConfig } from "nuxt";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  typescript: {
    shim: false,
  },
  runtimeConfig: {
    LASTFM_API_KEY: process.env.LASTFM_API_KEY,
    LASTFM_USERNAME: process.env.LASTFM_USERNAME,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REDIRECT_DOMAIN: process.env.SPOTIFY_REDIRECT_DOMAIN,
  },
  nitro: {
    esbuild: {
      options: {
        target: "es2020",
      },
    },
  },
  ssr: false,
});
