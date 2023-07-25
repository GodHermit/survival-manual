import { groupBy } from '@/_helpers/groupBy';
import store from '@/_store';
import { setArticlesState } from '@/_store/slices/articlesSlice';
import { setSideNav } from '@/_store/slices/sideNavSlice';
import { theme } from '@chakra-ui/react';
import SideNavMobile from './SideNavMobile';

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

describe('<SideNavMobile />', () => {
	context('Breakpoint: base', () => {
		beforeEach(() => {
			cy.viewport(convertEmToPixels(parseFloat(theme.breakpoints.sm)), 500);
			cy.mountWithProviders(<SideNavMobile />);

			store.dispatch(setSideNav({
				isOpen: true
			}))
			cy.wait(500); // Wait for drawer to open
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
		});

		it('Should show list of articles and app name', () => {
			store.dispatch(setArticlesState({
				articlesMetadata,
				isLoading: false
			}));

			cy
				.findByRole('dialog')
				.find('header')
				.should('be.visible')
				.and('have.text', 'title'); // Name of message from intl

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

})