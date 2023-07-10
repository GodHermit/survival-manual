'use client';

import articlesSlice, { initialArticlesState } from '@/_helpers/articlesSlice';
import settingsSlice, { initialSettings } from '@/_helpers/settingsSlice';
import sideNavSlice, { initialSideNavState } from '@/components/SideNav/sideNavSlice';
import { configureStore } from '@reduxjs/toolkit';
import { getCookie, setCookie } from 'cookies-next';

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

		// If settings is not in localStorage
		if (!localStorage.getItem('settings')) {
			localStorage.setItem('settings', JSON.stringify(initialSettings)); // Set initial settings to localStorage
		}

		let preloadedSettings = JSON.parse(localStorage.getItem('settings') || '{}'); // Get settings from localStorage
		const localeFromCookie = getCookie('NEXT_LOCALE'); // Get locale from cookie

		// If locale in localStorage is different from locale in cookie
		if (preloadedSettings.locale !== localeFromCookie) {
			preloadedSettings.locale = localeFromCookie; // Set locale from cookie to settings
			localStorage.setItem('settings', JSON.stringify(preloadedSettings)); // Save settings to localStorage
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
	}
});

/**
 * Save settings to localStorage
 */
store.subscribe(() => {
	const state = store.getState();
	localStorage.setItem('settings', JSON.stringify(state.settings));
});

/**
 * Synchronize NEXT_LOCALE cookie and settings.locale
 */
store.subscribe(() => {
	const state = store.getState(); // Get current state
	const localeInCookie = getCookie('NEXT_LOCALE'); // Get locale from cookie

	if (localeInCookie !== state.settings.locale) {
		// If locale in cookie is different from locale in settings, update cookie
		setCookie( // Set cookie with locale from settings
			'NEXT_LOCALE',
			state.settings.locale,
			{
				path: '/',
				sameSite: 'strict',
			}
		);
	}
});

export default store;