import { useMemo } from 'react'
import QRCode from 'qrcode'
import { Headset, Martini, Wifi } from 'lucide-react'
import { QR_DARK, QR_LIGHT, useQrSvg } from '../lib/qr'
import { site } from '../config/site'
import { Ornament } from './ui'

/** Public address the QR code points to: VITE_PUBLIC_SITE_URL, or the current site. */
export function guestUrl() {
  const env = import.meta.env.VITE_PUBLIC_SITE_URL as string | undefined
  return new URL('/', env || window.location.origin).href
}

const MARK = '/brand/mark-brown.png'

/**
 * Error correction H (30 %) leaves ample margin for the logo plate,
 * which covers about 4 % of the code's surface.
 */
function withLogo(svg: string) {
  const m = svg.match(/viewBox="0 0 (\d+) \d+"/)
  if (!m) return svg
  const size = Number(m[1])
  const plate = size * 0.22
  const pos = (size - plate) / 2
  const pad = plate * 0.16
  return svg.replace(
    '</svg>',
    `<rect x="${pos}" y="${pos}" width="${plate}" height="${plate}" rx="${plate * 0.2}" fill="#fff"/>` +
      `<image href="${MARK}" x="${pos + pad}" y="${pos + pad}" width="${plate - 2 * pad}" height="${plate - 2 * pad}"/></svg>`,
  )
}

const load = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image()
    i.onload = () => res(i)
    i.onerror = rej
    i.src = src
  })

/** 2048 px PNG with the Kasbah mark in the centre. */
async function downloadBranded(url: string) {
  const px = 2048
  const qr = await load(
    await QRCode.toDataURL(url, { errorCorrectionLevel: 'H', margin: 4, width: px, color: { dark: QR_DARK, light: QR_LIGHT } }),
  )
  const mark = await load(MARK)
  const c = document.createElement('canvas')
  c.width = c.height = px
  const ctx = c.getContext('2d')!
  ctx.drawImage(qr, 0, 0, px, px)
  const plate = px * 0.19
  const pos = (px - plate) / 2
  ctx.fillStyle = '#fff'
  ctx.beginPath()
  ctx.roundRect(pos, pos, plate, plate, plate * 0.2)
  ctx.fill()
  const pad = plate * 0.16
  ctx.drawImage(mark, pos + pad, pos + pad, plate - 2 * pad, plate - 2 * pad)
  const a = document.createElement('a')
  a.href = c.toDataURL('image/png')
  a.download = 'kasbah-sahara-guest-qr.png'
  a.click()
}

export function MainQRCode({ url }: { url: string }) {
  const raw = useQrSvg(url, 'H')
  const svg = useMemo(() => (raw ? withLogo(raw) : ''), [raw])
  const display = url.replace(/^https?:\/\//, '').replace(/\/$/, '')

  return (
    <div className="flex flex-col items-center">
      <article
        data-testid="main-qr-card"
        className="relative w-full max-w-sm overflow-hidden rounded-[2rem] bg-ivory px-8 pt-10 pb-9 text-center shadow-2xl ring-1 ring-sand print:max-w-none print:shadow-none print:ring-0"
      >
        <div aria-hidden="true" className="arch pointer-events-none absolute inset-3 border border-gold/45" />
        <img src="/brand/logo-brown.png" alt={site.name} width={945} height={348} className="relative mx-auto h-auto w-40" />
        <p className="eyebrow relative mt-6">Guest Experience</p>
        <h1 className="relative mt-2 font-display text-[2rem] leading-tight text-balance text-charcoal">Welcome to Kasbah Sahara</h1>
        <Ornament className="relative mt-4" />
        <div
          role="img"
          aria-label={`QR code opening ${display}`}
          data-testid="main-qr"
          data-url={url}
          className="qr-svg relative mx-auto mt-6 w-full max-w-[13.5rem] rounded-2xl bg-white p-2 shadow-sm ring-1 ring-sand/70"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <ul className="relative mt-6 flex justify-center gap-5 text-[0.7rem] tracking-[0.14em] text-brown uppercase">
          <li className="flex flex-col items-center gap-1.5">
            <Wifi className="h-4 w-4 text-gold-ink" aria-hidden="true" /> Wi-Fi
          </li>
          <li className="flex flex-col items-center gap-1.5">
            <Martini className="h-4 w-4 text-gold-ink" aria-hidden="true" /> Drinks
          </li>
          <li className="flex flex-col items-center gap-1.5">
            <Headset className="h-4 w-4 text-gold-ink" aria-hidden="true" /> Assistance
          </li>
        </ul>
        <p className="relative mt-5 text-sm text-brown-soft">Scan with your phone camera</p>
        <p className="relative mt-1 font-display text-lg text-gold-ink italic">{display}</p>
      </article>

      <div className="no-print mt-8 flex w-full max-w-sm flex-col gap-3 sm:flex-row">
        <button type="button" onClick={() => downloadBranded(url)} className="btn-gold-solid flex-1 px-5 whitespace-nowrap">
          Download PNG
        </button>
        <button type="button" onClick={() => window.print()} className="btn-line-light flex-1">
          Print
        </button>
      </div>
    </div>
  )
}
