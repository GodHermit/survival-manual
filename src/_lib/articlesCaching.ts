import { SettingsState } from '@/_helpers/settingsSlice';
import store from '@/app/[locale]/store';
import { Locale } from '@/_lib/messages';
import { ArticleMetadata } from '@/_helpers/articlesSlice';

export const PAGES_CACHE = 'pages';
export const APIS_CACHE = 'apis';
export const ARTICLES_CACHE = 'articles';
export const ARTICLES_MEDIA_CACHE = 'articles-media';

const APP_PAGES = [
	'/settings',
	'/offline',
];

/**
 * Sets cache for articles, pages and APIs based on current settings
 * @param {string} [currentLocale=en] - Current locale selected by user (default: 'en')
 */
export function setArticlesCache(currentLocale: string = 'en') {
	const settings = store.getState().settings as SettingsState;

	if (!settings.isCachingEnabled) {// If caching is disabled
		throw new Error('ARTICLES_CACHE_DISABLED');
	}

	// Delete pages and APIs caches to avoid caching old pages and APIs
	caches.delete(PAGES_CACHE);
	caches.delete(APIS_CACHE);

	// deleteArticlesCache(); // Delete all caches before setting new ones

	store.dispatch({ // Set isCachingChanging to true
		type: 'settings/setSettings',
		payload: {
			isCacheChanging: true,
		}
	});

	switch (settings.cacheLocales) {
		case 'current':
			setCacheForCurrentLocale(currentLocale)
				.then(() => {
					store.dispatch({ // Set isCacheChanging to false
						type: 'settings/setSettings',
						payload: {
							isCacheChanging: false,
							cacheLastSyncTimestamp: new Date().getTime(),
						}
					});
				});
			break;
		case 'all':
			setCacheForAllLocales()
				.then(() => {
					store.dispatch({ // Set isCacheChanging to false
						type: 'settings/setSettings',
						payload: {
							isCacheChanging: false,
							cacheLastSyncTimestamp: new Date().getTime(),
						}
					});
				});
			break;
		default:
			throw new Error('Invalid cacheLanguages value');
	}
}

/**
 * Delete all caches related to articles
 */
export function deleteArticlesCache() {
	caches.delete(PAGES_CACHE);
	caches.delete(APIS_CACHE);
	caches.delete(ARTICLES_CACHE);
	caches.delete(ARTICLES_MEDIA_CACHE);
}

/**
 * Set cache for articles for current locale
 * @param {string} locale current locale selected by user (default: 'en')
 */
async function setCacheForCurrentLocale(locale: string = 'en') {
	await setPagesCache(locale);
	await setAPIsCache(locale);

	await setArticlesCacheForLocale(locale);
	await setArticlesMediaCache(locale);
}

/**
 * Set cache for articles for all locales
 */
async function setCacheForAllLocales() {
	const apiCache = await caches.open(APIS_CACHE);
	const locales = await (await fetch('/api/locales')).json() as Locale[];

	apiCache.add('/api/locales'); // Cache all locales

	locales
		.map(locale => locale.code) // Get locales codes
		.forEach(async locale => {
			await setPagesCache(locale);

			apiCache.add(`/api/articles?locale=${locale}&metadataOnly=true`); // Cache articles metadata for current locale

			setArticlesCacheForLocale(locale);
		});

	await setArticlesMediaCache();
}

/**
 * Return normalized path for current locale
 * @param {string} path path to normalize
 * @param {string} [locale=en] current locale selected by user
 * @returns If current locale is default, returns path as is, otherwise returns path with current locale prefix
 */
function normalizePath(path: string, locale: string = 'en') {
	return `/${locale}${path}`;
}

/**
 * Return URL without origin
 */
function getRelativeURL(url: string) {
	if (!url.startsWith(location.origin)) {
		throw new Error('URL must start with origin');
	}

	return url.replace(location.origin, '');
}

