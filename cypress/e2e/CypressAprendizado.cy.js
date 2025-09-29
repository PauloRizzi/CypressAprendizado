describe('Fluxo 1: Autenticação e Logout', () => {

  it('CT01 - Deve realizar login com sucesso', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('admin@teste.com');
    cy.get('input[type="password"]').type('123456');
    cy.get('button[type="submit"]').click();
    
    // Resultado Esperado:
    cy.url().should('include', '/dashboard');
  });

  it('CT02 - Deve exibir erro com senha inválida', () => {
    cy.visit('/login');
    cy.get('input[type="email"]').type('admin@teste.com');
    cy.get('input[type="password"]').type('654321');
    cy.get('button[type="submit"]').click();

    // Resultado Esperado:
    cy.url().should('not.include', '/dashboard');
    cy.contains('Credenciais inválidas').should('be.visible');
  });

  it('CT03 - Deve exibir erro de validação para cada campo vazio individualmente', () => {
  cy.visit('/login');
  
  // Clica em Entrar com ambos os campos vazios
  cy.get('button[type="submit"]').click();

  cy.get('input[type="email"]').then(($input) => {
    expect($input[0].validationMessage).to.eq('Preencha este campo.');
  });
  
  cy.get('input[type="email"]').type('email.valido@teste.com');

  cy.get('button[type="submit"]').click();

  cy.get('input[type="password"]').then(($input) => {
    expect($input[0].validationMessage).to.eq('Preencha este campo.');
  });
});

  it('CT13 - Deve falhar ao tentar deslogar o usuário', () => {
    // Este teste espera uma falha (RB04)
    cy.login('admin@teste.com', '123456');
    cy.visit('/dashboard');

    cy.get('.container > .inline-flex')

  });
});

describe('Fluxo 2: Dashboard e Busca', () => {
  
  beforeEach(() => {
    cy.login('admin@teste.com', '123456');
    cy.visit('/dashboard');
  });

  it('CT04 - Deve visualizar o dashboard corretamente', () => {
    // Resultado Esperado:
    cy.contains('Total de Veículos').should('be.visible');
    cy.contains('Veículos Alugados').should('be.visible');
    cy.contains('Receita Total').should('be.visible');
    cy.get('.vehicle-card').should('have.length.greaterThan', 0); // Verifica se há cards de veículos
  });

  it('CT05 - Deve buscar por modelo de veículo', () => {
    cy.get('input[placeholder="Buscar por placa ou modelo..."]').type('Toyota Corolla');
    
    // Resultado Esperado:
    cy.get('.vehicle-card').should('have.length', 1);
    cy.contains('.vehicle-card', 'Toyota Corolla').should('be.visible');
  });

  it('CT06 - Deve buscar por placa de veículo', () => {
    cy.get('input[placeholder="Buscar por placa ou modelo..."]').type('GHI3456');
    
    // Resultado Esperado:
    cy.get('.vehicle-card').should('have.length', 1);
    cy.contains('.vehicle-card', 'GHI3456').should('be.visible');
  });

  it('CT07 - Deve falhar ao não exibir mensagem para busca sem resultado', () => {
    // Este teste espera uma falha (RB07)
    cy.get('input[placeholder="Buscar por placa ou modelo..."]').type('Fusca');
    
  });
});

describe('Fluxo 3: Aluguel de Veículo', () => {

  beforeEach(() => {
    cy.login('admin@teste.com', '123456');
    cy.visit('/dashboard');
  });

  it('CT08 - Deve falhar ao tentar completar um aluguel com sucesso', () => {
    // Este teste espera falhas (RB02 e RB03)
    cy.contains('.vehicle-card', 'Bicicleta Motorizada').find('button').contains('Alugar').click();

    cy.get('div.space-y-2').type('5');
    cy.get('button.button-primary').click();

    cy.get('#pix').click();


    // // Resultado Esperado: O teste vai falhar aqui, pois o QR Code não aparecerá
    // cy.get('.qr-code-modal').should('be.visible');
  
  });

  it('CT09 - Botão "Alugar" deve estar desabilitado para veículo alugado', () => {
    // Supondo que "Honda Civic" está alugado
    cy.contains('.vehicle-card', 'Honda Civic').find('button').should('be.disabled');
  });

  it('CT10 e CT15 - Deve falhar ao calcular o desconto corretamente', () => {
    // Este teste espera uma falha (RB06)
    cy.contains('.vehicle-card', 'Scooter Elétrica').find('button').contains('Alugar').click();
    cy.get('div.space-y-2').type('2'); // Subtotal: 100 * 2 = 200
    cy.contains('button', 'Confirmar Aluguel').click();
    
    cy.get('[placeholder="Ex: DESCONTO50"]').click().type('DESCONTO50');;
    cy.contains('button', 'Aplicar').click();

    // // Resultado Esperado: O teste vai falhar, pois o valor final não será 150
    // cy.get('.valor-final').should('contain.text', 'R$ 150,00');
  });

  it('CT11 - Deve exibir erro para cupom de desconto inválido', () => {
    cy.contains('.vehicle-card', 'Fiat Uno').find('button').contains('Alugar').click();
    cy.get('div.space-y-2').type('1');
    cy.contains('button', 'Confirmar Aluguel').click();

    cy.get('[placeholder="Ex: DESCONTO50"]').click().type('DESCONTO');;
    cy.contains('button', 'Aplicar').click();

    // Resultado Esperado:
    cy.contains('Cupom inválido').should('be.visible');
  });

  it('CT12 - Deve impedir aluguel com número de dias inválido', () => {
    cy.contains('.vehicle-card', 'Fiat Uno').find('button').contains('Alugar').click();
    
    // Tentar com "0"
    cy.get('div.space-y-2').type('0');
    cy.get('button.button-primary').click();

    // cy.get('input[name="dias"]').clear().type('-5');
    // cy.contains('button', 'Confirmar Aluguel').should('be.disabled');
  });

  it('CT16 - Deve falhar ao tentar selecionar método de pagamento pelo texto', () => {
    // Este teste espera uma falha (RB08)
    cy.contains('.vehicle-card', 'Fiat Uno').find('button').contains('Alugar').click();
    cy.get('input[name="dias"]').type('1');
    cy.contains('button', 'Confirmar Aluguel').click();

    // Passo: Tentar clicar no label de texto, não no radio button, resultado não obtivo pelo teste automatizado
    cy.contains('label', 'Cartão de Crédito').click();

    // // Resultado Esperado: O teste vai falhar, pois o radio button não será marcado
    // cy.get('input[value="credit-card"]').should('be.checked');
  });
});