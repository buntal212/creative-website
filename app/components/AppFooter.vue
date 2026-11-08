<script setup lang="ts">
interface SiteContact {
  whatsapp?: string | null
  phone?: string | null
  email?: string | null
  address?: string | null
  instagram_url?: string | null
  business_hours?: string | null
}

const defaultContact: Required<SiteContact> = {
  whatsapp: '6282334148314',
  phone: '0823-3414-8314',
  email: '',
  address: '',
  instagram_url: '',
  business_hours: '',
}

const { data: siteContact } = await useFetch<SiteContact>('/api/site/contact', {
  default: () => defaultContact,
})
const contact = computed(() => ({ ...defaultContact, ...siteContact.value }))
const whatsappUrl = computed(
  () => `https://wa.me/${(contact.value.whatsapp || defaultContact.whatsapp).replace(/\D/g, '')}`,
)
const mapSearchQuery = computed(() => contact.value.address?.trim() || 'Creative Custom Apparel')
const mapEmbedUrl = computed(
  () => `https://www.google.com/maps?q=${encodeURIComponent(mapSearchQuery.value)}&output=embed`,
)
const mapDirectionsUrl = computed(
  () => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapSearchQuery.value)}`,
)
</script>

<template>
  <footer class="footer" id="kontak">
    <div class="container footer-grid">
      <div>
        <a class="brand" href="/#beranda" aria-label="Kembali ke beranda CREATIVE">
          <img class="brand-logo" src="/images/logo-creative.png" alt="CREATIVE Custom Apparel">
          <span class="brand-text">CREATIVE<small>CUSTOM APAREL</small></span>
        </a>
        <p>Jersey custom printing untuk tim, sekolah, komunitas, dan perusahaan di Probolinggo.</p>
      </div>
      <div>
        <h3>Jelajahi</h3>
        <a href="#produk">Katalog Produk</a>
        <a href="#custom">Custom Jersey</a>
        <a href="#galeri">Galeri Produksi</a>
      </div>
      <div>
        <h3>Hubungi Kami</h3>
        <p v-if="contact.phone">Telepon: {{ contact.phone }}</p>
        <p v-if="contact.email">Email: {{ contact.email }}</p>
        <p v-if="contact.address">{{ contact.address }}</p>
        <p v-if="contact.business_hours">{{ contact.business_hours }}</p>
        <a :href="whatsappUrl" target="_blank" rel="noopener">Chat WhatsApp ↗</a>
        <a v-if="contact.instagram_url" :href="contact.instagram_url" target="_blank" rel="noopener">Instagram ↗</a>
      </div>
      <div class="location-map">
        <h3>Lokasi Creative Probolinggo</h3>
        <iframe
          :src="mapEmbedUrl"
          title="Peta lokasi Creative"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
        <a :href="mapDirectionsUrl" target="_blank" rel="noopener">Buka di Google Maps ↗</a>
      </div>
    </div>
    <div class="container footer-copy">© {{ new Date().getFullYear() }} CREATIVE. Hak cipta dilindungi.</div>
  </footer>
</template>

<style scoped>
:global(.footer-grid) {
  grid-template-columns: 1.65fr 0.8fr 1fr 1.35fr;
}

.location-map iframe {
  display: block;
  width: 100%;
  height: 155px;
  border: 0;
  border-radius: 7px;
  background: #232527;
}

.location-map > a {
  display: inline-block;
  margin: 10px 0 0;
  color: #e5be71;
  font-weight: 700;
}

@media (max-width: 800px) {
  :global(.footer-grid) {
    grid-template-columns: 1fr;
  }

  .location-map iframe {
    height: 210px;
  }
}
</style>
