<script setup lang="ts">
defineProps<{
  product: {
    name: string
    slug: string
    price: number | string
    category?: { name: string } | null
    thumbnail?: { url: string; alt_text?: string | null } | null
  }
}>()

const rupiah = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price)

const order = (name: string) =>
  `https://wa.me/6282334148314?text=${encodeURIComponent(`Halo CREATIVE, saya ingin pesan ${name}. Mohon info detailnya.`)}`
</script>

<template>
  <article class="product-card">
    <NuxtLink :to="`/produk/${product.slug}`" class="product-image product-link">
      <img
        v-if="product.thumbnail?.url"
        :src="product.thumbnail.url"
        :alt="product.thumbnail.alt_text || product.name"
        loading="lazy"
      />
      <div v-else class="product-image-fallback" aria-hidden="true">CREATIVE</div>
      <span class="product-tag">{{ product.category?.name || 'Produk' }}</span>
    </NuxtLink>
    <div class="product-info">
      <h3><NuxtLink :to="`/produk/${product.slug}`">{{ product.name }}</NuxtLink></h3>
      <div class="product-bottom">
        <strong>{{ rupiah(Number(product.price)) }}</strong>
        <a :href="order(product.name)" target="_blank" rel="noopener" :aria-label="`Pesan ${product.name}`">↗</a>
      </div>
    </div>
  </article>
</template>
