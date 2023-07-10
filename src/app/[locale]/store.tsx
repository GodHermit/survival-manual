'use client';

import articlesSlice, { initialArticlesState } from '@/_helpers/articlesSlice';
import settingsSlice, { initialSettings } from '@/_helpers/settingsSlice';
import sideNavSlice, { initialSideNavState } from '@/components/SideNav/sideNavSlice';
import { configureStore } from '@reduxjs/toolkit';
import { getCookie, setCookie } from 'cookies-next';

export const preloadedState = {
	sideNav: initialSideNavState,
	settings: initialSettings,
	articles: initialArticlesState
}

const preloadedSettings = JSON.parse( // Load settings from localStorage
	typeof window !== 'undefined'
	&& localStorage.getItem('settings') || '{}'
);

const store = configureStore({
	reducer: {
		sideNav: sideNavSlice,
		settings: settingsSlice,
		articles: articlesSlice
	},
	preloadedState: {
		settings: {
			...initialSettings, // Load default settings
			...preloadedSettings, // Load settings from localStorage
			locale: getCookie('NEXT_LOCALE') || preloadedSettings.locale || initialSettings.locale, // Load locale from cookie
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