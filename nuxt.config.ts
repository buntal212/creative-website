export default defineNuxtConfig({
  compatibilityDate: '2026-10-10',
  ssr: true,
  runtimeConfig: {
    creativeApiBase: process.env.NUXT_CREATIVE_API_BASE || 'http://127.0.0.1:8888/api',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    },
  },
  css: ['~/assets/css/main.css'],
  app: { head: { htmlAttrs: { lang: 'id' }, title: 'JERSEYKU | Custom Jersey Printing', meta: [{ name: 'description', content: 'Jersey custom printing premium untuk futsal, sepak bola, esports, basket dan komunitas. Konsultasi desain dan pesan jersey tim Anda.' }] } }
})
