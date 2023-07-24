describe('Locale detection', () => {
	beforeEach(() => {
		cy.intercept('/api/locales', {
			fixture: 'locales.json',
		});

		cy.clearAllCookies();
		cy.clearAllLocalStorage();
	});

	it('English locale detection', () => {
		cy
			.intercept('/api/articles?locale=en&metadataOnly=true', {
				fixture: 'articles.json',
			})
			.as('getArticles');
		cy.visit('/en').intercept('/en').as('page'); // Visit the English homepage

		cy.url().should('include', '/en'); // Check that the URL contains the locale

		cy.getCookie('NEXT_LOCALE').should('have.property', 'value', 'en'); // Check that the locale cookie is set to English

		cy.wait('@getArticles'); // Wait for the locale to be set
		cy
			.window()
			.its('localStorage')
			.then((localStorage) => {
				expect(localStorage.getItem('settings')).exist;

				const settings = JSON.parse(localStorage.getItem('settings') || '{}');

				expect(settings.locale).to.equal('en'); // Check that the locale in the settings is set to English
			});

		cy
			.title()
			.should('eq', 'Survival Manual'); // Check that the title is in English

		cy
			.get('h1')
			.should('have.text', 'Introduction'); // Check that the text is in English
	});

	it('Ukrainian locale detection', () => {
		cy
			.intercept('/api/articles?locale=uk&metadataOnly=true', {
				fixture: 'articles.uk.json',
			})
			.as('getArticles');
		cy.visit('/uk'); // Visit the Ukrainian homepage

		cy.url().should('include', '/uk'); // Check that the URL contains the locale

		cy.getCookie('NEXT_LOCALE').should('have.property', 'value', 'uk'); // Check that the locale cookie is set to Ukrainian

		cy.wait('@getArticles'); // Wait for the locale to be set
		cy
			.window()
			.its('localStorage')
			.then((localStorage) => {
				expect(localStorage.getItem('settings')).exist;

				const settings = JSON.parse(localStorage.getItem('settings') || '{}');

				expect(settings.locale).to.equal('uk'); // Check that the locale in the settings is set to English
			});

		cy
			.title()
			.should('eq', 'Довідник по виживанню'); // Check that the title is in Ukrainian

		cy
			.get('h1')
			.should('have.text', 'Знайомство'); // Check that the text is in Ukrainian
	});
});