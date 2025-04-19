describe('End-to-End User Workflow', () => {
    before(() => {
      // Clean up test database or set up test data
      cy.request('POST', 'http://localhost:10210/api/test/cleanup');
    });
  
    it('should allow a user to register, login, create an application and generate a cover letter', () => {
      // Register
      cy.visit('/register');
      cy.get('input[placeholder="Create a username"]').type('testuser123');
      cy.get('input[placeholder="Enter your email"]').type('testuser123@example.com');
      cy.get('input[placeholder="Create a password"]').type('Password123!');
      cy.get('input[placeholder="Confirm your password"]').type('Password123!');
      cy.get('select').select('male');
      cy.contains('button', 'Register').click();
      
      // Verify redirect to dashboard
      cy.url().should('include', '/');
      
      // Navigate to cover letter page
      cy.contains('a', 'Cover Letter').click();
      cy.url().should('include', '/cover-letter');
      
      // Enter resume and job description
      cy.get('textarea[placeholder*="paste your resume"]').type('I am a software engineer with 5 years of experience in React and Node.js');
      cy.get('textarea[placeholder*="job description"]').type('We are looking for a software engineer with React experience');
      
      // Generate cover letter
      cy.contains('button', 'Generate Cover Letter').click();
      cy.contains('Professional Cover Letter', { timeout: 10000 }).should('be.visible');
      
      // Add to applications
      cy.contains('button', 'Add to Application').click();
      cy.get('input[placeholder*="Company Name"]').should('have.value', '');
      cy.get('input[placeholder*="Company Name"]').type('Cypress Test Company');
      cy.contains('button', 'Add').click();
      
      // Verify application was added
      cy.visit('/applications');
      cy.contains('Cypress Test Company').should('be.visible');
    });
  });