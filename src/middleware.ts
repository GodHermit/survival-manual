import { NextRequest, NextResponse } from 'next/server';
import { getAcceptLanguageLocale } from './_helpers/getAcceptLanguageLocale';

/**
 * List of all supported locales
 */
export const locales = ['en', 'uk'];
/**
 * Default locale
 */
export const defaultLocale = 'en';
/**
 * List of all pages that are part of the app
 * (Pathnames of this page are always without locale prefix)
 */
export const appPages = ['/offline', '/settings'];

/**
 * Returns locale from cookie or Accept-Language header or default locale
 * @param request NextRequest object
 * @returns Supported locale
 */
function getLocale(request: NextRequest) {
	let localeInCookie = request.cookies.get('NEXT_LOCALE')?.value;

	let acceptLanguage = getAcceptLanguageLocale(request.headers, locales, defaultLocale);

	let locale = localeInCookie || acceptLanguage || defaultLocale;

	return locale;
}

/**
 * Returns locale from pathname
 * @param pathname String to parse
 * @returns Supported locale or undefined
 */
export function getLocaleFromPathname(pathname: string) {
	const locale = pathname.split('/')[1];

	if (locales.includes(locale)) {
		return locale;
	}

	return undefined;
}

export function middleware(request: NextRequest) {
	const url = new URL(request.url);
	const localeFromPathname = getLocaleFromPathname(url.pathname);
	const preferredLocale = getLocale(request);
	const locale = localeFromPathname || preferredLocale;
	const pathnameWithoutLocale = url.pathname.replace(`/${locale}`, '');

	/**
	 * Redirects to the same path without locale prefix
	 */
	function redirect(url: string, ignoreLocalePrefix?: boolean) {
		const urlObj = new URL(url, request.url);

		if (ignoreLocalePrefix) {
			urlObj.pathname = urlObj.pathname.replace(`/${locale}`, '');
		}

		return NextResponse.redirect(urlObj);
	}

	/**
	 * Rewrites the URL
	 */
	function rewrite(url: string) {
		return NextResponse.rewrite(new URL(url, request.url));
	}

	let response = NextResponse.next();

	// Add locale prefix to the path if it's not there
	if (
		!localeFromPathname
		&& !appPages.includes(pathnameWithoutLocale)
	) {
		response = redirect(`/${locale}${url.pathname}`);
	}

	// If page is one of the app pages
	if (
		appPages.includes(pathnameWithoutLocale)
	) {
		// If locale prefix is present, remove it
		if (localeFromPathname) {
			response = redirect(url.pathname, true);
		} else {
			// Show result page in the preferred locale
			response = rewrite(`/${locale}${url.pathname}`);
		}
	}

	// If cookie is not set
	if (!request.cookies.get('NEXT_LOCALE')) {
		response.cookies.set(
			'NEXT_LOCALE',
			locale,
			{
				path: '/',
				sameSite: 'strict'
			}
		);
	}

	// If cookie is set but doesn't match the locale
	if (
		request.cookies.get('NEXT_LOCALE')
		&& request.cookies.get('NEXT_LOCALE')?.value !== locale
	) {
		response.cookies.set(
			'NEXT_LOCALE',
			locale,
			{
				path: '/',
				sameSite: 'strict'
			}
		);
	}

	return response;
}

// // export default createMiddleware({
// // 	// A list of all locales that are supported
// // 	locales: ['en', 'uk'],

// // 	defaultLocale: 'en',

// // 	// Include a prefix for the default locale as well
// // 	localePrefix: 'always'
// // });

export const config = {
	// Skip all paths that should not be internationalized
	matcher: ['/((?!api|_next|wiki|.*\\..*).*)']
};