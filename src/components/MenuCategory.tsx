import { Beer, Citrus, Coffee, GlassWater, Martini, Sparkles, Wine, type LucideIcon } from 'lucide-react'
import type { CategoryIcon, Drink, MenuCategory as Category, Serving } from '../data/menu'
import { site } from '../config/site'

export const CATEGORY_ICONS: Record<CategoryIcon, LucideIcon> = {
  fresh: Citrus,
  hot: Coffee,
  cocktail: Martini,
  beer: Beer,
  wine: Wine,
  liqueur: GlassWater,
  champagne: Sparkles,
}

const ORDER: Serving[] = ['Bottle', 'Glass']

function Price({ amount }: { amount: number }) {
  return (
    <span className="font-display text-xl whitespace-nowrap text-charcoal tabular-nums">
      {amount}
      <span className="ml-1 font-sans text-[0.68rem] tracking-wider text-gold-ink">{site.currency}</span>
    </span>
  )
}

function DrinkRow({ drink, columns }: { drink: Drink; columns: Serving[] | null }) {
  const sub = [drink.localName, drink.note].filter(Boolean).join(' · ')
  return (
    <li className="flex items-center gap-4 py-4" data-testid={`drink-${drink.id}`}>
      {drink.image && (
        <img
          src={drink.image}
          alt=""
          loading="lazy"
          width={56}
          height={56}
          className="arch h-16 w-14 shrink-0 object-cover ring-1 ring-sand"
        />
      )}
      <div className="flex min-w-0 flex-1 items-baseline">
        <div className="min-w-0">
          <p className="text-[1.05rem] leading-snug text-charcoal">{drink.name}</p>
          {sub && <p className="mt-0.5 text-[0.8rem] text-brown-soft italic">{sub}</p>}
        </div>
        <span className="leader" aria-hidden="true" />
        {columns ? (
          <div className="flex shrink-0 gap-1">
            {columns.map((c) => {
              const p = drink.prices.find((x) => x.serving === c)
              return (
                <span key={c} className="w-[4.6rem] text-right">
                  <span className="sr-only">{c}: </span>
                  {p ? <Price amount={p.amount} /> : <span className="text-sand" aria-label={`Not served by the ${c.toLowerCase()}`}>—</span>}
                </span>
              )
            })}
          </div>
        ) : (
          <Price amount={drink.prices[0].amount} />
        )}
      </div>
    </li>
  )
}

export function MenuCategory({ category }: { category: Category }) {
  const Icon = CATEGORY_ICONS[category.icon]
  const drinks = category.drinks.filter((d) => d.available !== false)
  // Several servings in one category (wine) → aligned Bottle / Glass columns.
  const multi = drinks.some((d) => d.prices.length > 1)
  const columns = multi ? ORDER.filter((s) => drinks.some((d) => d.prices.some((p) => p.serving === s))) : null

  return (
    <section
      id={category.id}
      aria-labelledby={`${category.id}-title`}
      data-category
      data-testid={`category-${category.id}`}
      className="card scroll-mt-36 px-5 pt-7 pb-3 sm:px-8"
    >
      <header className="flex items-center gap-4">
        <span className="arch flex h-14 w-12 shrink-0 items-center justify-center bg-gradient-to-b from-ivory-deep to-sand/50 text-brown ring-1 ring-gold/30">
          <Icon className="h-5 w-5" strokeWidth={1.4} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 id={`${category.id}-title`} className="font-display text-[1.9rem] leading-none text-charcoal">
            {category.title}
          </h2>
          {category.subtitle && <p className="eyebrow mt-2 text-[0.6rem]">{category.subtitle}</p>}
        </div>
      </header>

      {columns && (
        <div className="mt-5 flex justify-end gap-1 border-b border-sand/60 pb-2" aria-hidden="true">
          {columns.map((c) => (
            <span key={c} className="eyebrow w-[4.6rem] text-right text-[0.58rem] tracking-[0.2em]">
              {c}
            </span>
          ))}
        </div>
      )}
      <ul className={`divide-y divide-sand/50 ${columns ? '' : 'mt-3'}`}>
        {drinks.map((d) => (
          <DrinkRow key={d.id} drink={d} columns={columns} />
        ))}
      </ul>
    </section>
  )
}
