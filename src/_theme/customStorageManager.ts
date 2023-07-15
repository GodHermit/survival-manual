import { SettingsState, initialSettings } from '@/_store/slices/settingsSlice';
import { ColorMode, localStorageManager } from '@chakra-ui/react';

export const customStorageManager: typeof localStorageManager = {
	ssr: false,
	type: 'localStorage',
	get: (init?: ColorMode) => {
		if (typeof window === 'undefined') return 'light';
		const settingsInStorage = localStorage.getItem('settings');
		const settings: SettingsState = settingsInStorage !== null ? JSON.parse(settingsInStorage) : initialSettings;
		return settings.colorMode as ColorMode || init;
	},
	set: (value: string) => {
		if (typeof window === 'undefined') return;
		const settingsInStorage = localStorage.getItem('settings');
		const settings: SettingsState = JSON.parse(settingsInStorage || '{}');
		localStorage.setItem('settings', JSON.stringify({ ...initialSettings, ...settings, colorMode: value }));
	}
};