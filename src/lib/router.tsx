import { useEffect, useState, type AnchorHTMLAttributes, type MouseEvent } from 'react'

/**
 * Minimal client-side router (3 routes do not justify a router dependency).
 * Uses real paths (/menu, /qr): the host serves index.html for unknown paths
 * (configured in netlify.toml, public/_redirects and public/.htaccess).
 */
const EVENT = 'kss:navigate'

export function navigate(to: string) {
  if (to === location.pathname + location.hash) return
  history.pushState(null, '', to)
  window.dispatchEvent(new Event(EVENT))
}

function normalise(p: string) {
  const s = p.replace(/\/+$/, '')
  return s === '' ? '/' : s
}

const read = () => ({ path: normalise(location.pathname), hash: location.hash })

export function useLocation() {
  const [loc, setLoc] = useState(read)
  useEffect(() => {
    const on = () => setLoc(read())
    window.addEventListener('popstate', on)
    window.addEventListener(EVENT, on)
    return () => {
      window.removeEventListener('popstate', on)
      window.removeEventListener(EVENT, on)
    }
  }, [])
  return loc
}

/** Internal link: a real <a href> (crawlable, works with "open in new tab") + SPA navigation. */
export function Link({ to, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { to: string }) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    navigate(to)
  }
  return <a href={to} onClick={handle} {...rest} />
}
