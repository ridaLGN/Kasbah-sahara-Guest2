#!/usr/bin/env node
/**
 * Kasbah Sahara – guest QR code + printable poster.
 *
 *   npm run qr -- --url https://guest.kasbahsaharaservices.com
 *
 * The URL can also come from VITE_PUBLIC_SITE_URL (environment or .env file).
 *
 * Outputs (folder qr/):
 *   qr-code.png / .svg        main QR code, plain (maximum compatibility)
 *   qr-code-logo.png / .svg   main QR code with the Kasbah mark in the centre
 *   wifi-qr.png               Wi-Fi QR code (from src/config/wifi.ts)
 *   poster-A5.pdf / .png      printable poster (148 × 210 mm, vector QR, 300 dpi PNG)
 *
 * Every PNG is decoded after generation; the script fails if a code does not
 * decode to exactly the expected content.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import jsQR from 'jsqr'
import { PNG } from 'pngjs'
import { chromium } from '@playwright/test'
import { wifi } from '../src/config/wifi.ts'
import { wifiPayload } from '../src/lib/wifi.ts'
import { site } from '../src/config/site.ts'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)
const arg = (name) => {
  const i = args.indexOf(`--${name}`)
  return i >= 0 ? args[i + 1] : undefined
}
const fail = (msg) => {
  console.error(`\n✖ ${msg}\n`)
  process.exit(1)
}

function readDotEnv() {
  for (const f of ['.env.production.local', '.env.local', '.env.production', '.env']) {
    const p = path.join(root, f)
    if (!fs.existsSync(p)) continue
    const m = fs.readFileSync(p, 'utf8').match(/^\s*VITE_PUBLIC_SITE_URL\s*=\s*(.*)\s*$/m)
    if (m && m[1].trim()) return m[1].trim().replace(/^["']|["']$/g, '')
  }
}

// ── 1. URL ────────────────────────────────────────────────────────────────
const raw = arg('url') ?? process.env.VITE_PUBLIC_SITE_URL ?? readDotEnv()
if (!raw) fail('No URL. Run: npm run qr -- --url https://guest.kasbahsaharaservices.com')
let url
try {
  url = new URL(raw)
} catch {
  fail(`Not a valid URL: ${raw}`)
}
const host = url.hostname.toLowerCase()
const problems = []
if (url.protocol !== 'https:') problems.push('must start with https://')
if (/^(localhost|127\.|10\.|192\.168\.|0\.0\.0\.0)/.test(host) || host.endsWith('.local')) problems.push('is a local address')
if (/^\d+\.\d+\.\d+\.\d+$/.test(host)) problems.push('is a bare IP address')
if (host.endsWith('.netlify.app') && host.includes('--')) problems.push('is a temporary Netlify preview URL')
if (url.port) problems.push('contains a port number')
if (problems.length) fail(`Refusing to generate a QR code for ${url.href}:\n  - ${problems.join('\n  - ')}`)

url.hash = ''
url.pathname = '/'
url.search = ''
const target = url.href
const wifiText = wifiPayload(wifi)
const outDir = path.resolve(root, arg('out') ?? 'qr')
fs.mkdirSync(outDir, { recursive: true })
console.log(`\nTarget URL : ${target}\nOutput dir : ${outDir}\n`)

// ── 2. Assets ────────────────────────────────────────────────────────────
const b64 = (rel) => fs.readFileSync(path.join(root, rel)).toString('base64')
const dataUri = (rel, mime) => `data:${mime};base64,${b64(rel)}`
const MARK = dataUri('public/brand/mark-brown.png', 'image/png')
const LOGO = dataUri('public/brand/logo-white.png', 'image/png')
const DUNES = dataUri('public/images/hero-dunes-1400.webp', 'image/webp')
const font = (family, file, weight, style = 'normal') =>
  `@font-face{font-family:'${family}';src:url(data:font/woff2;base64,${b64(`node_modules/@fontsource/${file}`)}) format('woff2');font-weight:${weight};font-style:${style}}`
const FONTS = [
  font('Cormorant Garamond', 'cormorant-garamond/files/cormorant-garamond-latin-400-normal.woff2', 400),
  font('Cormorant Garamond', 'cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2', 500),
  font('Cormorant Garamond', 'cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2', 500, 'italic'),
  font('Jost', 'jost/files/jost-latin-300-normal.woff2', 300),
  font('Jost', 'jost/files/jost-latin-400-normal.woff2', 400),
  font('Jost', 'jost/files/jost-latin-500-normal.woff2', 500),
].join('\n')

const DARK = '#191714'

/** Error correction H (30 %) with the logo plate covering ≈ 4 % of the surface. */
async function qrSvg(text, { logo }) {
  const svg = await QRCode.toString(text, {
    type: 'svg',
    errorCorrectionLevel: logo ? 'H' : 'Q',
    margin: 4,
    color: { dark: DARK, light: '#FFFFFF' },
  })
  if (!logo) return svg
  const size = Number(svg.match(/viewBox="0 0 (\d+) \d+"/)[1])
  const plate = size * 0.22
  const pos = (size - plate) / 2
  const pad = plate * 0.15
  const overlay = `<rect x="${pos}" y="${pos}" width="${plate}" height="${plate}" rx="${plate * 0.2}" fill="#FFFFFF"/>
<image href="${MARK}" x="${pos + pad}" y="${pos + pad}" width="${plate - 2 * pad}" height="${plate - 2 * pad}" preserveAspectRatio="xMidYMid meet"/>`
  return svg.replace('</svg>', `${overlay}</svg>`)
}

