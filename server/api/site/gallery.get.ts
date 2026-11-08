export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event)

  return await $fetch(`${config.creativeApiBase}/site/gallery`)
})
