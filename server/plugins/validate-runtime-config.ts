const productionApiBase = 'https://api.creative-prob.my.id/api'
const localhostHosts = new Set(['localhost', '127.0.0.1', '::1', '0.0.0.0'])

function normalizeUrl(value: string) {
  return value.replace(/\/+$/, '')
}

export default defineNitroPlugin(() => {
  const config = useRuntimeConfig()

  // appEnvironment terbawa dari build; NODE_ENV menutup kemungkinan
  // EnvironmentFile yang salah menurunkan mode aplikasi ke development.
  const isProduction = config.appEnvironment === 'production' || process.env['NODE_ENV'] === 'production'

  if (!isProduction) {
    return
  }

  let apiUrl: URL

  try {
    apiUrl = new URL(config.creativeApiBase)
  } catch {
    throw new Error('NUXT_CREATIVE_API_BASE production harus berupa URL absolut HTTPS.')
  }

  if (localhostHosts.has(apiUrl.hostname)) {
    throw new Error('NUXT_CREATIVE_API_BASE tidak boleh menunjuk localhost pada production.')
  }

  if (apiUrl.protocol !== 'https:') {
    throw new Error('NUXT_CREATIVE_API_BASE production harus menggunakan HTTPS.')
  }

  if (normalizeUrl(config.creativeApiBase) !== productionApiBase) {
    throw new Error(`NUXT_CREATIVE_API_BASE production harus ${productionApiBase}.`)
  }

  if (normalizeUrl(config.public.siteUrl) !== 'https://creative-prob.my.id') {
    throw new Error('NUXT_PUBLIC_SITE_URL production harus https://creative-prob.my.id.')
  }
})
