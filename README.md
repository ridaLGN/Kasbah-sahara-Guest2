# Kasbah Sahara Services – Guest Experience

Mobile guest website reached through **one QR code** placed in the tents and rooms. From a single page, guests can:

- **Connect to the Wi-Fi**: network name, password with a copy button, guided steps for iPhone and Android, and a Wi-Fi QR code for a second device.
- **Browse the drinks menu** (`/menu`): categories, search, prices in dirhams.
- **Contact guest support**: call or WhatsApp Redouane, +212 620 202 610. A floating WhatsApp button stays on screen everywhere.

**Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Lucide icons, `qrcode`. The site is fully static: no server, no database, no paid service.

---

## 1. Editing content

| To change… | Edit this file |
|---|---|
| **Wi-Fi name / password** (the Wi-Fi QR code updates automatically) | [`src/config/wifi.ts`](src/config/wifi.ts) |
| **Drinks, prices, categories** | [`src/data/menu.ts`](src/data/menu.ts) |
| Support name, phone number, WhatsApp | [`src/config/site.ts`](src/config/site.ts) |
| Logo / photos | `public/brand/`, `public/images/` |

**Example: Lemon Juice goes from 40 DH to 45 DH.** In `src/data/menu.ts`:

```ts
{ id: 'lemon-juice', name: 'Lemon Juice', localName: 'Jus de citron', prices: [{ amount: 45 }] },
```

- To hide a drink temporarily, add `available: false`.
- For a drink photo, put a `.webp` in `public/images/drinks/` and add `image: '/images/drinks/file.webp'`.
- Prices also feed Google's structured data (JSON-LD) automatically.

After any change: `npm run build`, then put the site back online (automatic with Netlify connected to GitHub). If the Wi-Fi password changes, **also reprint the poster**, which shows it as text.

---

## 2. Running the project

Requires Node.js 20 or later.

```bash
npm install        # once
npm run dev        # local preview at http://localhost:5173
npm run build      # production site in dist/
npm test           # automated tests: iPhone SE, iPhone 14, Pixel 7, iPad, desktop
```

To test on a phone: `npm run dev -- --host`, then open the "Network" address with the phone on the same Wi-Fi.

---

## 3. Going live

**Netlify (recommended, free):** connect the repository. `netlify.toml` already holds the build command, the `/menu` routing and the security headers. Set the `VITE_PUBLIC_SITE_URL` environment variable to the final address, for example `https://guest.kasbahsaharaservices.com`.

**Classic hosting (cPanel, Hostinger…):** run `npm run build` and upload the **contents** of `dist/`. The included `.htaccess` handles HTTPS, the `/menu` routing and the headers.

Suggested address: a sub-domain `guest.kasbahsaharaservices.com` (a CNAME record at your domain registrar pointing to Netlify).

---

## 4. The QR code and poster

```bash
npm run qr -- --url https://guest.kasbahsaharaservices.com
```

Creates in `qr/`:

| File | Use |
|---|---|
| `poster-A5.pdf` | **Poster to print**: A5, vector QR code, Wi-Fi details and support number in text |
| `poster-A5.png` | Same poster, 300 dpi image |
| `qr-code-logo.png` / `.svg` | Main QR code with the Kasbah mark (2048 px / vector) |
| `qr-code.png` / `.svg` | Main QR code without logo, widest compatibility |
| `wifi-qr.png` | Wi-Fi QR code on its own |

Every file is decoded again after it is created. The script stops if a code does not read back exactly the right content.

The staff page **`/qr`** on the live site also shows the branded QR code, with **Download PNG** and **Print** buttons. It is not linked from guest pages and is hidden from search engines.

> ⚠️ The files currently in `qr/` point to `https://guest.kasbahsaharaservices.com/`, which does **not exist yet**. Put the site online first, test the address on a phone, then generate and print.

**Printing:** matte paper 250–300 g, print at 100 % (no "fit to page"). Don't print the QR code smaller than 3 cm. Test with an iPhone and an Android phone before printing in bulk.

---

## 5. Notes on Wi-Fi

Browsers cannot join a Wi-Fi network on the guest's behalf (no iOS or Android browser allows it). So the page does what is actually possible:

1. **Connect to Wi-Fi** copies the password and shows the 3 steps for the guest's phone.
2. The **Wi-Fi QR code** lets a second device (tablet, laptop, a companion's phone) join by scanning, using the phone's camera.
3. The poster shows the network name and password in text. That matters because **a guest without mobile data cannot open the website** until they are on the Wi-Fi.

---

## 6. Structure

```
src/
  config/wifi.ts        ← Wi-Fi name and password
  config/site.ts        ← support contact, links
  data/menu.ts          ← drinks menu and prices
  lib/                  ← Wi-Fi QR format, QR generation, mini router
  components/           ← Hero, FeatureCards, WifiSection, WifiQRCode,
                          MenuCategory, SupportSection, MainQRCode, …
  pages/                ← GuestHome (/), DrinksMenu (/menu), QrPage (/qr)
scripts/generate-qr.mjs ← print QR codes and poster
tests/guest.spec.ts     ← automated tests
```

Hero photo: Unsplash (free commercial licence), shared with the Spa site.
