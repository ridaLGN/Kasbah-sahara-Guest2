import { links } from '../config/site'
import { WhatsAppIcon } from './WhatsAppIcon'

/** Always-available support shortcut (bottom-right, above the iPhone home bar). */
export function FloatingWhatsApp() {
  return (
    <a
      href={links.whatsapp}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp guest support"
      data-testid="floating-whatsapp"
      className="animate-rise delay-var no-print fixed right-[max(1rem,env(safe-area-inset-right))] bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 flex h-14 w-14 items-center justify-center rounded-full bg-whatsapp text-white shadow-[0_12px_30px_-8px_rgba(18,140,74,.6)] ring-4 ring-white/70 transition hover:scale-105 hover:bg-whatsapp-hover active:scale-95"
      style={{ ['--d' as string]: '1200ms' }}
    >
      <WhatsAppIcon className="h-7 w-7" />
    </a>
  )
}
