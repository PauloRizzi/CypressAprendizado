const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    // Adicione esta linha com a URL base da aplicação
    baseUrl: 'https://qe-test.recrutamento.avantsoft.com.br',

    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});