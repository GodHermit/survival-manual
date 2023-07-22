import { isLocaleSupported } from '@/_lib/locales';
import { Locale } from '@/_lib/messages';
import store from '@/_store';
import { ArticleMetadata } from '@/_store/slices/articlesSlice';
import { SettingsState } from '@/_store/slices/settingsSlice';
import { locales, pagesWithoutLocalePrefix } from '@/middleware';

export const PAGES_CACHE = 'pages';
export const MANIFEST_CACHE = 'manifest';
export const APIS_CACHE = 'apis';
export const ARTICLES_CACHE = 'articles';
export const ARTICLES_MEDIA_CACHE = 'articles-media';
export const ARTICLES_MARKDOWN_CACHE = 'articles-md';

const APP_PAGES = [
	'/settings',
];

/**
 * Sets cache for articles, pages and APIs based on current settings
 * @param {string} [currentLocale=en] - Current locale selected by user (default: 'en')
 */
export function setArticlesCache(currentLocale: string = 'en') {
	// If browser doesn't support caches
	if (!('caches' in window)) {
		throw new Error('CACHES_NOT_SUPPORTED');
	}

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
			if (!isLocaleSupported(currentLocale)) {
				throw new Error('LOCALE_IS_NOT_SUPPORTED');
			}
			setCacheForCurrentLocale(currentLocale, settings)
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
			setCacheForAllLocales(settings)
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
	// If browser doesn't support caches
	if (!('caches' in window)) {
		throw new Error('CACHES_NOT_SUPPORTED');
	}

	caches.delete(PAGES_CACHE);
	caches.delete(APIS_CACHE);
	caches.delete(ARTICLES_CACHE);
	caches.delete(ARTICLES_MEDIA_CACHE);
	caches.delete(ARTICLES_MARKDOWN_CACHE);
}

/**
 * Set cache for articles for current locale
 * @param {string} locale current locale selected by user (default: 'en')
 */
async function setCacheForCurrentLocale(locale: string = 'en', settings: SettingsState) {
	await setPagesCache(locale); // Cache pages for current locale
	await setAPIsCache(locale); // Cache APIs for current locale

	await setArticlesCacheForLocale(locale); // Cache articles for current locale
	await setArticlesMDCache(locale); // Cache articles markdown files for current locale

	// If caching media is enabled
	if (settings.isCachingMediaEnabled) {
		await setArticlesMediaCache(locale); // Cache articles media files for current locale
	}
}

/**
 * Set cache for articles for all locales
 */
async function setCacheForAllLocales(settings: SettingsState) {
	const apiCache = await caches.open(APIS_CACHE);

	apiCache.add('/api/locales'); // Cache all locales
	apiCache.add('/api/articlesMedia?locale=everyLocale'); // Cache api of articles' media files for all locales

	locales
		.forEach(async locale => {
			await setPagesCache(locale);

			apiCache.add(`/api/articles?locale=${locale}&metadataOnly=true`); // Cache articles metadata for current locale

			setArticlesCacheForLocale(locale);
			setArticlesMDCache(locale); // Cache articles markdown files
		});

	// If caching media is enabled
	if (settings.isCachingMediaEnabled) {
		await setArticlesMediaCache();
	}
}

/**
 * Return normalized path for current locale
 * @param {string} path path to normalize
 * @param {string} [locale=en] current locale selected by user
 * @returns If current locale is default, returns path as is, otherwise returns path with current locale prefix
 */
function normalizePath(path: string, locale: string = 'en') {
	return pagesWithoutLocalePrefix.includes(path) ? path : `/${locale}${path}`;
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
 * Add offline page to cache for current locale
 */
export async function setOfflinePageCache() {
	// If browser doesn't support caches
	if (!('caches' in window)) {
		return;
	}

	// If network is offline, don't try to cache offline page
	if (!window.navigator.onLine) {
		return;
	}

	// Get cache with name 'workbox-precache'
	const cacheNames = (await caches.keys())
		.filter(name => name.startsWith('workbox-precache'));

	// If there is no cache with name 'workbox-precache'
	if (cacheNames.length <= 0) {
		return;
	}

	const cache = await caches.open(cacheNames[0]);

	// Fetch offline page
	const offlinePageRes = await fetch(
		'/offline',
		{
			redirect: 'follow'
		}
	);

	// Fetch offline page RSC
	const offlinePageRscRes = await fetch(
		'/offline?_rsc',
		{
			headers: {
				'Rsc': '1',
			},
			redirect: 'follow'
		}
	);

	// If offline page or offline page RSC are not ok
	if (!offlinePageRes.ok && !offlinePageRscRes.ok) {
		return;
	}

	// Put offline page and offline page RSC to cache
	cache.put('/offline', offlinePageRes);
	cache.put('/offline?_rsc', offlinePageRscRes);
}

/**
 * Add manifest to cache for current locale or for all locales
 */
export async function setManifestCache(locale: string, settings: SettingsState) {
	// If browser doesn't support caches
	if (!('caches' in window)) {
		return;
	}

	// If network is offline, don't try to cache offline page
	if (!window.navigator.onLine) {
		return;
	}

	const manifestCache = await caches.open(MANIFEST_CACHE);

	// If cacheLocales is 'all' or 'everyLocale'
	if (locale === 'everyLocale' || settings.cacheLocales === 'all') {
		locales.forEach(locale => { // Cache manifest for all locales
			manifestCache.add(`/manifest.json?locale=${locale}`);
		});
		return;
	}

	// Otherwise cache manifest for current locale
	const manifests = await manifestCache.keys();
	manifestCache.add(`/manifest.json?locale=${locale}`)
		.then(() => {
			// Delete all manifests for other locales
			manifests.forEach(manifest => {
				// If manifest is not for current locale
				if (!manifest.url.endsWith(`/manifest.json?locale=${locale}`)) {
					manifestCache.delete(manifest); // Delete manifest from cache
				}
			});
		});
}

/**
 * Set cache for APIs related to articles
 * @param {string} locale locale of APIs to cache (default: 'en')
 */
async function setAPIsCache(locale: string = 'en') {
	const apiCache = await caches.open(APIS_CACHE);

	apiCache.add(`/api/articles?locale=${locale}&metadataOnly=true`); // Cache articles metadata for current locale
	apiCache.add(`/api/articlesMedia?locale=${locale}`); // Cache api of articles' media files

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
	// If browser doesn't support caches
	if (!('caches' in window)) {
		throw new Error('CACHES_NOT_SUPPORTED');
	}

	if (locale && !isLocaleSupported(locale)) {
		throw new Error('LOCALE_IS_NOT_SUPPORTED');
	}

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

/**
 * Add articles markdown files to cache
 * @param {string} locale locale of articles files to cache (default: 'en') 
 */
async function setArticlesMDCache(locale: string = 'en') {
	const articleMetadata: ArticleMetadata[] = await (await fetch(`/api/articles?locale=${locale}&metadataOnly=true`)).json();

	const articlesMDCache = await caches.open(ARTICLES_MARKDOWN_CACHE);
	const cacheToDelete = await articlesMDCache.keys();

	// Array of paths to articles markdown files
	const paths = articleMetadata.map(article => (`/wiki/${locale}/${article.filename}`));

	// Cache articles markdown files
	articlesMDCache.addAll(paths);

	if (cacheToDelete.length > 0) { // If there are old articles cache
		cacheToDelete.forEach(cache => { // Delete old articles cache
			if (!articleMetadata.some(article => `/wiki/${locale}/${article.filename}.md` === getRelativeURL(cache.url))) {
				// If cache is not in new articles cache
				articlesMDCache.delete(cache);
			}
		});
	}
}