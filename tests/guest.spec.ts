import { expect, test, type Locator, type Page } from '@playwright/test'
import jsQR from 'jsqr'
import { PNG } from 'pngjs'
import { menu } from '../src/data/menu'
import { wifi } from '../src/config/wifi'
import { wifiPayload } from '../src/lib/wifi'

const WA = 'https://wa.me/212620202610'
const TEL = 'tel:+212620202610'

/** Screenshots an element and decodes the QR code it contains. */
async function decodeQr(el: Locator) {
  await expect(el.locator('svg')).toBeVisible()
  // Bring it into view (triggers the reveal), then let the fade-in reach full contrast.
  await el.scrollIntoViewIfNeeded()
  await expect(el).toBeInViewport()
  await el.page().waitForTimeout(150)
  const png = PNG.sync.read(await el.screenshot({ animations: 'disabled' }))
  return jsQR(new Uint8ClampedArray(png.data), png.width, png.height)?.data
}

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
  expect(overflow).toBeLessThanOrEqual(0)
}

test.describe('Guest home', () => {
  test('hero shows logo, title and subtitle', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Kasbah Sahara Services/)
    await expect(page.getByRole('img', { name: 'Kasbah Sahara Services' }).first()).toBeVisible()
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome to Kasbah Sahara')
    await expect(page.getByText('Your desert experience, elevated.')).toBeVisible()
    await noHorizontalScroll(page)
  })

  test('three service cards with working actions', async ({ page }) => {
    await page.goto('/')
    const wifiCard = page.getByTestId('card-wifi')
    await expect(wifiCard.getByRole('heading')).toHaveText('Stay Connected')
    await expect(wifiCard.getByText('Connect to our Wi-Fi')).toBeVisible()
    await expect(page.getByTestId('card-menu').getByRole('heading')).toHaveText('Drinks & Refreshments')
    await expect(page.getByTestId('card-support').getByRole('heading')).toHaveText('Guest Assistance')
    await expect(page.getByTestId('card-support').getByRole('link', { name: 'Contact Support' })).toHaveAttribute('href', WA)

    await wifiCard.getByRole('link', { name: 'Connect to Wi-Fi' }).click()
    await expect(page.locator('#wifi')).toBeInViewport()

    await page.getByTestId('card-menu').getByRole('link', { name: /Explore the Menu/ }).click()
    await expect(page).toHaveURL(/\/menu$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Drinks & Refreshments')
  })

  test('floating WhatsApp button is always reachable', async ({ page }) => {
    await page.goto('/')
    const fab = page.getByTestId('floating-whatsapp')
    await expect(fab).toBeVisible()
    await expect(fab).toHaveAttribute('href', WA)
    await page.mouse.wheel(0, 3000)
    await expect(fab).toBeInViewport()
    const box = (await fab.boundingBox())!
    expect(box.width).toBeGreaterThanOrEqual(48)
  })
})

test.describe('Wi-Fi', () => {
  test('shows network, password and a scannable Wi-Fi QR code', async ({ page }) => {
    await page.goto('/#wifi')
    await expect(page.getByTestId('wifi-ssid')).toHaveText(wifi.ssid)
    await expect(page.getByTestId('wifi-password')).toHaveText(wifi.password)
    const expected = wifiPayload(wifi)
    expect(expected).toBe('WIFI:T:WPA;S:Kasbah Sahara;P:sahara100100;;')
    expect(await decodeQr(page.getByTestId('wifi-qr'))).toBe(expected)
  })

  test('connect button copies the password and shows the steps', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write'])
    await page.goto('/#wifi')
    await page.getByTestId('wifi-connect').click()
    await expect(page.getByRole('status')).toContainText('Password copied')
    await expect(page.getByTestId('wifi-steps')).toBeVisible()
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(wifi.password)
    await page.getByRole('tab', { name: 'Android' }).click()
    await expect(page.getByTestId('wifi-steps')).toContainText('Network & Internet')
  })

  test('special characters are escaped in the QR payload', () => {
    expect(wifiPayload({ ssid: 'A;B', password: 'p:a,s"s\\', security: 'WPA', hidden: true })).toBe(
      'WIFI:T:WPA;S:A\\;B;P:p\\:a\\,s\\"s\\\\;H:true;;',
    )
  })
})

