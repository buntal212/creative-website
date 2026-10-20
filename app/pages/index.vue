<script setup lang="ts">
const wa = (message: string) => `https://wa.me/6282334148314?text=${encodeURIComponent(message)}`

const gallery = [
  { title: 'Tim Futsal', image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=700&q=80' },
  { title: 'Komunitas', image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=700&q=80' },
  { title: 'Tim Sepak Bola', image: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=700&q=80' },
  { title: 'Esports Team', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700&q=80' },
]

interface CatalogProduct {
  slug: string
  name: string
  price: number | string
  category?: { name: string } | null
  thumbnail?: { url: string; alt_text?: string | null } | null
}

interface CatalogResponse {
  data: CatalogProduct[]
}

interface CatalogCategory {
  slug: string
  name: string
  products_count: number
  thumbnail?: { url: string; alt_text?: string | null } | null
}

const { data: catalog } = await useFetch<CatalogResponse>('/api/catalog/products', {
  query: { per_page: 6 },
  default: () => ({ data: [] }),
})
const products = computed(() => catalog.value?.data || [])
const { data: catalogCategories } = await useFetch<CatalogCategory[]>('/api/catalog/categories', {
  default: () => [],
})
const categories = computed(() => catalogCategories.value || [])

useSeoMeta({
  title: 'CREATIVE | Custom Jersey Printing Premium',
  description: 'Pesan jersey custom printing untuk futsal, sepak bola, esports, basket, sekolah dan komunitas. Desain bebas, bahan premium, dan proses mudah.',
  ogTitle: 'CREATIVE - Desain Bebas, Kualitas Premium',
  ogDescription: 'Jersey custom untuk tim dan komunitas Anda.',
})
</script>

<template>
  <div id="beranda">
    <AppHeader />
    <main>
      <section class="hero">
        <div class="container hero-grid">
          <div class="hero-copy">
            <div class="eyebrow">CREATIVE CUSTOM APPAREL <span class="gold-line"></span></div>
            <h1>DESAIN BEBAS<br /><em>KUALITAS PREMIUM</em></h1>
            <p>Wujudkan jersey impian tim, komunitas, sekolah atau perusahaan dengan desain bebas, bahan nyaman dan hasil cetak tajam.</p>
            <div class="hero-buttons">
              <a class="btn btn-gold" :href="wa('Halo CREATIVE, saya ingin buat jersey custom.')" target="_blank" rel="noopener">Buat Jersey Custom <span>&nearr;</span></a>
              <a class="btn btn-outline" href="#produk">Lihat Koleksi <span>&rarr;</span></a>
            </div>
            <div class="features">
              <div><b>◇</b><span>Desain Bebas<small>Sesuai keinginan</small></span></div>
              <div><b>▱</b><span>Bahan Premium<small>Nyaman dipakai</small></span></div>
              <div><b>⚙</b><span>Produksi Cepat<small>Tepat waktu</small></span></div>
              <div><b>↗</b><span>Pengiriman<small>Seluruh Indonesia</small></span></div>
            </div>
          </div>
          <div class="hero-photo"><img src="/images/hero-jersey.svg" alt="Koleksi jersey custom premium hitam dan emas" fetchpriority="high" /><div class="photo-shade"></div></div>
        </div>
      </section>

      <section class="section categories-section" id="kategori">
        <div class="container">
          <div class="section-heading"><div><h2>Kategori Produk</h2><p>Pilih kategori sesuai kebutuhanmu</p></div><a href="#produk">Lihat Semua &rarr;</a></div>
          <div v-if="categories.length" class="categories-grid"><a v-for="category in categories" :key="category.slug" href="#produk" class="category-card"><img v-if="category.thumbnail?.url" :src="category.thumbnail.url" :alt="category.thumbnail.alt_text || category.name" loading="lazy" /><div v-else class="category-image-fallback" aria-hidden="true">{{ category.name.slice(0, 1) }}</div><span>{{ category.name }}</span></a></div>
          <p v-else class="categories-empty">Kategori akan segera hadir.</p>
        </div>
      </section>

      <section class="section products-section" id="produk">
        <div class="container">
          <div class="section-heading"><div><h2>Koleksi Produk</h2><p>Produk terbaru langsung dari katalog CREATIVE</p></div><a :href="wa('Halo, saya ingin melihat katalog jersey lengkap.')" target="_blank" rel="noopener">Lihat Semua &rarr;</a></div>
          <div v-if="products.length" class="products-grid"><ProductCard v-for="product in products" :key="product.slug" :product="product" /></div>
          <p v-else class="products-empty">Koleksi produk akan segera hadir.</p>
        </div>
      </section>

      <section class="custom-strip" id="custom"><div class="container custom-inner"><div><span class="eyebrow">PESANAN KHUSUS UNTUK TIM ANDA</span><h2>Custom Jersey Tim / Komunitas</h2><p>Mulai dari desain, pemilihan warna, logo, nama pemain, hingga ukuran. Kami siap membantu mewujudkan jersey impian kamu.</p></div><a class="btn btn-gold" :href="wa('Halo, saya ingin konsultasi jersey custom untuk tim.')" target="_blank" rel="noopener">◉ &nbsp; Konsultasi Sekarang &rarr;</a></div></section>

      <section class="section gallery-section" id="galeri"><div class="container"><div class="section-heading"><div><h2>Galeri Produksi</h2><p>Inspirasi jersey untuk berbagai tim dan komunitas</p></div><a href="#kontak">Hubungi Kami &rarr;</a></div><div class="gallery-grid"><div v-for="item in gallery" :key="item.title" class="gallery-card"><img :src="item.image" :alt="item.title" loading="lazy" /><span>{{ item.title }}</span></div></div></div></section>

      <section class="about-section" id="tentang"><div class="container about-inner"><div><span class="eyebrow">KENAPA CREATIVE?</span><h2>Jersey bagus dimulai dari detail yang tepat.</h2></div><p>Kami mengutamakan desain yang sesuai identitas tim, bahan yang nyaman, dan komunikasi yang jelas sejak konsultasi hingga pengiriman.</p></div></section>
    </main>
    <AppFooter />
  </div>
</template>
