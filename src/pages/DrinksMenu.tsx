import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowLeft, Search, X } from 'lucide-react'
import { menu } from '../data/menu'
import { site } from '../config/site'
import { Link } from '../lib/router'
import { CATEGORY_ICONS, MenuCategory } from '../components/MenuCategory'
import { Ornament } from '../components/ui'
import { Footer } from '../components/Footer'

/** Lower-case, accents removed: "Thé" matches "the", "Moët" matches "moet". */
const fold = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

export function DrinksMenu() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(menu[0].id)
  const chipBar = useRef<HTMLDivElement>(null)

  const results = useMemo(() => {
    const q = fold(query.trim())
    const available = menu.map((c) => ({ ...c, drinks: c.drinks.filter((d) => d.available !== false) }))
    if (!q) return available
    return available
      .map((c) =>
        fold(c.title).includes(q)
          ? c
          : { ...c, drinks: c.drinks.filter((d) => fold([d.name, d.localName, d.note].join(' ')).includes(q)) },
      )
      .filter((c) => c.drinks.length > 0)
  }, [query])

  const searching = query.trim() !== ''
  const count = results.reduce((n, c) => n + c.drinks.length, 0)

  // Scroll-spy: highlight the category currently under the sticky bars.
  useEffect(() => {
    if (searching) return
    const sections = [...document.querySelectorAll<HTMLElement>('[data-category]')]
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActive(visible[0].target.id)
      },
      { rootMargin: '-140px 0px -55% 0px' },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [searching])

  // Keep the active chip visible inside the horizontal chip bar.
  useEffect(() => {
    const bar = chipBar.current
    const chip = bar?.querySelector<HTMLElement>(`[data-chip="${active}"]`)
    if (bar && chip) bar.scrollTo({ left: chip.offsetLeft - bar.clientWidth / 2 + chip.clientWidth / 2, behavior: 'smooth' })
  }, [active])

  const jump = (id: string) => {
    setActive(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="pattern min-h-svh">
        {/* Top bar */}
        <div className="sticky top-0 z-30 border-b border-sand/50 bg-ivory/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-3xl items-center justify-between gap-3 px-4">
            <Link
              to="/"
              data-testid="back-home"
              className="inline-flex min-h-11 items-center gap-2 rounded-full pr-3 pl-2 text-sm text-brown transition hover:bg-sand/30"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              Home
            </Link>
            <img src="/brand/mark-brown.png" alt="" width={40} height={40} className="h-9 w-9 object-contain" />
            <span className="w-[4.6rem] text-right font-display text-lg text-gold-ink italic">Menu</span>
          </div>

          {!searching && (
            <nav aria-label="Menu categories" className="mx-auto max-w-3xl">
              <div ref={chipBar} className="no-scrollbar flex gap-2 overflow-x-auto px-4 pb-3">
                {menu.map((c) => {
                  const Icon = CATEGORY_ICONS[c.icon]
                  const on = active === c.id
                  return (
                    <button
                      key={c.id}
                      type="button"
                      data-chip={c.id}
                      aria-current={on ? 'true' : undefined}
                      onClick={() => jump(c.id)}
                      className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-full border px-4 text-sm whitespace-nowrap transition duration-300 ${
                        on ? 'border-brown bg-brown text-ivory' : 'border-sand bg-white/70 text-brown hover:border-gold'
                      }`}
                    >
                      <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
                      {c.title}
                    </button>
                  )
                })}
              </div>
            </nav>
          )}
        </div>

        <main id="main" className="mx-auto max-w-3xl px-4 pt-10 pb-24 sm:px-6">
          <header className="animate-rise text-center">
            <p className="eyebrow">{site.shortName}</p>
            <h1 className="mt-3 font-display text-[2.6rem] leading-tight text-charcoal sm:text-5xl">Drinks &amp; Refreshments</h1>
            <Ornament className="mt-5" />
            <p className="mt-4 text-sm text-brown-soft">Prices in {site.currencyLong}</p>
          </header>

          <div className="animate-rise delay-var relative mt-8" style={{ ['--d' as string]: '120ms' }}>
            <label htmlFor="menu-search" className="sr-only">
              Search the menu
            </label>
            <Search className="pointer-events-none absolute top-1/2 left-5 h-5 w-5 -translate-y-1/2 text-gold-ink" aria-hidden="true" />
            <input
              id="menu-search"
              type="search"
              inputMode="search"
              autoComplete="off"
              enterKeyHint="search"
              placeholder="Search a drink…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-14 w-full rounded-full border border-sand bg-white/90 pr-14 pl-13 text-base text-charcoal shadow-sm transition placeholder:text-brown-soft/60 focus:border-gold focus:ring-4 focus:ring-gold/15 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
            />
            {searching && (
              <button
                type="button"
                onClick={() => setQuery('')}
                aria-label="Clear search"
                className="absolute top-1/2 right-2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full text-brown hover:bg-sand/40"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>

          <p aria-live="polite" className="mt-4 min-h-5 text-center text-sm text-brown-soft">
            {searching && (count ? `${count} ${count === 1 ? 'drink' : 'drinks'} found` : '')}
          </p>

          <div className="mt-4 space-y-5">
            {results.map((c) => (
              <MenuCategory key={c.id} category={c} />
            ))}
          </div>

          {searching && count === 0 && (
            <div className="card px-6 py-12 text-center" data-testid="no-results">
              <p className="font-display text-2xl text-charcoal">Nothing found for “{query.trim()}”</p>
              <p className="mt-2 text-sm text-brown-soft">Try another word, or browse all categories.</p>
              <button type="button" onClick={() => setQuery('')} className="btn-line mt-6">
                Show the full menu
              </button>
            </div>
          )}

          <div className="mt-14 text-center">
            <Link to="/" className="btn-line">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to home
            </Link>
          </div>
        </main>
      </div>
      <Footer />
    </>
  )
}
