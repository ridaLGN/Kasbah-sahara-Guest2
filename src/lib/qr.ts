import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

export const QR_DARK = '#191714'
export const QR_LIGHT = '#FFFFFF'
type Level = 'M' | 'Q' | 'H'

/** QR code as an SVG string (crisp at any size). */
export function useQrSvg(text: string, level: Level = 'Q') {
  const [svg, setSvg] = useState('')
  useEffect(() => {
    let alive = true
    QRCode.toString(text, {
      type: 'svg',
      errorCorrectionLevel: level,
      margin: 2,
      color: { dark: QR_DARK, light: QR_LIGHT },
    })
      .then((s) => alive && setSvg(s.replace('<svg ', '<svg role="presentation" focusable="false" ')))
      .catch(() => alive && setSvg(''))
    return () => {
      alive = false
    }
  }, [text, level])
  return svg
}

/** Generates a high-resolution PNG and triggers a download. */
export async function downloadQrPng(text: string, fileName: string, level: Level = 'Q') {
  const url = await QRCode.toDataURL(text, {
    errorCorrectionLevel: level,
    margin: 4,
    width: 1200,
    color: { dark: QR_DARK, light: QR_LIGHT },
  })
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  a.remove()
}
