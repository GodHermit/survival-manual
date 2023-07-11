import { getAcceptLanguageLocale } from '@/_helpers/getAcceptLanguageLocale';
import { defaultLocale, locales } from '@/middleware';
import { NextRequest } from 'next/server';

/**
 * Check if locale is supported
 * @param locale Locale to check
 * @returns True if locale is supported, false otherwise
 */
export function isLocaleSupported(locale: string) {
	return locales.includes(locale);
}

/**
 * Returns locale from cookie or Accept-Language header or default locale
 * @param request NextRequest object
 * @returns Supported locale
 */
export function getLocaleFromRequest(request: NextRequest) {
	let localeInCookie = request.cookies.get('NEXT_LOCALE')?.value;

	// If value in cookie is not supported
	if (localeInCookie && !isLocaleSupported(localeInCookie)) {
		localeInCookie = undefined; // Set to undefined
	}

	let acceptLanguage = getAcceptLanguageLocale(request.headers);

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

	return isLocaleSupported(locale) ? locale : undefined;
}