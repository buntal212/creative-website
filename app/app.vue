<script setup lang="ts">
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl.replace(/\/$/, '')

useHead({
  script: [
    {
      key: 'ld-organization',
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: 'CREATIVE Custom Apparel',
        url: siteUrl,
        description: 'Jersey custom printing untuk tim, sekolah, komunitas, dan perusahaan.',
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: '+6282334148314',
          contactType: 'sales',
          availableLanguage: 'Indonesian',
        },
      }),
    },
  ],
})
</script>

<template><NuxtPage /></template>
