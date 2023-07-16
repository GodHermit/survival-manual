import { setManifestCache, setOfflinePageCache } from '@/_lib/articlesCaching';
import store from '@/_store';
import { drySettings, settingsSlice } from '@/_store/slices/settingsSlice';
import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit';
import { setCookie } from 'cookies-next';

export const settingsMiddleware = createListenerMiddleware();

settingsMiddleware.startListening({
	matcher: isAnyOf(...Object.values(settingsSlice.actions)),
	effect: (action, listenerApi) => {
		const prevState = listenerApi.getOriginalState() as ReturnType<typeof store.getState>; // Get previous state
		const state = listenerApi.getState() as ReturnType<typeof store.getState>; // Get current state
		const prevSettings = prevState.settings; // Get previous settings from state
		const settings = state.settings; // Get settings from state

		// Save settings to local storage
		localStorage.setItem('settings', JSON.stringify(drySettings(settings)));

		// If locale changed (previous locale !== current locale)
		if (prevSettings.locale !== settings.locale) {
			setCookie( // Set cookie with new locale
				'NEXT_LOCALE',
				settings.locale,
				{
					path: '/',
					sameSite: 'strict',
				}
			);

			setManifestCache(settings.locale, settings); // Add manifest(s) to cache
			setOfflinePageCache(); // Add offline page to cache
		}
	}
});