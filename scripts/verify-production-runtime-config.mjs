import { existsSync } from 'node:fs'
import { spawn } from 'node:child_process'
import { setTimeout as delay } from 'node:timers/promises'

const entry = '.output/server/index.mjs'
const port = '39173'
const productionEnvironment = {
  NODE_ENV: 'production',
  NUXT_APP_ENVIRONMENT: 'production',
  NUXT_CREATIVE_API_BASE: 'https://api.creative-prob.my.id/api',
  NUXT_PUBLIC_SITE_URL: 'https://creative-prob.my.id',
  HOST: '127.0.0.1',
  PORT: port,
}

if (!existsSync(entry)) {
  throw new Error('Artefak SSR tidak ditemukan. Jalankan npm run build terlebih dahulu.')
}

function runServer(environment) {
  const child = spawn(process.execPath, [entry], {
    env: { ...process.env, ...environment },
    stdio: ['ignore', 'pipe', 'pipe'],
  })
  let output = ''
  child.stdout.on('data', (chunk) => { output += chunk })
  child.stderr.on('data', (chunk) => { output += chunk })
  return { child, getOutput: () => output }
}

async function waitForExit(child, timeout) {
  return await Promise.race([
    new Promise((resolve) => child.once('exit', (code) => resolve(code))),
    delay(timeout).then(() => null),
  ])
}

async function waitForServer(child) {
  const deadline = Date.now() + 10_000

  while (Date.now() < deadline) {
    if (child.exitCode !== null) return false

    try {
      const response = await fetch(`http://127.0.0.1:${port}/robots.txt`)
      if (response.ok) return true
    } catch {
      // Nitro belum membuka port; coba lagi sampai batas waktu.
    }

    await delay(100)
  }

  return false
}

const valid = runServer(productionEnvironment)
const started = await waitForServer(valid.child)
valid.child.kill()
await waitForExit(valid.child, 5_000)

if (!started) {
  throw new Error(`Server gagal berjalan dengan konfigurasi production: ${valid.getOutput()}`)
}

const invalid = runServer({
  ...productionEnvironment,
  NUXT_CREATIVE_API_BASE: 'http://127.0.0.1:8888/api',
})
const exitCode = await waitForExit(invalid.child, 10_000)

if (exitCode === null) {
  invalid.child.kill()
  throw new Error('Konfigurasi localhost pada production tidak ditolak saat runtime.')
}

if (exitCode === 0) {
  throw new Error(`Server berhenti tanpa error untuk konfigurasi localhost: ${invalid.getOutput()}`)
}

console.log('Konfigurasi runtime production tervalidasi.')
