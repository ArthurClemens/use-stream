describe('Interval', () => {
  beforeEach(() => {
    cy.visit('/Interval');
  });

  it('should show initial state', () => {
    cy.get('[data-testid=count]').should('contain', '0');
    cy.get('[data-testid=delay]').should('contain', '500');
  });

  it('should show an incremented value', () => {
    cy.wait(100);
    cy.get('[data-testid=count]').should($value => {
      const text = $value.text();
      const value = parseInt(text, 10);
      expect(value).to.be.lessThan(1000);
      expect(value).to.be.greaterThan(0);
    });
  });

  it('should show a regular increment', () => {
    cy.wait(1500);
    cy.get('[data-testid=count]').should($value => {
      const text = $value.text();
      const value = parseInt(text, 10);
      expect(value).to.equal(10);
    });
    cy.wait(1000);
    cy.get('[data-testid=count]').should($value => {
      const text = $value.text();
      const value = parseInt(text, 10);
      expect(value).to.equal(20);
    });
  });

  it('should slow the increment', () => {
    cy.get('[data-testid=btn-slower]').click();
    cy.get('[data-testid=btn-slower]').click();
    cy.get('[data-testid=btn-slower]').click();
    cy.get('[data-testid=delay]').should('contain', '2000');
    cy.wait(1500);
    cy.get('[data-testid=count]').should($value => {
      const text = $value.text();
      const value = parseInt(text, 10);
      expect(value).to.equal(1);
    });
    cy.wait(1000);
    cy.get('[data-testid=count]').should($value => {
      const text = $value.text();
      const value = parseInt(text, 10);
      expect(value).to.equal(2);
    });
  });
});
