import getURL from '@/_helpers/getURL';
import { excludedPaths, locales, pagesWithoutLocalePrefix } from '@/middleware';
import { Metadata } from 'next';
import { createTranslator } from 'next-intl';
import { notFound } from 'next/navigation';
import { isLocaleSupported } from './locales';

/**
 * Generates a path with locale prefix if needed.
 * @param path
 * @param locale 
 * @returns path with locale prefix if needed
 */
export function normalizePath(path: string, locale: string): string {
	if (!isLocaleSupported(locale)) {
		throw new Error('LOCALE_IS_NOT_SUPPORTED');
	}

	if (
		pagesWithoutLocalePrefix.includes(path) || // If path should not have locale prefix
		new RegExp(`^(${excludedPaths.join('|')})`).test(path) || // If path is excluded from internationalization
		path.split('/')[1] === locale // If path already has locale prefix
	) {
		return path;
	}

	return `/${locale}${path}`;
}

/**
 * Generates metadata for a given namespace and locale.
 * @param namespace 
 * @param locale
 * @returns
 */
export async function generateMetadataFor(namespace: string, locale: string): Promise<Metadata> {
	if (!isLocaleSupported(locale)) {
		notFound();
	}

	const messages = (await import(`@/_messages/${locale}.json`)).default;
	const t = createTranslator({ locale, messages });

	return {
		title: t(`${namespace}.metadata.title`),
		description: t(`${namespace}.metadata.description`),
	};
}

/**
 * Generates alternate links for a given pathname and locale.
 * @param pathname 
 * @param locale 
 * @returns 
 */
export function generateAlternatesFor(pathname: string, locale: string): Metadata {
	if (!isLocaleSupported(locale)) {
		notFound();
	}

	return {
		alternates: {
			canonical: normalizePath(pathname, locale),
			languages: Object.assign(
				{},
				...locales
					.filter((l) => l !== locale)
					.map((locale) => ({
						[locale]: normalizePath(pathname, locale),
					}))
			),
		},
	};
}

/**
 * Generates Open Graph metadata for a given namespace and locale.
 * @param namespace 
 * @param locale 
 * @returns 
 */
export async function generateOGFor(namespace: string, locale: string, pathname?: string): Promise<Metadata> {
	if (!isLocaleSupported(locale)) {
		notFound();
	}

	const messages = (await import(`@/_messages/${locale}.json`)).default;
	const t = createTranslator({ locale, messages });

	return {
		openGraph: {
			title: t(`${namespace}.metadata.title`),
			description: t(`${namespace}.metadata.description`),
			url: pathname ? getURL(pathname) : undefined,
			siteName: t('title'),
			locale,
		}
	};
}