const icon = (d) =>
  `<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="#B99A65" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`
const ICON_WIFI = icon('<path d="M12 20h.01"/><path d="M2 8.82a15 15 0 0 1 20 0"/><path d="M5 12.86a10 10 0 0 1 14 0"/><path d="M8.5 16.43a5 5 0 0 1 7 0"/>')
const ICON_DRINK = icon('<path d="M8 22h8"/><path d="M12 11v11"/><path d="m19 3-7 8-7-8Z"/>')
const ICON_HELP = icon('<path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z"/><path d="M21 16v2a4 4 0 0 1-4 4h-5"/>')

const posterHtml = (qr, { displayUrl }) => `<!doctype html><html><head><meta charset="utf-8"><style>
${FONTS}
@page { size: 148mm 210mm; margin: 0 }
* { box-sizing: border-box; margin: 0; padding: 0 }
html, body { width: 148mm; height: 210mm; background: #191714 }
body { font-family: 'Jost', sans-serif; color: #F8F4EC; -webkit-print-color-adjust: exact; print-color-adjust: exact; font-variant-numeric: lining-nums }
.page { position: relative; width: 148mm; height: 210mm; overflow: hidden; display: flex; flex-direction: column; align-items: center; text-align: center; padding-top: 17mm }
.dunes { position: absolute; inset: 0 0 auto 0; height: 92mm; background: url(${DUNES}) center 62% / cover no-repeat; z-index: 0 }
.veil { position: absolute; inset: 0 0 auto 0; height: 93mm; background: linear-gradient(180deg, rgba(25,23,20,.72), rgba(25,23,20,.35) 45%, #191714 100%); z-index: 1 }
.frame { position: absolute; inset: 6mm; border: .3mm solid rgba(185,154,101,.75); border-radius: 44mm 44mm 2.5mm 2.5mm; z-index: 3; pointer-events: none }
.frame::after { content: ''; position: absolute; inset: 1.6mm; border: .15mm solid rgba(185,154,101,.35); border-radius: 42.4mm 42.4mm 1.5mm 1.5mm }
.z { position: relative; z-index: 2 }
.logo { height: 14mm }
.eyebrow { margin-top: 7mm; font-size: 6.6pt; letter-spacing: .42em; color: #D8C3A5; font-weight: 500 }
h1 { margin-top: 2.5mm; font-family: 'Cormorant Garamond', serif; font-weight: 400; font-size: 27pt; line-height: 1.02 }
h1 em { font-style: italic; color: #D8C3A5; font-weight: 500 }
.sub { margin-top: 2.5mm; font-weight: 300; font-size: 10pt; color: rgba(248,244,236,.85) }
.qrbox { margin-top: 9mm; background: #FFF; padding: 2mm; border-radius: 3.5mm; box-shadow: 0 0 0 .3mm #B99A65, 0 0 0 1.6mm rgba(185,154,101,.18) }
.qr { display: block; width: 58mm; height: 58mm }
.scan { margin-top: 5mm; font-size: 9.5pt; letter-spacing: .02em }
.alt { margin-top: 1mm; font-size: 7.6pt; color: rgba(248,244,236,.6) }
.features { display: flex; gap: 9mm; margin-top: 7mm; font-size: 6.6pt; letter-spacing: .22em; color: #D8C3A5 }
.features div { display: flex; flex-direction: column; align-items: center; gap: 1.4mm }
.rule { display: flex; align-items: center; gap: 3mm; margin-top: 7mm; color: #B99A65 }
.rule span { width: 12mm; height: .25mm; background: currentColor; opacity: .7 }
.rule i { width: 1.5mm; height: 1.5mm; border: .25mm solid currentColor; transform: rotate(45deg) }
.wifi { margin-top: 5mm; font-size: 7.4pt; color: rgba(248,244,236,.75); line-height: 1.6 }
.wifi b { font-weight: 500; color: #F8F4EC }
.url { margin-top: 3mm; font-family: 'Cormorant Garamond', serif; font-style: italic; font-size: 10.5pt; color: #B99A65 }
</style></head><body><div class="page">
  <div class="dunes"></div><div class="veil"></div><div class="frame"></div>
  <img class="z logo" src="${LOGO}" alt="">
  <p class="z eyebrow">GUEST EXPERIENCE</p>
  <h1 class="z">Welcome to <em>Kasbah Sahara</em></h1>
  <p class="z sub">Your desert experience, elevated.</p>
  <div class="z qrbox">${qr.replace('<svg ', '<svg class="qr" ')}</div>
  <p class="z scan">Scan with your phone camera</p>
  <p class="z alt">Scannez avec l’appareil photo de votre téléphone</p>
  <div class="z features">
    <div>${ICON_WIFI}WI-FI</div><div>${ICON_DRINK}DRINKS MENU</div><div>${ICON_HELP}ASSISTANCE</div>
  </div>
  <div class="z rule"><span></span><i></i><span></span></div>
  <p class="z wifi">Wi-Fi <b>${wifi.ssid}</b>${wifi.security === 'nopass' ? '' : ` · Password <b>${wifi.password}</b>`}</p>
  <p class="z wifi">Assistance <b>${site.support.name}</b> · <b>${site.support.phoneDisplay}</b> · WhatsApp</p>
  <p class="z url">${displayUrl}</p>
</div></body></html>`

