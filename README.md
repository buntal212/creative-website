# JERSEYKU Nuxt 4 SSR starter

Copy folder `app`, `public`, and `nuxt.config.ts` into your existing Nuxt 4 project.

## Images required
Place your own licensed product photographs in `public/images/` with these filenames:
- hero-jersey.svg
- jersey-black-gold.svg
- jersey-red.svg
- jersey-blue.svg
- jersey-white.svg
- jersey-purple.svg
- jersey-green.svg

The supplied placeholders are illustrative SVG artwork, not product photos. Replace with real product photos for a faithful mockup.

## Run
```bash
npm install
npm run dev
npm run build
node .output/server/index.mjs
```

## Konfigurasi API SSR

Saat development, Nuxt memakai `http://127.0.0.1:8888/api`. Build dan runtime production
memakai `https://api.creative-prob.my.id/api`; URL kanonis situs adalah
`https://creative-prob.my.id`.

Workflow deploy membangun artefak dengan environment production. Pada server, isi
`EnvironmentFile` unit systemd yang telah ada dengan nilai pada
`deploy/creative-ssr.env.example`, kemudian jalankan `systemctl daemon-reload` dan
restart unit tersebut. `NUXT_*` dibaca saat runtime sehingga perubahan environment tidak
memerlukan build ulang. Server akan menolak start apabila konfigurasi production masih
mengarah ke localhost atau tidak memakai endpoint API production.

Setelah build, jalankan verifikasi runtime berikut:

```bash
npm run verify:production-runtime-config
```

WhatsApp number is a placeholder. Change it in `app/pages/index.vue`, `app/components/ProductCard.vue`, `app/components/AppHeader.vue`, and `app/components/AppFooter.vue` before launch. Product names/prices are sample data.
