interface CatalogProduct {
  slug: string
  updated_at?: string | null
}

interface CatalogPage {
  data: CatalogProduct[]
  current_page: number
  last_page: number
}

function escapeXml(value: string) {
  return value.replace(/[<>&'\"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[character] || character)
}

function lastModified(value?: string | null) {
  if (!value || Number.isNaN(Date.parse(value))) return ''

  return `<lastmod>${new Date(value).toISOString()}</lastmod>`
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const siteUrl = config.public.siteUrl.replace(/\/$/, '')
  const products: CatalogProduct[] = []
  let page = 1
  let lastPage = 1

  while (page <= lastPage) {
    const response = await $fetch<CatalogPage>(`${config.creativeApiBase}/catalog/products`, {
      query: { page, per_page: 100 },
    })

    products.push(...response.data.filter((product) => typeof product.slug === 'string' && product.slug.length > 0))
    lastPage = Math.max(response.last_page || 1, 1)
    page += 1
  }

  const urls = new Map<string, string>()
  urls.set(`${siteUrl}/`, '<changefreq>weekly</changefreq><priority>1.0</priority>')

  for (const product of products) {
    const location = `${siteUrl}/produk/${encodeURIComponent(product.slug)}`
    urls.set(location, `${lastModified(product.updated_at)}<changefreq>weekly</changefreq><priority>0.8</priority>`)
  }

  setResponseHeader(event, 'content-type', 'application/xml; charset=UTF-8')
  setResponseHeader(event, 'cache-control', 'public, max-age=0, s-maxage=3600')

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...urls].map(([location, metadata]) => `  <url><loc>${escapeXml(location)}</loc>${metadata}</url>`).join('\n')}\n</urlset>`
})
