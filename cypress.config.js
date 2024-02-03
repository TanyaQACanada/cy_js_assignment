const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://stage.dashboard.onelocal.com/',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
