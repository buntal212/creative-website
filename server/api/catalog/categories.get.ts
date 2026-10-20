export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  return await $fetch(`${config.creativeApiBase}/catalog/categories`)
})
