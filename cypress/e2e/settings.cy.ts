function convertRemToPixels(rem: number) {
	return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

let originalOnLine: boolean;

const goOffline = () => {
	cy.log("offline");
	return cy.window({ log: false }).then((win) => {
		if (!originalOnLine) {
			originalOnLine = win.navigator.onLine;
		}

		Object.defineProperty(win.navigator.constructor.prototype, "onLine", {
			get: () => {
				return originalOnLine;
			},
		});

		const isOnline = originalOnLine;
		originalOnLine = false;

		if (isOnline) {
			win.dispatchEvent(new win.Event("offline"));
		}
	});
};

const goOnline = () => {
	cy.log("online");
	return cy.window({ log: false }).then((win) => {
		if (!originalOnLine) {
			originalOnLine = win.navigator.onLine;
		}

		Object.defineProperty(win.navigator.constructor.prototype, "onLine", {
			get: () => {
				return originalOnLine;
			},
		});

		const isOnline = originalOnLine;
		originalOnLine = true;

		if (!isOnline) {
			win.dispatchEvent(new win.Event("online"));
		}
	});
};

describe('Settings', () => {
	beforeEach(() => {
		cy.clearAllLocalStorage();
		cy.clearAllCookies();
		cy
			.log('Clear all caches')
			.window()
			.its('caches')
			.then(async (caches) => {
				const cacheNames = await caches.keys();
				cacheNames.forEach(async (cacheName) => {
					await caches.delete(cacheName);
				});
			});

		cy.visit('/en/settings');

		cy
			.intercept('GET', '/api/locales', {
				fixture: 'locales.json',
			})
			.as('getLocales')

		cy
			.intercept('GET', '/api/articles?locale=en&metadataOnly=true', {
				fixture: 'articles.json',
			})
			.as('getArticles');

		cy
			.intercept('GET', '/api/articlesMedia?locale=**', {
				fixture: 'articlesMedia.json',
			})
			.as('getArticlesMedia');

		cy.wait('@getLocales');
	});

	it('Change language', () => {
		cy
			.findAllByLabelText('Language')
			.first()
			.should('have.value', 'en') // Default value for /en/
			.select('uk'); // Change the language to Ukrainian

		cy.url().should('include', '/uk/settings'); // Check that the URL contains the locale

		cy
			.window()
			.its('localStorage')
			.then((localStorage) => {
				expect(localStorage.getItem('settings')).exist;
				const settings = JSON.parse(localStorage.getItem('settings') || '{}');
				expect(settings.locale).to.equal('uk'); // Check that the locale in the settings is set to English
			});

		cy.getCookie('NEXT_LOCALE').should('have.property', 'value', 'uk'); // Check that the locale cookie is set to Ukrainian

		cy.title().should('include', 'Довідник по виживанню'); // Check that the title is in Ukrainian

		cy.wait('@getLocales');

		cy
			.findAllByLabelText('Мова')
			.first()
			.should('have.value', 'uk');
	});

	it('Change theme', () => {
		cy
			.findByLabelText('Theme')
			.as('themeSelect')
			.should('have.value', 'system'); // Default value

		//TODO: add test for system theme

		const colorModeValues = [{
			value: 'light',
			bodyBg: 'white',
			bodyText: 'gray-800',
		}, {
			value: 'dark',
			bodyBg: 'gray-800',
			bodyText: 'whiteAlpha-900',
		}];

		for (let colorModeValue of colorModeValues) {
			cy.log(`Change theme to ${colorModeValue.value}`);

			cy
				.get('@themeSelect')
				.select(colorModeValue.value) // Change the theme to dark
				.should('have.value', colorModeValue.value); // Check that the theme is changed

			cy // Check the theme
				.document()
				.its('body')
				.then((body) => {
					const styles = window.getComputedStyle(body);
					expect(
						styles.getPropertyValue('--chakra-colors-chakra-body-bg')
					)
						.to
						.equal(
							styles.getPropertyValue(`--chakra-colors-${colorModeValue.bodyBg}`)
						); // Check that the theme is dark

					expect(
						styles.getPropertyValue('--chakra-colors-chakra-body-text')
					)
						.to
						.equal(
							styles.getPropertyValue(`--chakra-colors-${colorModeValue.bodyText}`)
						); // Check that the theme is dark
				});

			cy
				.window()
				.its('localStorage')
				.then((localStorage) => {
					const settings = JSON.parse(localStorage.getItem('settings') || '{}');
					expect(settings.colorMode).to.equal(colorModeValue.value); // Check that the locale in the settings is set to English
				});
		}
	});

	it('Change font size', () => {
		cy
			.findByLabelText('Font Size')
			.as('fontSizeSelect')
			.should('have.value', 'base'); // Default value

		const fontSizeValues = ['sm', 'md', 'lg', 'xl', 'base'];

		for (let fontSizeValue of fontSizeValues) {
			cy.log(`Change font size to ${fontSizeValue}`);

			if (fontSizeValue === 'base') {
				fontSizeValue = 'md';
			}

			cy
				.get('@fontSizeSelect')
				.select(fontSizeValue) // Change the font size
				.should('have.value', fontSizeValue); // Check that the font size is changed

			cy
				.window()
				.its('localStorage')
				.then((localStorage) => {
					const settings = JSON.parse(localStorage.getItem('settings') || '{}');
					expect(settings.fontSize).to.equal(fontSizeValue); // Check that the locale in the settings is set to English
				});


			cy // Check that the font size is fontSizeValue
				.get('html')
				.then((html) => {
					const styles = window.getComputedStyle(html.get(0));
					expect(
						parseFloat(html.css('font-size'))
					)
						.to
						.equal(
							convertRemToPixels(
								parseFloat(styles.getPropertyValue(`--chakra-fontSizes-${fontSizeValue}`))
							)
						);
				});
		}

	});

	it('Offline settings default values', () => {
		cy
			.findByLabelText('Save Articles Offline')
			.should('not.be.checked'); // Default value

		cy
			.findAllByLabelText('Language')
			.last()
			.should('be.disabled')
			.should('have.value', 'current'); // Default value

		cy
			.findByLabelText('Save Media')
			.should('be.disabled')
			.should('not.be.checked'); // Default value
	});

	it('Change offline settings (Language - selected, Save media - true)', () => {
		const expectedCaches = [{
			name: 'pages',
			urls: [
				'/en',
				'/en?_rsc',
				'/en/settings',
				'/en/settings?_rsc'
			]
		}, {
			name: 'apis',
			urls: [
				'/api/locales',
				'/api/articles?locale=en&metadataOnly=true',
				'/api/articlesMedia?locale=en'
			]
		}, {
			name: 'articles',
			urls: [
				'/en/', // Introduction
				'/en/?_rsc',
			]
		}, {
			name: 'articles-md',
			urls: [
				'/wiki/en/1.%20Introduction.md' // Introduction markdown file
			]
		}, {
			name: 'articles-media',
			urls: []
		}];

		cy.log('Change Save Articles Offline to true');

		cy
			.findByLabelText('Save Articles Offline')
			.as('saveArticlesOfflineCheckbox')
			.parent()
			.click(); // Change the Save Articles Offline to true

		cy.wait(1500);

		cy
			.get('@saveArticlesOfflineCheckbox')
			.should('be.checked'); // Check that the Save Articles Offline is changed

		cy
			.findAllByLabelText('Language')
			.last()
			.as('cacheLocales')
			.should('have.value', 'current'); // Default value

		cy
			.findByLabelText('Save Media')
			.as('saveMediaCheckbox')
			.scrollIntoView()
			.should('be.checked');

		cy
			.window()
			.its('localStorage')
			.then((localStorage) => {
				const settings = JSON.parse(localStorage.getItem('settings') || '{}');
				expect(settings.isCachingEnabled).to.equal(true); // Check that the caching is enabled
			});

		cy
			.wrap(window.caches)
			.then(async (caches) => {
				for (const expectedCache of expectedCaches) { // Check that the caches are created
					const cache = await caches.open(expectedCache.name);
					const cacheKeys = await cache.keys();

					expect(
						(await caches.keys()).filter(key => key === expectedCache.name)[0]
					).to.equal(expectedCache.name); // Not necessary it's just for diving
					expect(cacheKeys.length).to.equal(expectedCache.urls.length); // Check that the cache has the same number of items as expected

					expectedCache.urls.forEach((url) => { // Check that the cache has the same items as expected
						expect(cacheKeys.some((cacheKey) => cacheKey.url.endsWith(url))).to.equal(true);
					});
				}
			});

		goOffline();

		cy
			.findAllByRole('alert')
			.findAllByText('Offline!')
			.first()
			.should('exist'); // Check that the alert is shown

		cy
			.findByLabelText('Language' + 'Unavailable Offline')
			.should('be.disabled'); // Check that the cache locales is disabled

		cy
			.findByLabelText('Save Media' + 'Unavailable Offline')
			.should('be.disabled'); // Check that the save media is disabled

		cy
			.findAllByText('Introduction')
			.first()
			.click();

		cy
			.url()
			.should('include', '/en')
			.and('not.include', '/en/'); // Check that the URL is /en

		cy
			.get('h1')
			.should('have.text', 'Introduction'); // Check that the title is Introduction

		goOnline();
	});

	it('Change offline settings (Language - all, Save media - true)', () => {
		const expectedCaches = [{
			name: 'pages',
			urls: [
				'/en',
				'/en?_rsc',
				'/en/settings',
				'/en/settings?_rsc',
				'/uk',
				'/uk?_rsc',
				'/uk/settings',
				'/uk/settings?_rsc'
			]
		}, {
			name: 'apis',
			urls: [
				'/api/locales',
				'/api/articles?locale=en&metadataOnly=true',
				'/api/articles?locale=uk&metadataOnly=true',
				'/api/articlesMedia?locale=everyLocale'
			]
		}, {
			name: 'articles',
			urls: [
				'/en/', // Introduction
				'/en/?_rsc',
				'/uk/', // Знайомство
				'/uk/?_rsc',
			]
		}, {
			name: 'articles-md',
			urls: [
				'/wiki/en/1. Introduction.md', // Introduction markdown file
				'/wiki/uk/1. Знайомство.md' // "Знайомство" markdown file
			]
		}, {
			name: 'articles-media',
			urls: []
		}];
		cy.log('Change Save Articles Offline to true');

		cy
			.findByLabelText('Save Articles Offline')
			.as('saveArticlesOfflineCheckbox')
			.parent()
			.click(); // Change the Save Articles Offline to true

		cy.wait(1500);

		cy
			.get('@saveArticlesOfflineCheckbox')
			.should('be.checked'); // Check that the Save Articles Offline is changed

		cy
			.findAllByLabelText('Language')
			.last()
			.as('cacheLocales')
			.select('all') // Change the cache locales to all
			.should('have.value', 'all'); // Default value

		cy.wait(1500);

		cy
			.findByLabelText('Save Media')
			.as('saveMediaCheckbox')
			.scrollIntoView()
			.should('be.checked');

		cy
			.window()
			.its('localStorage')
			.then((localStorage) => {
				const settings = JSON.parse(localStorage.getItem('settings') || '{}');
				expect(settings.isCachingEnabled).to.equal(true); // Check that the caching is enabled
			});

		cy
			.wrap(window.caches)
			.then(async (caches) => {
				for (const expectedCache of expectedCaches) { // Check that the caches are created
					const cache = await caches.open(expectedCache.name);
					const cacheKeys = await cache.keys();

					expect(
						(await caches.keys()).filter(key => key === expectedCache.name)[0]
					).to.equal(expectedCache.name); // Not necessary it's just for diving
					expect(cacheKeys.length).to.equal(expectedCache.urls.length); // Check that the cache has the same number of items as expected

					expectedCache.urls.forEach((url) => { // Check that the cache has the same items as expected
						expect(cacheKeys.some((cacheKey) => cacheKey.url.endsWith(encodeURI(url)))).to.equal(true);
					});
				}
			});

		goOffline();

		cy
			.findAllByRole('alert')
			.findAllByText('Offline!')
			.first()
			.should('exist'); // Check that the alert is shown

		cy
			.findByLabelText('Language' + 'Unavailable Offline')
			.should('be.disabled'); // Check that the cache locales is disabled

		cy
			.findByLabelText('Save Media' + 'Unavailable Offline')
			.should('be.disabled'); // Check that the save media is disabled

		cy
			.findAllByText('Introduction')
			.first()
			.click();

		cy
			.url()
			.should('include', '/en')
			.and('not.include', '/en/'); // Check that the URL is /en

		cy
			.get('h1')
			.should('have.text', 'Introduction'); // Check that the title is Introduction

		cy
			.get('[aria-label="Settings"]')
			.click();

		cy
			.findAllByLabelText('Language')
			.first()
			.select('uk'); // Change the language to Ukrainian

		cy
			.findAllByText('Знайомство')
			.first()
			.click();

		cy
			.url()
			.should('include', '/uk')
			.and('not.include', '/uk/'); // Check that the URL is /uk

		cy
			.get('h1')
			.should('have.text', 'Знайомство'); // Check that the title is Знайомство

		goOnline();
	});

	it('Reset settings', () => {
		const checkDefaultSettings = () => {
			cy
				.findAllByLabelText('Language')
				.first()
				.as('languageSelect')
				.should('have.value', 'en'); // Default value

			cy
				.findByLabelText('Theme')
				.as('themeSelect')
				.should('have.value', 'system'); // Default value

			cy
				.findByLabelText('Font Size')
				.as('fontSizeSelect')
				.should('have.value', 'base'); // Default value

			cy
				.findByLabelText('Save Articles Offline')
				.should('not.be.checked'); // Default value

			cy
				.findAllByLabelText('Language')
				.last()
				.should('be.disabled')
				.should('have.value', 'current'); // Default value

			cy
				.findByLabelText('Save Media')
				.should('be.disabled')
				.should('not.be.checked'); // Default value

			cy
				.window()
				.its('localStorage')
				.then((localStorage) => {
					const settings = JSON.parse(localStorage.getItem('settings') || '{}');
					expect(settings).to.deep.equal({
						locale: 'en',
						colorMode: 'system',
						fontSize: 'base',
						isCachingEnabled: false,
						cacheLocales: 'current',
						isCachingMediaEnabled: false
					}); // Check that the settings are empty
				});
		};

		cy
			.get('button[aria-label="Reset Settings"]')
			.should('be.disabled');

		checkDefaultSettings();

		cy
			.findByLabelText('Theme')
			.select('light'); // Change the theme to light

		cy
			.get('button[aria-label="Reset Settings"]')
			.should('not.be.disabled')
			.click();

		checkDefaultSettings();
	});
});