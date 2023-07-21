import { getLocaleFromPathname, getLocaleFromRequest } from '@/_lib/locales';
import { NextRequest, NextResponse } from 'next/server';

/**
 * List of all supported locales
 */
export const locales: string[] = ['en', 'uk'];
/**
 * Default locale from `locales` array
 * @returns `en` or first locale in `locales` array
 */
export const defaultLocale: string = locales.find(locale => locale === 'en') || locales[0];
/**
 * List of all pages that are part of the app
 * (Pathnames of this page are always without locale prefix)
 */
export const pagesWithoutLocalePrefix = [
	'/offline'
];
/**
 * List of all paths that should not be internationalized
 */
export const excludedPaths = [
	'/api',
	'/wiki',
];

export function middleware(request: NextRequest) {
	const url = new URL(request.url);
	const localeFromPathname = getLocaleFromPathname(url.pathname);
	const preferredLocale = getLocaleFromRequest(request);
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
		!localeFromPathname && // If locale prefix is not present
		!pagesWithoutLocalePrefix.includes(pathnameWithoutLocale) && // If locale prefix should be added to the path
		!new RegExp(`^(${excludedPaths.join('|')})`).test(pathnameWithoutLocale) // If path is not excluded
	) {
		response = redirect(`/${locale}${url.pathname}`);
	}

	// If page is one of the app pages
	if (
		pagesWithoutLocalePrefix.includes(pathnameWithoutLocale)
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

export const config = {
	// Skip all paths that should not be internationalized
	matcher: ['/((?!api|_next|.*\\..*).*)']
};