import { createServer } from 'node:http'
import { existsSync, readFileSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

const entry = '.output/server/index.mjs'
const apiPort = 39272
const sitePort = 39273
const product = {
  name: 'Jersey Futsal Pro',
  slug: 'jersey-futsal-pro',
  sku: 'JFP-001',
  description: 'Jersey futsal custom dengan bahan nyaman untuk tim Anda.',
  price: '150000.00',
  stock: 12,
  updated_at: '2026-10-29T00:00:00.000000Z',
  category: { name: 'Jersey Futsal', slug: 'jersey-futsal' },
  thumbnail: { id: 1, url: 'https://cdn.example.test/jersey-futsal-pro.jpg', alt_text: 'Jersey Futsal Pro', is_thumbnail: true },
  images: [{ id: 1, url: 'https://cdn.example.test/jersey-futsal-pro.jpg', alt_text: 'Jersey Futsal Pro', is_thumbnail: true }],
}

if (!existsSync(entry)) {
  throw new Error('Artefak SSR tidak ditemukan. Jalankan npm run build terlebih dahulu.')
}

const apiServer = createServer((request, response) => {
  const url = new URL(request.url || '/', `http://127.0.0.1:${apiPort}`)
  response.setHeader('content-type', 'application/json')

  if (url.pathname === '/api/catalog/categories') {
    response.end(JSON.stringify([]))
    return
  }

  if (url.pathname === '/api/catalog/products') {
    response.end(JSON.stringify({ data: [product], current_page: 1, last_page: 1 }))
    return
  }

  if (url.pathname === `/api/catalog/products/${product.slug}`) {
    response.end(JSON.stringify(product))
    return
  }

  response.statusCode = 404
  response.end(JSON.stringify({ message: 'Tidak ditemukan.' }))
})

function listen(server, port) {
  return new Promise((resolve, reject) => {
    server.once('error', reject)
    server.listen(port, '127.0.0.1', resolve)
  })
}

function close(server) {
  return new Promise((resolve) => server.close(resolve))
}

function runServer() {
  const child = spawn(process.execPath, [entry], {
    env: {
      ...process.env,
      NODE_ENV: 'development',
      NUXT_APP_ENVIRONMENT: 'development',
      NUXT_CREATIVE_API_BASE: `http://127.0.0.1:${apiPort}/api`,
      NUXT_PUBLIC_SITE_URL: 'https://creative-prob.my.id',
      HOST: '127.0.0.1',
      PORT: String(sitePort),
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  child.stdout.on('data', (chunk) => { output += chunk })
  child.stderr.on('data', (chunk) => { output += chunk })
  return { child, getOutput: () => output }
}

async function waitForServer(child) {
  const deadline = Date.now() + 10_000

  while (Date.now() < deadline) {
    if (child.exitCode !== null) return false

    try {
      const response = await fetch(`http://127.0.0.1:${sitePort}/robots.txt`)
      if (response.ok) return true
    } catch {
      // Nitro belum membuka port; coba lagi sampai batas waktu.
    }

    await delay(100)
  }

  return false
}

function assertIncludes(value, expected, label) {
  if (!value.includes(expected)) {
    throw new Error(`${label} tidak ditemukan: ${expected}`)
  }
}

function assertCanonical(value, url, label) {
  const escapedUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const canonical = new RegExp(`<link(?=[^>]*\\brel="canonical")(?=[^>]*\\bhref="${escapedUrl}")`)

  if (!canonical.test(value)) {
    throw new Error(`${label} tidak ditemukan: ${url}`)
  }
}

async function responseText(path) {
  const response = await fetch(`http://127.0.0.1:${sitePort}${path}`)
  const body = await response.text()

  if (!response.ok) {
    throw new Error(`${path} menghasilkan HTTP ${response.status}: ${body}`)
  }

  return { body, contentType: response.headers.get('content-type') || '' }
}

await listen(apiServer, apiPort)
const nuxt = runServer()

try {
  if (!await waitForServer(nuxt.child)) {
    throw new Error(`Server SSR gagal berjalan: ${nuxt.getOutput()}`)
  }

  const robots = readFileSync('.output/public/robots.txt', 'utf8')
  assertIncludes(robots, 'Disallow: /api/', 'Robots API')
  assertIncludes(robots, 'Disallow: /admin/', 'Robots admin')
  assertIncludes(robots, 'Sitemap: https://creative-prob.my.id/sitemap.xml', 'Lokasi sitemap')

  const internalApi = await fetch(`http://127.0.0.1:${sitePort}/api/catalog/products`)
  assertIncludes(internalApi.headers.get('x-robots-tag') || '', 'noindex', 'Header anti-indeks API')
  const admin = await fetch(`http://127.0.0.1:${sitePort}/admin/`)
  assertIncludes(admin.headers.get('x-robots-tag') || '', 'noindex', 'Header anti-indeks admin')

  const sitemap = await responseText('/sitemap.xml')
  assertIncludes(sitemap.contentType, 'application/xml', 'Content-Type sitemap')
  assertIncludes(sitemap.body, '<loc>https://creative-prob.my.id/</loc>', 'URL beranda sitemap')
  assertIncludes(sitemap.body, '<loc>https://creative-prob.my.id/produk/jersey-futsal-pro</loc>', 'URL produk sitemap')
  assertIncludes(sitemap.body, '<lastmod>2026-10-29T00:00:00.000Z</lastmod>', 'Lastmod produk sitemap')

  const home = await responseText('/')
  assertCanonical(home.body, 'https://creative-prob.my.id/', 'Canonical beranda')
  assertIncludes(home.body, 'CREATIVE | Custom Jersey Printing Premium', 'Title beranda')
  assertIncludes(home.body, '"@type":"Organization"', 'Structured data Organization')

  const detail = await responseText(`/produk/${product.slug}`)
  assertCanonical(detail.body, `https://creative-prob.my.id/produk/${product.slug}`, 'Canonical produk')
  assertIncludes(detail.body, product.description, 'Konten SSR produk')
  assertIncludes(detail.body, '"@type":"Product"', 'Structured data Product')
  assertIncludes(detail.body, '"sku":"JFP-001"', 'SKU Product')

  console.log('Sitemap, metadata canonical, SSR produk, dan structured data tervalidasi.')
} finally {
  nuxt.child.kill()
  await Promise.race([
    new Promise((resolve) => nuxt.child.once('exit', resolve)),
    delay(5_000),
  ])
  await close(apiServer)
}
