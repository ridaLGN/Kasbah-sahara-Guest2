import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { site } from './src/config/site.ts'
import { menu } from './src/data/menu.ts'

/**
 * SEO plugin
 *  - JSON-LD (LodgingBusiness + drinks Menu) generated from src/data/menu.ts,
 *    so structured data always matches the displayed prices.
 *  - canonical / og:url / og:image when VITE_PUBLIC_SITE_URL is set.
 *  - robots.txt (staff /qr page disallowed) and sitemap.xml.
 */
function seo(publicUrl: string | undefined): Plugin {
  const base = publicUrl ? new URL('/', publicUrl).href : undefined
  const abs = (p: string) => (base ? new URL(p, base).href : p)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: site.name,
    url: base ?? site.website,
    sameAs: [site.website],
    image: abs('/images/og-image.jpg'),
    logo: abs('/brand/logo-brown.png'),
    telephone: `+${site.support.phone}`,
    address: {
      '@type': 'PostalAddress',
      addressLocality: "M'hamid El Ghizlane",
      addressRegion: 'Zagora',
      addressCountry: 'MA',
    },
    amenityFeature: [{ '@type': 'LocationFeatureSpecification', name: 'Free Wi-Fi', value: true }],
    hasMenu: {
      '@type': 'Menu',
      name: 'Drinks & Refreshments',
      url: abs('/menu'),
      hasMenuSection: menu.map((c) => ({
        '@type': 'MenuSection',
        name: c.title,
        hasMenuItem: c.drinks
          .filter((d) => d.available !== false)
          .map((d) => ({
            '@type': 'MenuItem',
            name: d.name,
            offers: d.prices.map((p) => ({
              '@type': 'Offer',
              price: p.amount,
              priceCurrency: 'MAD',
              ...(p.serving ? { name: p.serving } : {}),
            })),
          })),
      })),
    },
  }

  return {
    name: 'kss-seo',
    transformIndexHtml(html) {
      const tags = [`<script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>`]
      tags.push(`<meta property="og:image" content="${abs('/images/og-image.jpg')}" />`)
      if (base) tags.push(`<link rel="canonical" href="${base}" />`, `<meta property="og:url" content="${base}" />`)
      return html.replace('</head>', `  ${tags.join('\n    ')}\n  </head>`)
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nDisallow: /qr\n${base ? `Sitemap: ${abs('/sitemap.xml')}\n` : ''}`,
      })
      if (!base) return
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          `  <url><loc>${base}</loc></url>`,
          `  <url><loc>${abs('/menu')}</loc></url>`,
          '</urlset>',
          '',
        ].join('\n'),
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  return {
    plugins: [react(), tailwindcss(), seo(env.VITE_PUBLIC_SITE_URL || process.env.VITE_PUBLIC_SITE_URL)],
    build: { target: 'es2020', sourcemap: false },
  }
})
