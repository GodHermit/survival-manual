'use client';

import { setManifestCache, setOfflinePageCache } from '@/_lib/articlesCaching';
import { settingsMiddleware } from '@/_store/middlewares/settingsMiddleware';
import articlesSlice, { initialArticlesState } from '@/_store/slices/articlesSlice';
import settingsSlice, { drySettings, initialSettings } from '@/_store/slices/settingsSlice';
import sideNavSlice, { initialSideNavState } from '@/_store/slices/sideNavSlice';
import { configureStore } from '@reduxjs/toolkit';
import { getCookie } from 'cookies-next';

/**
 * Server-side preloaded state
 */
export const preloadedState = {
	sideNav: initialSideNavState,
	settings: initialSettings,
	articles: initialArticlesState
}

/**
 * Get preloaded settings from localStorage
 * @returns preloaded settings from localStorage
 */
const preloadedSettings = (() => {
	// If window is defined
	if (typeof window !== 'undefined') {
		let isFirstVisit = false; // Is first visit flag

		// If settings is not in localStorage
		if (!localStorage.getItem('settings')) {
			localStorage.setItem('settings', JSON.stringify(drySettings(initialSettings))); // Set initial settings to localStorage
			isFirstVisit = true; // Set is first visit flag
		}

		let preloadedSettings = JSON.parse(localStorage.getItem('settings') || '{}'); // Get settings from localStorage
		const localeFromCookie = getCookie('NEXT_LOCALE') as string; // Get locale from cookie

		// If locale in localStorage is different from locale in cookie
		if (preloadedSettings.locale !== localeFromCookie) {
			preloadedSettings.locale = localeFromCookie; // Set locale from cookie to settings
			localStorage.setItem('settings', JSON.stringify(drySettings(preloadedSettings))); // Save settings to localStorage

			setManifestCache(localeFromCookie, preloadedSettings); // Add manifest(s) to cache

			// If it is not first visit (settings is already in localStorage)
			if (!isFirstVisit) {
				setOfflinePageCache(); // Add offline page to cache
			}
		}

		return preloadedSettings; // Return settings from localStorage
	}

	// If window is not defined, return empty object
	return {};
})();

/**
 * Create store with preloaded state
 */
const store = configureStore({
	reducer: {
		sideNav: sideNavSlice,
		settings: settingsSlice,
		articles: articlesSlice
	},
	preloadedState: {
		settings: {
			...initialSettings, // Load default settings
			...preloadedSettings // Load settings from localStorage
		}
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().prepend(settingsMiddleware.middleware)
});

export default store;