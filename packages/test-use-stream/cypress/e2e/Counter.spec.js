describe('Counter', () => {
  beforeEach(() => {
    cy.visit('/Counter');
  });

  describe('Incrementing counter', () => {
    it('should show initial state', () => {
      cy.get('[data-testid=counter-1] [data-testid=count]').should(
        'contain',
        '0',
      );
      cy.get('[data-testid=counter-1] [data-testid=btn-decrement]').should(
        'be.disabled',
      );
      cy.get('[data-testid=counter-1] [data-testid=btn-increment]').should(
        'not.be.disabled',
      );
    });

    it('should increment the counter', () => {
      cy.get('[data-testid=counter-1] [data-testid=btn-increment]').click();
      cy.get('[data-testid=counter-1] [data-testid=count]').should(
        'contain',
        '1',
      );
      cy.get('[data-testid=counter-1] [data-testid=btn-decrement]').should(
        'not.be.disabled',
      );
    });
  });

  describe('Decrementing counter', () => {
    it('should show initial state', () => {
      cy.get('[data-testid=counter-2] [data-testid=count]').should(
        'contain',
        '100',
      );
      cy.get('[data-testid=counter-2] [data-testid=btn-decrement]').should(
        'not.be.disabled',
      );
      cy.get('[data-testid=counter-2] [data-testid=btn-increment]').should(
        'be.disabled',
      );
    });

    it('should increment the counter', () => {
      cy.get('[data-testid=counter-2] [data-testid=btn-decrement]').click();
      cy.get('[data-testid=counter-2] [data-testid=count]').should(
        'contain',
        '99',
      );
      cy.get('[data-testid=counter-2] [data-testid=btn-increment]').should(
        'not.be.disabled',
      );
    });
  });
});
