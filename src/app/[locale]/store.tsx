'use client';

import articlesSlice, { initialArticlesState } from '@/_helpers/articlesSlice';
import settingsSlice, { initialSettings } from '@/_helpers/settingsSlice';
import sideNavSlice, { initialSideNavState } from '@/components/SideNav/sideNavSlice';
import { configureStore } from '@reduxjs/toolkit';

export const preloadedState = {
	sideNav: initialSideNavState,
	settings: initialSettings,
	articles: initialArticlesState
}

const store = configureStore({
	reducer: {
		sideNav: sideNavSlice,
		settings: settingsSlice,
		articles: articlesSlice
	},
	preloadedState: {
		settings: {
			...initialSettings,
			...JSON.parse(typeof window !== 'undefined' && localStorage.getItem('settings') || '{}')
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

export default store;