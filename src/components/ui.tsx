import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'

/** Reveals children with a soft rise when they scroll into view. */
export function Reveal({ children, className = '', delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return setShown(true)
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      className={`${shown ? 'animate-rise delay-var' : 'opacity-0'} ${className}`}
      style={{ '--d': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}

export function Ornament({ className = '' }: { className?: string }) {
  return (
    <div className={`ornament ${className}`} aria-hidden="true">
      <span className="block h-1.5 w-1.5 rotate-45 border border-current" />
    </div>
  )
}

/** Copies text; `copied` flips back after 2.2 s. Falls back to a hidden textarea on old browsers. */
export function useCopy() {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>(undefined)
  const copy = async (text: string) => {
    let ok = false
    try {
      await navigator.clipboard.writeText(text)
      ok = true
    } catch {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(ta)
      ta.select()
      try {
        ok = document.execCommand('copy')
      } catch {
        ok = false
      }
      ta.remove()
    }
    if (ok) {
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2200)
    }
    return ok
  }
  return { copied, copy }
}

/** Polite live region toast, centred at the bottom of the screen. */
export function Toast({ message }: { message: string | null }) {
  return (
    <div aria-live="polite" role="status" className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
      {message && (
        <p className="animate-toast absolute bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-1/2 w-max max-w-[calc(100vw-2rem)] rounded-full bg-charcoal/95 px-5 py-3 text-center text-sm text-ivory shadow-xl">
          {message}
        </p>
      )}
    </div>
  )
}