/**
 * Set cache for app pages
 * @param {string} locale locale of pages to cache (default: 'en')
 */
async function setPagesCache(locale: string = 'en') {
	const pagesCache = await caches.open(PAGES_CACHE);

	const normalizedAppPages = [
		`/${locale}`,
		...APP_PAGES.map(page => normalizePath(page, locale))
	];

	pagesCache.addAll(normalizedAppPages); // Cache app pages
	normalizedAppPages.forEach(async page => { // Cache pages RSC
		const response = await fetch(page, {
			headers: {
				'Rsc': '1',
			}
		});
		pagesCache.put(`${page}?_rsc`, response);
	});
}

/**
 * Set cache for APIs related to articles
 * @param {string} locale locale of APIs to cache (default: 'en')
 */
async function setAPIsCache(locale: string = 'en') {
	const apiCache = await caches.open(APIS_CACHE);

	apiCache.add(`/api/articles?locale=${locale}&metadataOnly=true`); // Cache articles metadata for current locale

	const locales = await (await fetch('/api/locales')).json();
	const currentLocaleData = locales.find((l: Locale) => l.code === locale);
	apiCache.put( // Cache current locale data
		'/api/locales',
		new Response(
			JSON.stringify([currentLocaleData]),
			{
				headers: {
					'Content-Type': 'application/json',
				}
			}
		)
	);
}

/**
 * Set articles cache for specified locale
 * @param {string} [locale=en] locale of articles to cache (default: 'en')
 */
async function setArticlesCacheForLocale(locale: string = 'en') {
	const articlesMetadata: ArticleMetadata[] = await (await fetch(`/api/articles?locale=${locale}&metadataOnly=true`)).json();

	const articlesCache = await caches.open(ARTICLES_CACHE);
	const cacheToDelete = await articlesCache.keys();

	const articlesNormalizedPaths = articlesMetadata.map(article => normalizePath(article.slug, locale));

	articlesCache.addAll( // Cache articles
		articlesNormalizedPaths
	);

	articlesNormalizedPaths.forEach(async path => { // Cache articles RSC
		const response = await fetch(path, {
			headers: {
				'Rsc': '1',
			}
		});
		articlesCache.put(`${path}?_rsc`, response);
	});

	if (cacheToDelete.length > 0) { // If there are old articles cache
		cacheToDelete.forEach(cache => { // Delete old articles cache
			if (!articlesMetadata.some(article => normalizePath(article.slug, locale) === getRelativeURL(cache.url))) {
				// If cache is not in new articles cache
				articlesCache.delete(cache);
			}
		});
	}
}

/**
 * Add articles media files to cache
 * @param {string} [locale] locale of translated media files (if not specified, only general media files will be cached)
 */
export async function setArticlesMediaCache(locale?: string) {
	const settings = await store.getState().settings;
	if (!settings.isCachingMediaEnabled) {
		throw new Error('ARTICLES_MEDIA_CACHE_DISABLED');
	}

	if (settings.cacheLocales === 'all') {
		locale = 'everyLocale';
	}

	const articlesMedia: string[] = await (
		await fetch(`/api/articlesMedia${locale ? `?locale=${locale}` : ''}`)
	).json(); // Array of paths to media files

	if (articlesMedia.length <= 0) {
		// Ignore if there are no media files
		return;
	}

	const articlesMediaCache = await caches.open(ARTICLES_MEDIA_CACHE);
	const cacheToDelete = await articlesMediaCache.keys();

	articlesMediaCache.addAll( // Cache articles media
		articlesMedia
	);

	if (cacheToDelete.length > 0) { // If there are old articles media cache
		cacheToDelete.forEach(cache => { // Delete old articles media cache
			if (!articlesMedia.some(media => media === getRelativeURL(cache.url))) {
				// If cache is not in new articles media cache
				articlesMediaCache.delete(cache); // Delete cache
			}
		});
	}

}