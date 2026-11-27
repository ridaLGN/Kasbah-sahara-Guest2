import { defineConfig, devices } from '@playwright/test'

const PORT = 4180

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  workers: 4,
  timeout: 60_000,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  webServer: {
    command: `npm run build && npm run preview -- --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    // iPhone / iPad are emulated in Chromium (viewport, touch, user agent).
    { name: 'iphone-se', use: { ...devices['iPhone SE'], browserName: 'chromium' } },
    { name: 'iphone-14', use: { ...devices['iPhone 14'], browserName: 'chromium' } },
    { name: 'android-pixel-7', use: { ...devices['Pixel 7'] } },
    { name: 'ipad', use: { ...devices['iPad (gen 7)'], browserName: 'chromium' } },
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
})
