import { site } from '../config/site'

export function Footer() {
  return (
    <footer className="bg-charcoal px-6 pt-14 pb-[calc(6.5rem+env(safe-area-inset-bottom))] text-center text-ivory/60 sm:pb-14">
      <img src="/brand/logo-white.png" alt={site.name} width={945} height={348} loading="lazy" className="mx-auto h-auto w-36 opacity-90" />
      <p className="mt-5 text-sm">{site.locationLine}</p>
      <a
        href={site.website}
        target="_blank"
        rel="noopener"
        className="mt-2 inline-block text-sm text-sand underline-offset-4 hover:underline"
      >
        kasbahsaharaservices.com
      </a>
      <p className="mt-8 text-xs text-ivory/40">
        © {new Date().getFullYear()} {site.name} · Website by{' '}
        <a href={site.developer.url} target="_blank" rel="noopener" className="underline-offset-4 hover:underline">
          {site.developer.name}
        </a>
      </p>
    </footer>
  )
}
