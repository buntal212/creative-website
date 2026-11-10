<script setup lang="ts">
interface SiteContact {
  id: number;
  name: string;
  phone: string;
}

const { data: contacts } = await useFetch<SiteContact[]>("/api/site/contact", {
  default: () => [],
});

function phoneUrl(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}
</script>

<template>
  <footer class="footer" id="kontak">
    <div class="container footer-grid">
      <div>
        <a
          class="brand"
          href="/#beranda"
          aria-label="Kembali ke beranda CREATIVE"
        >
          <img
            class="brand-logo"
            src="/images/logo-creative.png"
            alt="CREATIVE Custom Apparel"
          />
          <span class="brand-text">CREATIVE<small>CUSTOM APAREL</small></span>
        </a>
        <p>
          Jersey custom printing untuk tim, sekolah, komunitas, dan perusahaan
          di Probolinggo.
        </p>
      </div>
      <div>
        <h3>Jelajahi</h3>
        <a href="#produk">Katalog Produk</a>
        <a href="#custom">Custom Jersey</a>
        <a href="#galeri">Galeri Produksi</a>
        <a href="/medsos">Media Sosial</a>
      </div>
      <div class="contact-section">
        <h3>Hubungi Kami</h3>
        <template v-if="contacts.length">
          <a
            v-for="contact in contacts"
            :key="contact.id"
            class="contact-link"
            :href="phoneUrl(contact.phone)"
          >
            <strong>{{ contact.name }}</strong>
            <span>{{ contact.phone }}</span>
          </a>
        </template>
        <p v-else class="contact-empty">
          Informasi kontak akan segera tersedia.
        </p>
      </div>
      <div class="location-map">
        <h3>Lokasi Creative Probolinggo</h3>
        <iframe
          src="https://www.google.com/maps?q=Creative%20Probolinggo&output=embed"
          title="Peta lokasi Creative Probolinggo"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
        ></iframe>
        <a
          href="https://www.google.com/maps/search/?api=1&query=Creative%20Probolinggo"
          target="_blank"
          rel="noopener"
          >Buka di Google Maps ↗</a
        >
      </div>
    </div>
    <div class="container footer-copy">
      © {{ new Date().getFullYear() }} CREATIVE. Hak cipta dilindungi.
    </div>
  </footer>
</template>

<style scoped>
:global(.footer-grid) {
  grid-template-columns: 1.65fr 0.8fr 1fr 1.35fr;
}

.contact-section .contact-link {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin: 0 0 13px;
}

.contact-link strong {
  color: #fff;
}
.contact-link span,
.contact-empty {
  color: #c4c5c6;
}
.contact-empty {
  margin-top: 0;
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
