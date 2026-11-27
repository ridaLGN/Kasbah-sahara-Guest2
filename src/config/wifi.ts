/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  WI-FI SETTINGS
 *  The only file to edit when the network name or password changes.
 *  The Wi-Fi QR code on the website is generated from these values
 *  automatically (standard format: WIFI:T:WPA;S:<name>;P:<password>;;).
 * ─────────────────────────────────────────────────────────────────────────────
 */

export type WifiSecurity = 'WPA' | 'WEP' | 'nopass'

export interface WifiConfig {
  /** Network name (SSID), exactly as it appears in the phone's Wi-Fi list. */
  ssid: string
  /** Network password. Ignored when security is 'nopass'. */
  password: string
  /** 'WPA' covers WPA, WPA2 and WPA3 personal networks. */
  security: WifiSecurity
  /** true only if the network is hidden (not broadcast). */
  hidden: boolean
}

/**
 * Values taken from the camp's existing Wi-Fi QR code ("Kasbah Sahara"),
 * which decodes to: WIFI:S:Kasbah Sahara;T:WPA;P:sahara100100;H:false;;
 */
export const wifi: WifiConfig = {
  ssid: 'Kasbah Sahara',
  password: 'sahara100100',
  security: 'WPA',
  hidden: false,
}
