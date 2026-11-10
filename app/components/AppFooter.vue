<script setup lang="ts">
interface SiteContact {
  id: number;
  name: string;
  phone: string;
}

interface SocialMedia {
  id: number;
  name: string;
  url: string;
}

const { data: contacts } = await useFetch<SiteContact[]>("/api/site/contact", {
  default: () => [],
});
const { data: socialMedia } = await useFetch<SocialMedia[]>(
  "/api/site/social-media",
  { default: () => [] },
);

function phoneUrl(phone: string) {
  return `tel:${phone.replace(/[^+\d]/g, "")}`;
}

function socialType(name: string) {
  const normalizedName = name.trim().toLowerCase();

  if (normalizedName.includes("instagram")) return "instagram";
  if (normalizedName.includes("facebook")) return "facebook";

  return "link";
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
        <div v-if="socialMedia.length" class="social-links">
          <h3>Media Sosial</h3>
          <a
            v-for="item in socialMedia"
            :key="item.id"
            :href="item.url"
            target="_blank"
            rel="noopener"
          >
            <svg
              v-if="socialType(item.name) === 'instagram'"
              class="social-icon"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle class="social-icon__dot" cx="17.4" cy="6.6" r="1" />
            </svg>
            <svg
              v-else-if="socialType(item.name) === 'facebook'"
              class="social-icon social-icon--facebook"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M13.6 21v-8h2.7l.4-3.1h-3.1V8c0-.9.3-1.6 1.7-1.6h1.6V3.6c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.6H8.5V13H11v8h2.6Z"
              />
            </svg>
            <svg
              v-else
              class="social-icon social-icon--link"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M10.2 13.8a4 4 0 0 0 5.7.1l2.3-2.3a4 4 0 0 0-5.7-5.7l-1.3 1.3"
              />
              <path
                d="M13.8 10.2a4 4 0 0 0-5.7-.1l-2.3 2.3a4 4 0 1 0 5.7 5.7l1.3-1.3"
              />
            </svg>
            <span>{{ item.name }}</span
            ><b>↗</b>
          </a>
        </div>
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

.social-links {
  margin-top: 24px;
}

.social-links h3 {
  margin-bottom: 10px;
}

.contact-section .social-links > a {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  color: #e5be71;
}

.contact-section .social-links > a b {
  margin-left: auto;
}

.social-icon {
  width: 17px;
  height: 17px;
  flex: 0 0 17px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
}

.social-icon__dot {
  fill: currentColor;
  stroke: none;
}

.social-icon--facebook,
.social-icon--facebook path {
  fill: currentColor;
  stroke: none;
}

.social-icon--link {
  stroke-linecap: round;
  stroke-linejoin: round;
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