// ── 3. Generate ──────────────────────────────────────────────────────────
function decodePng(file) {
  const png = PNG.sync.read(fs.readFileSync(file))
  return jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data
}

const browser = await chromium.launch()
const checks = []
try {
  async function renderPng(svg, file, px = 2048) {
    const ctx = await browser.newContext({ viewport: { width: 512, height: 512 }, deviceScaleFactor: px / 512 })
    const page = await ctx.newPage()
    await page.setContent(
      `<html><body style="margin:0;background:#fff">${svg.replace('<svg ', '<svg style="display:block;width:512px;height:512px" ')}</body></html>`,
    )
    await page.locator('svg').screenshot({ path: file })
    await ctx.close()
  }

  async function renderPoster(html, pdfFile, pngFile) {
    // 148 × 210 mm at 96 css px/in = 559 × 794 css px; scale 3.125 ⇒ 300 dpi
    const ctx = await browser.newContext({ viewport: { width: 559, height: 794 }, deviceScaleFactor: 3.125 })
    const page = await ctx.newPage()
    await page.setContent(html, { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    await page.screenshot({ path: pngFile })
    await page.pdf({ path: pdfFile, width: '148mm', height: '210mm', printBackground: true, preferCSSPageSize: true })
    await ctx.close()
  }

  const displayUrl = target.replace(/^https:\/\//, '').replace(/\/$/, '')
  const plain = await qrSvg(target, { logo: false })
  const withLogo = await qrSvg(target, { logo: true })
  const wifiSvg = await qrSvg(wifiText, { logo: false })
  fs.writeFileSync(path.join(outDir, 'qr-code.svg'), plain)
  fs.writeFileSync(path.join(outDir, 'qr-code-logo.svg'), withLogo)
  await renderPng(plain, path.join(outDir, 'qr-code.png'))
  await renderPng(withLogo, path.join(outDir, 'qr-code-logo.png'))
  await renderPng(wifiSvg, path.join(outDir, 'wifi-qr.png'), 1200)
  await renderPoster(posterHtml(withLogo, { displayUrl }), path.join(outDir, 'poster-A5.pdf'), path.join(outDir, 'poster-A5.png'))
  checks.push(['qr-code.png', target], ['qr-code-logo.png', target], ['wifi-qr.png', wifiText], ['poster-A5.png', target])
} finally {
  await browser.close()
}

// ── 4. Verify ────────────────────────────────────────────────────────────
let ok = true
for (const [name, expected] of checks) {
  const decoded = decodePng(path.join(outDir, name))
  const pass = decoded === expected
  ok &&= pass
  console.log(`${pass ? '✔' : '✖'} ${name.padEnd(18)} → ${decoded ?? '(could not decode)'}`)
}
if (!ok) fail('QR verification failed.')
console.log('\nAll QR codes verified (decoded back to the expected content).\n')
