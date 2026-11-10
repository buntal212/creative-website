<script setup lang="ts">
interface SocialMedia {
  id: number;
  name: string;
  url: string;
}

const { data: socialMedia } = await useFetch<SocialMedia[]>(
  "/api/site/social-media",
  {
    default: () => [],
  },
);
</script>

<template>
  <div>
    <AppHeader />
    <main class="social-media-page">
      <section class="social-media-hero">
        <div class="container">
          <p class="eyebrow">TERHUBUNG DENGAN CREATIVE</p>
          <h1>Media Sosial Kami</h1>
          <p>
            Ikuti Creative di media sosial untuk melihat karya terbaru dan
            informasi menarik lainnya.
          </p>
        </div>
      </section>

      <section class="container social-media-content">
        <div v-if="socialMedia.length" class="social-media-grid">
          <a
            v-for="item in socialMedia"
            :key="item.id"
            class="social-media-card"
            :href="item.url"
            target="_blank"
            rel="noopener"
          >
            <span class="social-media-card__icon">↗</span>
            <span>
              <strong>{{ item.name }}</strong>
              <small>Kunjungi {{ item.name }}</small>
            </span>
          </a>
        </div>
        <div v-else class="social-media-empty">
          <span>⌁</span>
          <h2>Media sosial segera hadir</h2>
          <p>Silakan kembali lagi nanti untuk terhubung dengan kami.</p>
        </div>
      </section>
    </main>
    <AppFooter />
  </div>
</template>

<style scoped>
.social-media-page {
  min-height: calc(100vh - 78px);
  background: #f7f7f7;
}
.social-media-hero {
  padding: 76px 0 68px;
  background: linear-gradient(115deg, #101214, #252018);
  color: #fff;
  text-align: center;
}
.social-media-hero .eyebrow {
  margin: 0;
}
.social-media-hero h1 {
  margin: 14px 0 12px;
  font-size: clamp(2.2rem, 5vw, 4rem);
  letter-spacing: -1.5px;
}
.social-media-hero p:last-child {
  max-width: 570px;
  margin: auto;
  color: #d5d3ce;
  line-height: 1.7;
}
.social-media-content {
  padding: 54px 0 64px;
}
.social-media-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 18px;
}
.social-media-card {
  display: flex;
  align-items: center;
  gap: 16px;
  min-height: 116px;
  padding: 24px;
  border: 1px solid #e6e1d5;
  border-radius: 10px;
  background: #fff;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.social-media-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(28, 25, 20, 0.12);
}
.social-media-card__icon {
  display: grid;
  width: 42px;
  height: 42px;
  place-items: center;
  border-radius: 50%;
  background: #f3d893;
  color: #181510;
  font-size: 1.35rem;
  font-weight: 800;
}
.social-media-card strong,
.social-media-card small {
  display: block;
}
.social-media-card strong {
  margin-bottom: 5px;
  font-size: 1.05rem;
}
.social-media-card small {
  color: #76716a;
}
.social-media-empty {
  padding: 45px 20px;
  text-align: center;
}
.social-media-empty > span {
  color: #c79a43;
  font-size: 3rem;
}
.social-media-empty h2 {
  margin: 10px 0 8px;
}
.social-media-empty p {
  margin: 0;
  color: #706e69;
}
@media (max-width: 800px) {
  .social-media-hero {
    padding: 56px 0;
  }
  .social-media-grid {
    grid-template-columns: 1fr;
  }
  .social-media-content {
    padding: 35px 0 45px;
  }
}
</style>
