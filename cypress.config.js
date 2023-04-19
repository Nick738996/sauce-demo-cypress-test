const { defineConfig } = require('cypress');

module.exports = defineConfig({
  viewportWidth: 1920,
  viewportHeight: 1080,
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    excludeSpecPattern: [
      '**/1-getting-started/**',
      '**/2-advanced-examples/**',
    ],
    chromeWebSecurity: false,
    pageLoadTimeout: 5000,
    requestTimeout: 5000,
    responseTimeout: 30000,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    env: {
      standardUsername: 'standard_user',
      lockedUsername: 'locked_out_user',
      problemUsername: 'problem_user',
      performanceUsername: 'performance_glitch_user',
      noUser: 'no_user',
      password: 'secret_sauce',
      inventoryUrl: '/inventory.html',
      inventoryItemUrl: '/inventory-item.html?id=',
      cartUrl: '/cart.html',
      checkoutUrl1: '/checkout-step-one.html',
      checkoutUrl2: '/checkout-step-two.html',
      checkoutCompleted: '/checkout-complete.html',
    },
  },
});