test.describe('Drinks menu', () => {
  test('lists every drink and every price exactly as in the data file', async ({ page }) => {
    await page.goto('/menu')
    for (const cat of menu) {
      const section = page.getByTestId(`category-${cat.id}`)
      await expect(section.getByRole('heading', { level: 2 })).toHaveText(cat.title)
      for (const d of cat.drinks) {
        const row = section.getByTestId(`drink-${d.id}`)
        await expect(row).toContainText(d.name)
        for (const p of d.prices) {
          // Multi-price drinks (wine) label each column for screen readers: "Bottle: 250DH"
          const label = d.prices.length > 1 ? `${p.serving}: ` : ''
          await expect(row).toContainText(`${label}${p.amount}DH`)
        }
      }
    }
    // Spot-check the printed menu
    await expect(page.getByTestId('drink-soda')).toContainText('20')
    await expect(page.getByTestId('drink-chandon')).toContainText('2200')
    await expect(page.getByTestId('drink-tandem')).toContainText('800')
    await noHorizontalScroll(page)
  })

  test('category navigation scrolls to the section', async ({ page }) => {
    await page.goto('/menu')
    await page.getByRole('navigation', { name: 'Menu categories' }).getByRole('button', { name: 'Champagne' }).click()
    await expect(page.getByTestId('category-champagne')).toBeInViewport()
  })

  test('search filters drinks, ignores accents and handles no results', async ({ page }) => {
    await page.goto('/menu')
    const search = page.getByLabel('Search the menu')
    await search.fill('moet')
    await expect(page.getByTestId('drink-moet')).toBeVisible()
    await expect(page.getByTestId('drink-chandon')).toHaveCount(0)
    await expect(page.getByText('1 drink found')).toBeVisible()

    await search.fill('juice')
    await expect(page.locator('[data-testid^="drink-"]')).toHaveCount(4) // orange, apple, carrot, lemon

    await search.fill('wine')
    await expect(page.getByTestId('category-wine').locator('[data-testid^="drink-"]')).toHaveCount(4)

    await search.fill('xyz')
    await expect(page.getByTestId('no-results')).toBeVisible()
    await page.getByRole('button', { name: 'Show the full menu' }).click()
    await expect(page.locator('[data-category]')).toHaveCount(menu.length)
  })

  test('back to home', async ({ page }) => {
    await page.goto('/menu')
    await page.getByTestId('back-home').click()
    await expect(page).toHaveURL(/\/$/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Welcome to Kasbah Sahara')
    // Browser back button returns to the menu
    await page.goBack()
    await expect(page).toHaveURL(/\/menu$/)
  })
})

test.describe('Support', () => {
  test('call and WhatsApp buttons use the support number', async ({ page }) => {
    await page.goto('/#support')
    await expect(page.getByRole('heading', { name: 'Need Assistance?' })).toBeVisible()
    await expect(page.getByText('Our team is always happy to help you during your stay.')).toBeVisible()
    await expect(page.getByText('Redouane')).toBeVisible()
    await expect(page.getByTestId('support-phone')).toHaveText('+212 620 202 610')
    await expect(page.getByTestId('support-phone')).toHaveAttribute('href', TEL)
    await expect(page.getByTestId('support-call')).toHaveAttribute('href', TEL)
    await expect(page.getByTestId('support-whatsapp')).toHaveAttribute('href', WA)
    for (const id of ['support-call', 'support-whatsapp']) {
      expect((await page.getByTestId(id).boundingBox())!.height).toBeGreaterThanOrEqual(48)
    }
  })
})

test.describe('Google reviews', () => {
  test('review button opens the hotel Google listing in a new tab', async ({ page }) => {
    await page.goto('/#reviews')
    await expect(page.getByRole('heading', { name: 'Enjoyed your stay?' })).toBeVisible()
    const btn = page.getByTestId('google-review')
    await expect(btn).toHaveAttribute('href', 'https://www.google.com/maps?cid=12418739456161443821')
    await expect(btn).toHaveAttribute('target', '_blank')
    expect((await btn.boundingBox())!.height).toBeGreaterThanOrEqual(48)
  })
})

test.describe('Main QR code', () => {
  test('staff page QR decodes to the site home page', async ({ page, baseURL }) => {
    await page.goto('/qr')
    expect(await decodeQr(page.getByTestId('main-qr'))).toBe(`${baseURL}/`)
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex')
  })
})
