<script setup lang="ts">
const menuOpen = ref(false)
const links = [{ label:'Beranda', href:'#beranda' }, { label:'Produk', href:'#produk' }, { label:'Custom Jersey', href:'#custom' }, { label:'Galeri', href:'#galeri' }, { label:'Tentang Kami', href:'#tentang' }, { label:'Kontak', href:'#kontak' }]
const wa = 'https://wa.me/6282334148314?text=' + encodeURIComponent('Halo, saya ingin konsultasi custom jersey.')
</script>
<template>
<header class="site-header"><div class="container nav-wrap"><a href="#beranda" class="brand"><span class="brand-mark">✦</span><span>CREATIVE<small>CUSTOM APPAREL</small></span></a><nav class="desktop-nav"><a v-for="item in links" :key="item.href" :href="item.href">{{ item.label }}</a></nav><div class="nav-actions"><a class="nav-order" :href="wa" target="_blank" rel="noopener">◉ &nbsp; Pesan Custom</a><button class="menu-toggle" aria-label="Buka menu" :aria-expanded="menuOpen" @click="menuOpen=!menuOpen">☰</button></div></div><nav v-if="menuOpen" class="mobile-nav"><a v-for="item in links" :key="item.href" :href="item.href" @click="menuOpen=false">{{ item.label }}</a><a :href="wa" target="_blank" rel="noopener">Pesan via WhatsApp ↗</a></nav></header>
</template>
