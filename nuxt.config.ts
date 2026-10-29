const isProductionBuild = process.env.NODE_ENV === 'production'

const defaults = isProductionBuild
  ? {
      creativeApiBase: 'https://api.creative-prob.my.id/api',
      siteUrl: 'https://creative-prob.my.id',
    }
  : {
      creativeApiBase: 'http://127.0.0.1:8888/api',
      siteUrl: 'http://localhost:3000',
    }

export default defineNuxtConfig({
  compatibilityDate: '2026-10-10',
  ssr: true,
  runtimeConfig: {
    // NUXT_* dibaca Nitro saat aplikasi berjalan, sehingga systemd dapat
    // menggantinya tanpa membangun ulang artefak SSR.
    appEnvironment: process.env.NUXT_APP_ENVIRONMENT || process.env.NODE_ENV || 'development',
    creativeApiBase: process.env.NUXT_CREATIVE_API_BASE || defaults.creativeApiBase,
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || defaults.siteUrl,
    },
  },
  css: ['~/assets/css/main.css'],
  app: { head: { htmlAttrs: { lang: 'id' }, title: 'JERSEYKU | Custom Jersey Printing', meta: [{ name: 'description', content: 'Jersey custom printing premium untuk futsal, sepak bola, esports, basket dan komunitas. Konsultasi desain dan pesan jersey tim Anda.' }] } }
})
