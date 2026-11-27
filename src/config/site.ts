/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  SITE SETTINGS – contacts, links and public address.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const site = {
  name: 'Kasbah Sahara Services',
  shortName: 'Kasbah Sahara',
  /** Main hotel website (linked in the footer). */
  website: 'https://kasbahsaharaservices.com/',
  locationLine: "M'hamid El Ghizlane · Zagora · Morocco",
  /** Short line above the welcome title. */
  heroLine: 'Sahara Desert · Morocco',

  /** Guest support – used by every "Call" and "WhatsApp" button. */
  support: {
    name: 'Redouane',
    role: 'Guest Support',
    /** International format, digits only, no "+". */
    phone: '212620202610',
    phoneDisplay: '+212 620 202 610',
  },

  /**
   * Google reviews – "Leave a review" button.
   * Currently: the hotel's Google Maps listing ("Hôtel Kasbah Sahara Services"),
   * where guests tap "Write a review" / "Donner un avis".
   * For a link that opens the review form directly, copy the link from
   * Google Business Profile → "Ask for reviews" (https://g.page/r/…/review)
   * and paste it here.
   */
  googleReviewUrl: 'https://www.google.com/maps?cid=12418739456161443821',

  /** Currency label displayed after every price. */
  currency: 'DH',
  currencyLong: 'Moroccan dirhams (MAD)',

  /** Website credit shown in the footer. */
  developer: { name: 'Rida Lagnaoui', url: 'https://www.linkedin.com/in/lagnaouirida' },
}

export const links = {
  call: `tel:+${site.support.phone}`,
  whatsapp: `https://wa.me/${site.support.phone}`,
}
