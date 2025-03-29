// Replace Jest configuration with Playwright setup
module.exports = {
  testDir: './tests',
  timeout: 30000,
  retries: 2,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
  },
};
