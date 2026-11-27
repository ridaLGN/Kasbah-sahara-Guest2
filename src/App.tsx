import { useEffect } from 'react'
import { useLocation } from './lib/router'
import { GuestHome } from './pages/GuestHome'
import { DrinksMenu } from './pages/DrinksMenu'
import { QrPage } from './pages/QrPage'
import { FloatingWhatsApp } from './components/FloatingWhatsApp'
import { site } from './config/site'

const TITLES: Record<string, string> = {
  '/': `Welcome | ${site.name} – Guest Experience`,
  '/menu': `Drinks & Refreshments | ${site.name}`,
  '/qr': `Guest QR Code | ${site.name}`,
}

export default function App() {
  const { path, hash } = useLocation()

  useEffect(() => {
    document.title = TITLES[path] ?? TITLES['/']
    // New page → top; "/#wifi" → the section.
    const target = hash ? document.getElementById(hash.slice(1)) : null
    if (target) requestAnimationFrame(() => target.scrollIntoView())
    else window.scrollTo({ top: 0, behavior: 'instant' })
  }, [path, hash])

  const page = path === '/menu' ? <DrinksMenu /> : path === '/qr' ? <QrPage /> : <GuestHome />

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-brown px-5 py-3 text-ivory focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to content
      </a>
      {page}
      {path !== '/qr' && <FloatingWhatsApp />}
    </>
  )
}
