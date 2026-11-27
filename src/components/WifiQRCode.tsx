import { useMemo } from 'react'
import { wifi } from '../config/wifi'
import { wifiPayload } from '../lib/wifi'
import { useQrSvg } from '../lib/qr'

/** Wi-Fi QR code generated live from src/config/wifi.ts. */
export function WifiQRCode({ className = '' }: { className?: string }) {
  const payload = useMemo(() => wifiPayload(wifi), [])
  const svg = useQrSvg(payload, 'Q')
  return (
    <figure className={className}>
      <div
        role="img"
        aria-label={`Wi-Fi QR code for the network ${wifi.ssid}`}
        data-testid="wifi-qr"
        data-payload={payload}
        className="qr-svg aspect-square w-full rounded-2xl bg-white p-3 ring-1 ring-sand"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </figure>
  )
}
