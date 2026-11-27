import { ExternalLink, Star } from 'lucide-react'
import { site } from '../config/site'
import { Ornament, Reveal } from './ui'

/** Invites guests to share their experience on the hotel's Google listing. */
export function ReviewSection() {
  return (
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-4 px-4 pt-6 pb-20 sm:px-6 sm:pb-28">
      <Reveal className="card relative mx-auto max-w-3xl overflow-hidden px-6 py-12 text-center sm:px-14 sm:py-16">
        <div aria-hidden="true" className="pattern absolute inset-0 opacity-70" />
        <div className="relative">
          <div className="flex justify-center gap-1.5 text-gold" aria-hidden="true">
            {Array.from({ length: 5 }, (_, i) => (
              <Star key={i} className="h-6 w-6 fill-current" strokeWidth={1} />
            ))}
          </div>
          <p className="eyebrow mt-6">Guest Reviews</p>
          <h2 id="reviews-title" className="mt-3 font-display text-4xl text-charcoal sm:text-5xl">
            Enjoyed your stay?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-brown-soft">
            Share your experience on Google. Your words help other travellers discover the desert, and mean the world to
            our team.
          </p>
          <Ornament className="mt-7" />
          <a
            href={site.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="google-review"
            className="btn-gold mt-8 w-full px-4 tracking-[0.1em] whitespace-nowrap sm:w-auto sm:px-8 sm:tracking-[0.16em]"
          >
            <Star className="h-4 w-4 shrink-0 fill-current" aria-hidden="true" />
            Review us on Google
            <ExternalLink className="hidden h-3.5 w-3.5 opacity-70 sm:block" aria-hidden="true" />
          </a>
          <p className="mt-4 text-xs text-brown-soft/80">
            Opens our Google page. Tap “Write a review” and choose your stars.
          </p>
        </div>
      </Reveal>
    </section>
  )
}
