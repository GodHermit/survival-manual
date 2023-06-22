import articlesSlice from '@/_helpers/articlesSlice';
import settingsSlice, { initialSettings } from '@/_helpers/settingsSlice';
import sideNavSlice from '@/components/SideNav/sideNavSlice';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
	reducer: {
		sideNav: sideNavSlice,
		settings: settingsSlice,
		articles: articlesSlice
	},
	preloadedState: {
		settings: {
			...initialSettings,
			...JSON.parse(localStorage.getItem('settings') || '{}')
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