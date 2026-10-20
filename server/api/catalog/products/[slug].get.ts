export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({ statusCode: 400, statusMessage: 'Slug produk tidak tersedia.' })
  }

  return await $fetch(`${config.creativeApiBase}/catalog/products/${encodeURIComponent(slug)}`)
})
