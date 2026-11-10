export default defineEventHandler(async () => {
  const config = useRuntimeConfig();

  return await $fetch(`${config.creativeApiBase}/site/social-media`);
});
