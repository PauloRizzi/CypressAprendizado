// Adiciona o comando customizado 'login'
Cypress.Commands.add('login', (email, password) => {
  // cy.session otimiza o login para que ele não precise ser refeito visualmente a cada teste
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type(email);
    cy.get('input[type="password"]').type(password);
    cy.get('button[type="submit"]').click();
    // Garante que o login foi bem sucedido antes de prosseguir
    cy.url().should('include', '/dashboard');
  });
});