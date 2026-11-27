/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  DRINKS MENU – the single source of truth for the digital menu.
 *
 *  Change a price  → edit its `amount`.
 *  Hide a drink    → add `available: false`.
 *  Add a photo     → put a .webp in public/images/drinks/ and set
 *                    `image: '/images/drinks/your-file.webp'`.
 *  Prices are in Moroccan dirhams (DH / MAD).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type CategoryIcon = 'fresh' | 'hot' | 'cocktail' | 'beer' | 'wine' | 'liqueur' | 'champagne'
export type Serving = 'Bottle' | 'Glass'

export interface Price {
  amount: number
  /** Omit for drinks with a single price. */
  serving?: Serving
}

export interface Drink {
  id: string
  name: string
  /** Name as printed on the paper menu (French), shown in small type. */
  localName?: string
  /** Short line under the name, e.g. available colours of a wine. */
  note?: string
  prices: Price[]
  image?: string
  available?: boolean
}

export interface MenuCategory {
  id: string
  title: string
  icon: CategoryIcon
  /** Optional line under the category title. */
  subtitle?: string
  drinks: Drink[]
}

export const menu: MenuCategory[] = [
  {
    id: 'fresh-drinks',
    title: 'Fresh Drinks',
    icon: 'fresh',
    drinks: [
      { id: 'soda', name: 'Soda', prices: [{ amount: 20 }] },
      { id: 'orange-juice', name: 'Orange Juice', localName: "Jus d'orange", prices: [{ amount: 30 }] },
      { id: 'apple-juice', name: 'Apple Juice', localName: 'Jus de pomme', prices: [{ amount: 30 }] },
      { id: 'carrot-juice', name: 'Carrot Juice', localName: 'Jus de carotte', prices: [{ amount: 30 }] },
      { id: 'lemon-juice', name: 'Lemon Juice', localName: 'Jus de citron', prices: [{ amount: 40 }] },
      { id: 'sparkling-water', name: 'Sparkling Water', localName: 'Eau gazeuse', prices: [{ amount: 30 }] },
      { id: 'mineral-water', name: 'Mineral Water', localName: 'Eau minérale', prices: [{ amount: 25 }] },
    ],
  },
  {
    id: 'hot-drinks',
    title: 'Hot Drinks',
    icon: 'hot',
    drinks: [
      { id: 'coffee-milk', name: 'Coffee with Milk', localName: 'Café au lait', prices: [{ amount: 25 }] },
      { id: 'tea', name: 'Tea', localName: 'Thé', prices: [{ amount: 25 }] },
      { id: 'hot-chocolate', name: 'Hot Chocolate', prices: [{ amount: 25 }] },
      { id: 'black-coffee', name: 'Black Coffee', localName: 'Café noir', prices: [{ amount: 25 }] },
    ],
  },
  {
    id: 'cocktails',
    title: 'Cocktails',
    icon: 'cocktail',
    drinks: [
      { id: 'mojito', name: 'Mojito Cocktail', prices: [{ amount: 80 }] },
      { id: 'sunset-chegaga', name: 'Sunset Chegaga', prices: [{ amount: 100 }] },
      { id: 'oasis', name: 'Oasis', prices: [{ amount: 120 }] },
    ],
  },
  {
    id: 'beer',
    title: 'Beer',
    icon: 'beer',
    drinks: [
      { id: 'flag-special', name: 'Flag Special', localName: 'Flag Spécial', prices: [{ amount: 50 }] },
      { id: 'heineken', name: 'Heineken', prices: [{ amount: 60 }] },
      { id: 'casablanca', name: 'Casablanca', prices: [{ amount: 70 }] },
      { id: 'left', name: 'Left', prices: [{ amount: 80 }] },
    ],
  },
  {
    id: 'wine',
    title: 'Wine',
    icon: 'wine',
    subtitle: 'By the bottle or by the glass',
    drinks: [
      {
        id: 'guerrouane',
        name: 'Guerrouane',
        note: 'White · Red · Rosé',
        prices: [{ amount: 250, serving: 'Bottle' }, { amount: 70, serving: 'Glass' }],
      },
      {
        id: 'terre-rouge',
        name: 'Terre Rouge',
        note: 'Rosé · Red · White',
        prices: [{ amount: 300, serving: 'Bottle' }, { amount: 80, serving: 'Glass' }],
      },
      {
        id: 'medallion',
        name: 'Medallion',
        localName: 'Médaillon',
        prices: [{ amount: 400, serving: 'Bottle' }, { amount: 100, serving: 'Glass' }],
      },
      { id: 'tandem', name: 'Tandem', prices: [{ amount: 800, serving: 'Bottle' }] },
    ],
  },
  {
    id: 'liqueur',
    title: 'Liqueur',
    icon: 'liqueur',
    subtitle: 'By the glass',
    drinks: [
      { id: 'whisky', name: 'Whisky', prices: [{ amount: 100, serving: 'Glass' }] },
      { id: 'vodka', name: 'Vodka', prices: [{ amount: 100, serving: 'Glass' }] },
      { id: 'gin', name: 'Gin', prices: [{ amount: 100, serving: 'Glass' }] },
      { id: 'pastis', name: 'Pastis', prices: [{ amount: 100, serving: 'Glass' }] },
      { id: 'martini', name: 'Martini', prices: [{ amount: 100, serving: 'Glass' }] },
    ],
  },
  {
    id: 'champagne',
    title: 'Champagne',
    icon: 'champagne',
    subtitle: 'By the bottle',
    drinks: [
      { id: 'moet', name: 'Moët', prices: [{ amount: 1500, serving: 'Bottle' }] },
      { id: 'chandon', name: 'Chandon', prices: [{ amount: 2200, serving: 'Bottle' }] },
    ],
  },
]
