import type { WifiConfig } from '../config/wifi'

/** Escapes the characters reserved by the Wi-Fi QR format: \ ; , : " */
const esc = (v: string) => v.replace(/([\\;,:"])/g, '\\$1')

/**
 * Standard Wi-Fi QR payload, read natively by the iOS and Android cameras:
 *   WIFI:T:WPA;S:<ssid>;P:<password>;;
 */
export function wifiPayload({ ssid, password, security, hidden }: WifiConfig): string {
  let s = `WIFI:T:${security};S:${esc(ssid)};`
  if (security !== 'nopass') s += `P:${esc(password)};`
  if (hidden) s += 'H:true;'
  return `${s};`
}
