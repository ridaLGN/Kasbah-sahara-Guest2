import { useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from '../lib/router'
import { MainQRCode, guestUrl } from '../components/MainQRCode'

/**
 * Staff page (/qr): the single guest QR code, ready to download or print.
 * Not linked from the guest pages and excluded from search engines.
 */
export function QrPage() {
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  const url = guestUrl()
  const local = /^(localhost|127\.|192\.168\.|10\.)/.test(new URL(url).hostname)

  return (
    <main id="main" className="pattern-dark min-h-svh bg-charcoal px-4 py-10 text-ivory print:bg-white print:p-0">
      <div className="no-print mx-auto mb-8 flex max-w-sm items-center justify-between">
        <Link to="/" className="inline-flex min-h-11 items-center gap-2 text-sm text-sand hover:text-ivory">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Guest page
        </Link>
        <span className="tracking-eyebrow text-[0.65rem] text-ivory/50 uppercase">Staff · Print</span>
      </div>
      {local && (
        <p role="alert" className="no-print mx-auto mb-6 max-w-sm rounded-2xl bg-[#5a2a1a] p-4 text-sm leading-relaxed text-ivory">
          This QR code points to a local address ({url}). Open this page on the published website, or set
          VITE_PUBLIC_SITE_URL, before printing.
        </p>
      )}
      <MainQRCode url={url} />
    </main>
  )
}
