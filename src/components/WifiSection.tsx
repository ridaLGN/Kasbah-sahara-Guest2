import { useMemo, useState } from 'react'
import { Check, Copy, Download, Smartphone, Wifi } from 'lucide-react'
import { wifi } from '../config/wifi'
import { wifiPayload } from '../lib/wifi'
import { downloadQrPng } from '../lib/qr'
import { WifiQRCode } from './WifiQRCode'
import { Reveal, Toast, useCopy } from './ui'

type Platform = 'ios' | 'android'

function detectPlatform(): Platform {
  if (typeof navigator === 'undefined') return 'ios'
  return /android/i.test(navigator.userAgent) ? 'android' : 'ios'
}

const STEPS: Record<Platform, string[]> = {
  ios: [
    'The password is now copied (tap “Copy” above if needed).',
    'Open Settings, then Wi-Fi.',
    `Choose “${wifi.ssid}”, tap the password field and paste.`,
  ],
  android: [
    'The password is now copied (tap “Copy” above if needed).',
    'Open Settings, then Network & Internet (or Connections), then Wi-Fi.',
    `Choose “${wifi.ssid}”, tap the password field and paste.`,
  ],
}

export function WifiSection() {
  const { copied, copy } = useCopy()
  const [toast, setToast] = useState<string | null>(null)
  const [helpOpen, setHelpOpen] = useState(false)
  const [platform, setPlatform] = useState<Platform>(detectPlatform)
  const payload = useMemo(() => wifiPayload(wifi), [])
  const open = wifi.security === 'nopass'

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2600)
  }

  const connect = async () => {
    setHelpOpen(true)
    if (open) return flash(`Choose “${wifi.ssid}” in your Wi-Fi settings`)
    const ok = await copy(wifi.password)
    flash(ok ? `Password copied – now choose “${wifi.ssid}” in Wi-Fi settings` : 'Please copy the password shown above')
  }

  const copyPassword = async () => {
    if (await copy(wifi.password)) flash('Password copied')
  }

  return (
    <section id="wifi" aria-labelledby="wifi-title" className="scroll-mt-4 px-4 pt-24 pb-6 sm:px-6 sm:pt-32">
      <Reveal className="mx-auto max-w-5xl">
        <div className="text-center">
          <p className="eyebrow">Wi-Fi</p>
          <h2 id="wifi-title" className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
            Stay Connected
          </h2>
          <p className="mx-auto mt-3 max-w-md text-brown-soft">
            Complimentary Wi-Fi throughout the camp. Join in a few seconds.
          </p>
        </div>

        <div className="card mt-10 grid overflow-hidden md:grid-cols-[1.25fr_1fr]">
          {/* Credentials */}
          <div className="p-6 sm:p-9">
            <dl className="divide-y divide-sand/60">
              <div className="flex items-center gap-4 pb-5">
                <span className="arch flex h-12 w-10 shrink-0 items-center justify-center bg-ivory-deep text-gold-ink ring-1 ring-gold/25">
                  <Wifi className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <div className="min-w-0">
                  <dt className="eyebrow">Network</dt>
                  <dd data-testid="wifi-ssid" className="mt-1 font-display text-2xl break-words text-charcoal">
                    {wifi.ssid}
                  </dd>
                </div>
              </div>
              {!open && (
                <div className="flex items-center gap-4 pt-5">
                  <div className="min-w-0 flex-1">
                    <dt className="eyebrow">Password</dt>
                    <dd
                      data-testid="wifi-password"
                      className="mt-1 font-mono text-lg tracking-wide break-all text-charcoal select-all min-[400px]:text-xl"
                    >
                      {wifi.password}
                    </dd>
                  </div>
                  <button
                    type="button"
                    onClick={copyPassword}
                    className="inline-flex h-12 shrink-0 items-center gap-2 rounded-full border border-brown/20 px-3.5 text-sm text-brown transition hover:border-brown hover:bg-brown hover:text-ivory"
                    aria-label="Copy the Wi-Fi password"
                  >
                    {copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
              )}
            </dl>

            <button type="button" onClick={connect} data-testid="wifi-connect" className="btn-gold mt-8 w-full">
              <Wifi className="h-4 w-4" aria-hidden="true" />
              Connect to Wi-Fi
            </button>

            <div
              className={`grid transition-all duration-500 ${helpOpen ? 'mt-6 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              aria-hidden={!helpOpen}
            >
              <div className="overflow-hidden">
                <div className="rounded-2xl bg-ivory-deep/70 p-5" data-testid="wifi-steps">
                  <div role="tablist" aria-label="Your phone" className="flex gap-1 rounded-full bg-white/70 p-1">
                    {(['ios', 'android'] as const).map((p) => (
                      <button
                        key={p}
                        role="tab"
                        type="button"
                        tabIndex={helpOpen ? 0 : -1}
                        aria-selected={platform === p}
                        onClick={() => setPlatform(p)}
                        className={`min-h-10 flex-1 rounded-full text-sm transition ${platform === p ? 'bg-brown text-ivory' : 'text-brown-soft hover:text-brown'}`}
                      >
                        {p === 'ios' ? 'iPhone' : 'Android'}
                      </button>
                    ))}
                  </div>
                  <ol className="mt-5 space-y-3">
                    {STEPS[platform].map((s, i) => (
                      <li key={i} className="flex gap-3 text-[0.95rem] leading-snug">
                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/25 font-display text-sm text-gold-ink">
                          {i + 1}
                        </span>
                        {s}
                      </li>
                    ))}
                  </ol>
                  <p className="mt-4 text-xs leading-relaxed text-brown-soft">
                    For security reasons, web pages cannot join a Wi-Fi network on your behalf. Your phone keeps the network
                    once connected.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* QR code */}
          <div className="flex flex-col items-center justify-center gap-5 border-t border-sand/60 bg-ivory-deep/50 p-6 text-center sm:p-9 md:border-t-0 md:border-l">
            <WifiQRCode className="w-full max-w-[15rem]" />
            <div className="flex items-start gap-2 text-left text-sm leading-snug text-brown-soft">
              <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-gold-ink" aria-hidden="true" />
              <p>
                Connecting a tablet, laptop or a companion’s phone? Point its camera at this code and tap{' '}
                <span className="whitespace-nowrap">“Join network”.</span>
              </p>
            </div>
            <button
              type="button"
              onClick={() => downloadQrPng(payload, 'kasbah-sahara-wifi-qr.png')}
              className="btn-line min-h-11 w-full max-w-[15rem] px-5 text-[0.7rem]"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Save QR image
            </button>
          </div>
        </div>
      </Reveal>
      <Toast message={toast} />
    </section>
  )
}
