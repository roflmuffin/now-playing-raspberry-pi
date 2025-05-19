// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/fonts", "@nuxtjs/color-mode"],
  colorMode: {
    classSuffix: "-theme",
  },
  runtimeConfig: {
    LASTFM_API_KEY: process.env.LASTFM_API_KEY,
    LASTFM_USERNAME: process.env.LASTFM_USERNAME,
    SPOTIFY_CLIENT_ID: process.env.SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET: process.env.SPOTIFY_CLIENT_SECRET,
    SPOTIFY_REFRESH_TOKEN: process.env.SPOTIFY_REFRESH_TOKEN,
  },
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      // Run `cms:update` task every minute
      "*/10 * * * * *": ["now-playing"],
    },
  },
});
