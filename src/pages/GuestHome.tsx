import { Hero } from '../components/Hero'
import { FeatureCards } from '../components/FeatureCards'
import { WifiSection } from '../components/WifiSection'
import { SupportSection } from '../components/SupportSection'
import { ReviewSection } from '../components/ReviewSection'
import { Footer } from '../components/Footer'

export function GuestHome() {
  return (
    <>
      <Hero />
      <main id="main" className="pattern">
        <FeatureCards />
        <WifiSection />
        <SupportSection />
        <ReviewSection />
      </main>
      <Footer />
    </>
  )
}
