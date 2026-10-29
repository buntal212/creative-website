<script setup lang="ts">
interface ProductImage {
  id: number
  url: string
  alt_text?: string | null
  is_thumbnail: boolean
}

interface ProductDetail {
  name: string
  slug: string
  sku?: string | null
  description?: string | null
  price: number | string
  stock: number
  category?: { name: string; slug: string } | null
  thumbnail?: ProductImage | null
  images: ProductImage[]
}

const route = useRoute()
const config = useRuntimeConfig()
const slug = String(route.params.slug)
const { data, error } = await useFetch<ProductDetail>(`/api/catalog/products/${encodeURIComponent(slug)}`)

if (error.value || !data.value) {
  throw createError({ statusCode: 404, statusMessage: 'Produk tidak ditemukan.' })
}

const product = data.value
const selectedImage = ref<ProductImage | null>(product.thumbnail || product.images[0] || null)

const changeImage = (direction: 1 | -1) => {
  const images = product.images

  if (images.length < 2) return

  const currentIndex = images.findIndex((image) => image.id === selectedImage.value?.id)
  const nextIndex = currentIndex === -1
    ? 0
    : (currentIndex + direction + images.length) % images.length

  selectedImage.value = images[nextIndex]
}

const siteUrl = config.public.siteUrl.replace(/\/$/, '')
const canonicalUrl = `${siteUrl}/produk/${product.slug}`
const description = product.description?.trim() || `Informasi lengkap ${product.name} dari CREATIVE Custom Apparel.`
const productImages = product.images.map((image) => image.url).filter(Boolean)
const primaryImage = product.thumbnail?.url || productImages[0]

const rupiah = (price: number | string) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(price))

const orderUrl = `https://wa.me/6282334148314?text=${encodeURIComponent(`Halo CREATIVE, saya ingin pesan ${product.name}. Mohon info detailnya.`)}`

useSeoMeta({
  title: `${product.name} | CREATIVE Custom Apparel`,
  description,
  ogTitle: `${product.name} | CREATIVE Custom Apparel`,
  ogDescription: description,
  ogType: 'product',
  ogUrl: canonicalUrl,
  ogImage: primaryImage || undefined,
  ogSiteName: 'CREATIVE Custom Apparel',
  twitterCard: 'summary_large_image',
  twitterTitle: `${product.name} | CREATIVE Custom Apparel`,
  twitterDescription: description,
  twitterImage: primaryImage,
})

const productSchema = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: product.name,
  description,
  ...(productImages.length ? { image: productImages } : {}),
  ...(product.sku ? { sku: product.sku } : {}),
  brand: { '@type': 'Brand', name: 'CREATIVE Custom Apparel' },
  ...(product.category?.name ? { category: product.category.name } : {}),
  offers: {
    '@type': 'Offer',
    priceCurrency: 'IDR',
    price: Number(product.price),
    availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
    itemCondition: 'https://schema.org/NewCondition',
    url: canonicalUrl,
  },
}

useHead({
  link: [{ key: 'canonical', rel: 'canonical', href: canonicalUrl }],
  script: [
    {
      key: 'ld-product',
      type: 'application/ld+json',
      children: JSON.stringify(productSchema),
    },
  ],
})
</script>

<template>
  <div class="product-detail-page">
    <AppHeader />
    <main class="product-detail container detail-enter">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <NuxtLink to="/">Beranda</NuxtLink><span>/</span><NuxtLink to="/#produk">Produk</NuxtLink><span>/</span><b>{{ product.name }}</b>
      </nav>

      <article class="product-detail-grid">
        <section class="product-gallery detail-reveal gallery-reveal" aria-label="Galeri foto produk">
          <div class="product-image-stage">
            <Transition name="product-image" mode="out-in">
              <div v-if="selectedImage" :key="selectedImage.id" class="main-product-image"><img :src="selectedImage.url" :alt="selectedImage.alt_text || product.name" fetchpriority="high" /></div>
              <div v-else key="unavailable" class="main-product-image image-unavailable">Foto produk segera tersedia</div>
            </Transition>
            <div v-if="product.images.length > 1" class="product-image-controls">
              <button type="button" class="product-image-arrow previous" aria-label="Foto sebelumnya" title="Foto sebelumnya" @click="changeImage(-1)">&#8249;</button>
              <button type="button" class="product-image-arrow next" aria-label="Foto berikutnya" title="Foto berikutnya" @click="changeImage(1)">&#8250;</button>
            </div>
          </div>
          <div v-if="product.images.length > 1" class="product-thumbnails">
            <button v-for="image in product.images" :key="image.id" type="button" :class="{ active: selectedImage?.id === image.id }" :aria-label="`Lihat foto ${image.alt_text || product.name}`" @click="selectedImage = image"><img :src="image.url" :alt="image.alt_text || product.name" loading="lazy" /></button>
          </div>
        </section>

        <section class="product-summary detail-reveal summary-reveal">
          <p class="detail-category">{{ product.category?.name || 'Produk CREATIVE' }}</p>
          <h1>{{ product.name }}</h1>
          <p class="detail-price">{{ rupiah(product.price) }}</p>
          <div class="detail-divider"></div>
          <div class="detail-description"><h2>Deskripsi Produk</h2><p>{{ description }}</p></div>
          <p class="stock-status" :class="product.stock > 0 ? 'in-stock' : 'out-of-stock'">{{ product.stock > 0 ? `Stok tersedia (${product.stock})` : 'Stok sedang habis' }}</p>
          <a class="detail-order-button" :href="orderUrl" target="_blank" rel="noopener">Pesan via WhatsApp <span>↗</span></a>
          <p class="detail-note">Butuh desain atau ukuran khusus? Hubungi kami untuk konsultasi.</p>
        </section>
      </article>
    </main>
    <AppFooter />
  </div>
</template>
