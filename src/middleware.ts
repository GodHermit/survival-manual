import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
	// A list of all locales that are supported
	locales: ['en', 'uk'],

	defaultLocale: 'en',

	// Include a prefix for the default locale as well
	localePrefix: 'always'
});

export const config = {
	// Skip all paths that should not be internationalized
	matcher: ['/((?!api|_next|wiki|.*\\..*).*)']
};