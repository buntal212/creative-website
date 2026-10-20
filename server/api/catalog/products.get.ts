export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)
  const query = getQuery(event)

  return await $fetch(`${config.creativeApiBase}/catalog/products`, {
    query: {
      per_page: query.per_page || 6,
      search: query.search || undefined,
    },
  })
})
