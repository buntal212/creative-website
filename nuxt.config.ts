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
  nitro: {
    // Pertahankan kontrak NUXT_* untuk override runtime pada EnvironmentFile systemd.
    envPrefix: 'NUXT_',
  },
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/api/**': {
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
    '/admin/**': {
      headers: { 'X-Robots-Tag': 'noindex, nofollow, noarchive' },
    },
  },
  app: {
    head: {
      htmlAttrs: { lang: 'id' },
      title: 'CREATIVE Custom Apparel',
      meta: [
        {
          name: 'description',
          content: 'Jersey custom printing premium untuk futsal, sepak bola, esports, basket, sekolah, dan komunitas.',
        },
      ],
    },
  },
})
