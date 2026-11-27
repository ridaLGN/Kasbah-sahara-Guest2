import type { CSSProperties, ReactNode } from 'react'
import { ArrowRight, Martini, Wifi } from 'lucide-react'
import { Link } from '../lib/router'
import { links } from '../config/site'
import { WhatsAppIcon } from './WhatsAppIcon'

interface CardProps {
  index: string
  icon: ReactNode
  title: string
  subtitle: string
  action: ReactNode
  delay: number
  testId: string
}

function FeatureCard({ index, icon, title, subtitle, action, delay, testId }: CardProps) {
  return (
    <article
      data-testid={testId}
      className="card animate-rise delay-var group relative grid grid-cols-[auto_1fr] items-center gap-x-5 overflow-hidden px-5 pt-5 pb-5 text-left transition duration-500 hover:-translate-y-1 md:flex md:flex-col md:px-6 md:pt-8 md:pb-7 md:text-center"
      style={{ '--d': `${delay}ms` } as CSSProperties}
    >
      <span className="absolute top-5 left-6 hidden font-display text-sm text-gold italic md:block" aria-hidden="true">
        {index}
      </span>
      <div className="arch row-span-2 flex h-16 w-13 items-center justify-center bg-gradient-to-b from-ivory-deep to-sand/50 text-brown ring-1 ring-gold/30 transition duration-500 group-hover:from-sand/60 group-hover:to-gold/40 md:h-20 md:w-16">
        {icon}
      </div>
      <h2 className="self-end font-display text-[1.5rem] leading-tight text-charcoal min-[400px]:text-[1.7rem] md:mt-5 md:self-auto md:text-[1.9rem]">
        {title}
      </h2>
      <p className="self-start text-[0.95rem] text-brown-soft md:mt-1 md:self-auto">{subtitle}</p>
      <div className="col-span-2 mt-4 w-full md:mt-auto md:pt-6">{action}</div>
    </article>
  )
}

export function FeatureCards() {
  return (
    <section aria-label="Guest services" className="relative z-10 -mt-28 px-4 sm:-mt-36 sm:px-6">
      <div className="mx-auto grid max-w-5xl gap-4 sm:gap-5 md:grid-cols-3">
        <FeatureCard
          testId="card-wifi"
          index="01"
          delay={250}
          icon={<Wifi className="h-7 w-7" strokeWidth={1.4} aria-hidden="true" />}
          title="Stay Connected"
          subtitle="Connect to our Wi-Fi"
          action={
            <a href="#wifi" className="btn-gold w-full">
              <Wifi className="h-4 w-4" aria-hidden="true" />
              Connect to Wi-Fi
            </a>
          }
        />
        <FeatureCard
          testId="card-menu"
          index="02"
          delay={350}
          icon={<Martini className="h-7 w-7" strokeWidth={1.4} aria-hidden="true" />}
          title="Drinks & Refreshments"
          subtitle="Discover our selection"
          action={
            <Link to="/menu" className="btn-gold w-full">
              Explore the Menu
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          }
        />
        <FeatureCard
          testId="card-support"
          index="03"
          delay={450}
          icon={<WhatsAppIcon className="h-7 w-7" />}
          title="Guest Assistance"
          subtitle="We are here to help"
          action={
            <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className="btn-gold w-full">
              <WhatsAppIcon className="h-4 w-4" />
              Contact Support
            </a>
          }
        />
      </div>
    </section>
  )
}
