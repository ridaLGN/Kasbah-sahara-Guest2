import type { CSSProperties } from 'react'
import { site } from '../config/site'
import { Ornament } from './ui'

const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties

export function Hero() {
  return (
    <header className="relative isolate flex min-h-[70svh] flex-col items-center overflow-hidden bg-charcoal px-6 pt-[max(2.5rem,env(safe-area-inset-top))] pb-32 text-center text-ivory sm:min-h-[80svh] sm:pb-44">
      <picture className="absolute inset-0 -z-20">
        <source
          type="image/webp"
          srcSet="/images/hero-dunes-800.webp 800w, /images/hero-dunes-1400.webp 1400w"
          sizes="100vw"
        />
        <img
          src="/images/hero-dunes-1400.webp"
          alt=""
          fetchPriority="high"
          decoding="async"
          className="animate-drift h-full w-full object-cover object-[50%_60%]"
        />
      </picture>
      {/* Night-over-the-dunes veil: keeps text legible and the mood warm. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(25,23,20,.78)_0%,rgba(25,23,20,.42)_38%,rgba(48,37,29,.55)_72%,#191714_100%)]"
      />
      <div aria-hidden="true" className="pattern-dark absolute inset-0 -z-10 opacity-60" />

      <img
        src="/brand/logo-white.png"
        alt={site.name}
        width={945}
        height={348}
        className="animate-fade delay-var h-auto w-44 sm:w-52"
        style={d(0)}
      />

      <div className="my-auto flex max-w-2xl flex-col items-center py-10">
        <p className="tracking-eyebrow animate-rise delay-var text-[0.68rem] font-medium uppercase text-sand" style={d(100)}>
          {site.heroLine}
        </p>
        <h1
          className="animate-rise delay-var mt-5 font-display text-[2.85rem] leading-[1.02] font-normal tracking-[0.01em] text-balance sm:text-6xl md:text-7xl"
          style={d(180)}
        >
          Welcome to <span className="italic text-sand">Kasbah Sahara</span>
        </h1>
        <Ornament className="animate-fade delay-var mt-6 text-gold" />
        <p className="animate-rise delay-var mt-6 text-lg font-light tracking-wide text-ivory/85 sm:text-xl" style={d(260)}>
          Your desert experience, elevated.
        </p>
      </div>
    </header>
  )
}
