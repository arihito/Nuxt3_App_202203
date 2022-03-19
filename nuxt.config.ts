import { defineNuxtConfig } from 'nuxt3'

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  publicRuntimeConfig: {
    APP_ENV: process.env.APP_ENV
  },
  privateRuntimeConfig: {
    API_SECRET: process.env.APP_SECRET
  }
})
