import { groupBy } from '@/_helpers/groupBy';
import store from '@/_store';
import { setArticlesState } from '@/_store/slices/articlesSlice';
import { theme } from '@chakra-ui/react';
import SideNav from './index';

function convertEmToPixels(em: number) {
	return em * parseFloat(getComputedStyle(document.documentElement).fontSize);
}

function normalizeSlug(slug: string, locale: string = 'en') {
	return slug === '/' ? `/${locale}` : `/${locale}${slug}`;
}

const articlesMetadata = [{
	name: 'With icon',
	icon: 'MdInfo',
	slug: '/'
}, {
	name: 'Without icon',
	icon: '',
	slug: '/without-icon',
}, {
	name: 'In group (with icon)',
	icon: 'MdCategory',
	slug: '/group',
	groupName: 'Group 1'
}, {
	name: 'In group (without icon)',
	icon: '',
	slug: '/',
	groupName: 'Group 1'
}];

describe('<SideNav />', () => {

	context('Breakpoint: md', () => {
		beforeEach(() => {
			store.dispatch(setArticlesState({ // Restore default state
				isLoading: true
			}));

			cy.viewport(convertEmToPixels(parseFloat(theme.breakpoints.md)), 500);
			cy.mountWithProviders(<SideNav />, { reduxStore: store, locale: 'en' });
		});

		it('Should show loading animation', () => {
			expect(store.getState().articles.isLoading).to.be.true;

			cy
				.get('.chakra-spinner')
				.should('contain', 'Loading')
		});

		it('Should show error message', () => {
			store.dispatch(setArticlesState({
				articlesMetadata: [],
				isLoading: false,
			}));

			cy
				.findByText('loadingError') // Text of message in i18n file
				.should('be.visible'); // Error message

			cy
				.get('button')
				.findByText('tryAgain') // Text of message in i18n file
				.should('be.visible'); // Button to try again
		});

		it('Should show list of articles\' icons', () => {
			store.dispatch(setArticlesState({
				articlesMetadata,
				isLoading: false
			}));

			const expectedList = groupBy(articlesMetadata, article => article.groupName);

			expectedList.forEach((articles, groupName) => {
				if (groupName) { // If groupName is not null
					cy
						.findByText(groupName)
						.should('not.exist'); // Group name
				}

				articles.forEach(article => { // Add articles as menu items
					cy.log('**Assert icon**');
					cy
						.get(`[aria-label="${article.name}"]`)
						.should('be.visible') // Check if icon is visible
						.and(
							'have.text',
							// Check if icon is empty or not 
							article.icon.length > 0 ? '' : article.name[0] // If icon is empty, use first letter of article name
						)
						.and(
							'have.attr',
							'href',
							normalizeSlug(article.slug)
						);

					cy.log('**Assert tooltip**');
					cy
						.get(`[aria-label="${article.name}"]`)
						.focus();

					cy.wait(300); // Wait for tooltip to appear

					cy
						.findByText(article.name)
						.scrollIntoView()
						.should('be.visible'); // Tooltip
				});
			});
		});
	});

	context('Breakpoint: lg', () => {
		beforeEach(() => {
			store.dispatch(setArticlesState({ // Restore default state
				isLoading: true
			}));

			cy.viewport(convertEmToPixels(parseFloat(theme.breakpoints.lg)), 500);
			cy.mountWithProviders(<SideNav />, { reduxStore: store, locale: 'en' });
		});

		it('Should show loading animation', () => {
			expect(store.getState().articles.isLoading).to.be.true;

			cy
				.get('.chakra-spinner')
				.should('contain', 'Loading')
		});

		it('Should show error message', () => {
			store.dispatch(setArticlesState({
				articlesMetadata: [],
				isLoading: false,
			}));

			cy
				.findByText('loadingError') // Text of message in i18n file
				.should('be.visible'); // Error message

			cy
				.get('button')
				.findByText('tryAgain') // Text of message in i18n file
				.should('be.visible'); // Button to try again
		});

		it('Should show list of articles', () => {
			store.dispatch(setArticlesState({
				articlesMetadata,
				isLoading: false
			}));

			const expectedList = groupBy(articlesMetadata, article => article.groupName);

			expectedList.forEach((articles, groupName) => {
				if (groupName) { // If groupName is not null
					cy
						.findByText(groupName)
						.should('be.visible'); // Group name
				}

				articles.forEach(article => { // Add articles as menu items
					cy
						.findByText(article.name)
						.should('be.visible')
						.and(
							'have.attr',
							'href',
							normalizeSlug(article.slug)
						); // Article name
				});
			});
		});
	});

	context('Breakpoint change: md -> lg', () => {
		beforeEach(() => {
			store.dispatch(setArticlesState({ // Restore default state
				isLoading: true
			}));

			cy.viewport(convertEmToPixels(parseFloat(theme.breakpoints.md)), 500);
			cy.mountWithProviders(<SideNav />, { reduxStore: store, locale: 'en' });
		});

		it('Should show articles\' names', () => {
			store.dispatch(setArticlesState({
				articlesMetadata,
				isLoading: false
			}));

			const expectedList = groupBy(articlesMetadata, article => article.groupName);

			expectedList.forEach((articles, groupName) => {
				if (groupName) { // If groupName is not null
					cy
						.findByText(groupName)
						.should('not.exist'); // Group name
				}

				articles.forEach(article => { // Add articles as menu items
					cy
						.get(`[aria-label="${article.name}"]`)
						.should('be.visible')
						.and('not.have.text', article.name);
				});
			});

			cy.viewport(convertEmToPixels(parseFloat(theme.breakpoints.lg)), 500);

			expectedList.forEach((articles, groupName) => {
				if (groupName) { // If groupName is not null
					cy
						.findByText(groupName)
						.should('be.visible'); // Group name
				}

				articles.forEach(article => { // Add articles as menu items
					cy
						.findByText(article.name)
						.should('be.visible');
				});
			});
		});
	});

	context('Breakpoint change: lg -> md', () => {
		beforeEach(() => {
			store.dispatch(setArticlesState({ // Restore default state
				isLoading: true
			}));

			cy.viewport(convertEmToPixels(parseFloat(theme.breakpoints.lg)), 500);
			cy.mountWithProviders(<SideNav />, { reduxStore: store, locale: 'en' });
		});

		it('Should show articles\' names', () => {
			store.dispatch(setArticlesState({
				articlesMetadata,
				isLoading: false
			}));

			const expectedList = groupBy(articlesMetadata, article => article.groupName);

			expectedList.forEach((articles, groupName) => {
				if (groupName) { // If groupName is not null
					cy
						.findByText(groupName)
						.should('be.visible'); // Group name
				}

				articles.forEach(article => { // Add articles as menu items
					cy
						.findByText(article.name)
						.should('be.visible');
				});
			});

			cy.viewport(convertEmToPixels(parseFloat(theme.breakpoints.md)), 500);

			expectedList.forEach((articles, groupName) => {
				if (groupName) { // If groupName is not null
					cy
						.findByText(groupName)
						.should('not.exist'); // Group name
				}

				articles.forEach(article => { // Add articles as menu items
					cy
						.get(`[aria-label="${article.name}"]`)
						.should('be.visible')
						.and('not.have.text', article.name);
				});
			});
		});
	});
})