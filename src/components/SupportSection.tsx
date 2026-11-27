import { Phone } from 'lucide-react'
import { links, site } from '../config/site'
import { WhatsAppIcon } from './WhatsAppIcon'
import { Ornament, Reveal } from './ui'

export function SupportSection() {
  const { support } = site
  return (
    <section id="support" aria-labelledby="support-title" className="scroll-mt-4 px-4 py-20 sm:px-6 sm:py-28">
      <Reveal className="relative mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-brown px-6 pt-14 pb-10 text-center text-ivory sm:px-14 sm:pt-20 sm:pb-14">
        <div aria-hidden="true" className="pattern-dark absolute inset-0" />
        {/* Kasbah arch outline */}
        <div
          aria-hidden="true"
          className="arch pointer-events-none absolute inset-x-5 top-5 bottom-5 border border-gold/25 sm:inset-x-8 sm:top-8 sm:bottom-8"
        />
        <div className="relative">
          <p className="tracking-eyebrow text-[0.7rem] font-medium uppercase text-sand">Guest Assistance</p>
          <h2 id="support-title" className="mt-4 font-display text-4xl sm:text-5xl">
            Need Assistance?
          </h2>
          <p className="mx-auto mt-4 max-w-sm text-ivory/80">Our team is always happy to help you during your stay.</p>
          <Ornament className="mt-7" />

          <p className="mt-7 font-display text-2xl text-sand italic">{support.name}</p>
          <p className="tracking-eyebrow mt-1 text-[0.65rem] uppercase text-ivory/60">{support.role}</p>
          <a
            href={links.call}
            data-testid="support-phone"
            className="mt-4 inline-block rounded-lg px-2 py-1 font-display text-[2rem] leading-none tracking-wide whitespace-nowrap text-ivory underline-offset-8 hover:underline sm:text-4xl"
          >
            {support.phoneDisplay}
          </a>

          <div className="mx-auto mt-9 grid max-w-lg gap-3 sm:grid-cols-2">
            <a href={links.call} className="btn-gold-solid px-5" data-testid="support-call">
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call Support
            </a>
            <a
              href={links.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp px-5 whitespace-nowrap"
              data-testid="support-whatsapp"
            >
              <WhatsAppIcon className="h-4 w-4" />
              WhatsApp Support
            </a>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
