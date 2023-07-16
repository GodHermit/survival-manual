import { createSlice } from '@reduxjs/toolkit';

export interface SettingsState {
	locale: string;
	isLanguageChanging: boolean;
	colorMode: 'light' | 'dark' | 'system';
	isColorModeChanging: boolean;
	fontSize: 'base' | 'xs' | 'md' | 'lg' | 'xl';
	isFontSizeChanging: boolean;
	isCachingEnabled: boolean;
	isCachingMediaEnabled: boolean;
	cacheLocales: 'current' | 'all';
	cacheLastSyncTimestamp?: number;
	isCacheChanging: boolean;
}

interface SettingsAction {
	payload: Partial<SettingsState>;
}

export const initialSettings: SettingsState = {
	locale: 'en',
	isLanguageChanging: false,
	colorMode: 'system',
	isColorModeChanging: true,
	fontSize: 'base',
	isFontSizeChanging: true,
	isCachingEnabled: false,
	isCachingMediaEnabled: false,
	cacheLocales: 'current',
	cacheLastSyncTimestamp: undefined,
	isCacheChanging: false,
};

export const settingsSlice = createSlice({
	name: 'settings',
	initialState: initialSettings,
	reducers: {
		setSettings: (state, action: SettingsAction): SettingsState => {
			return { ...state, ...action.payload };
		},
		resetSettings: (state): SettingsState => {
			return { ...state, ...initialSettings };
		}
	}
});

/**
 * Remove all `is*Changing` keys from settings object
 * @param settings current settings
 * @returns settings without `is*Changing` keys
 */
export const drySettings = (settings: SettingsState) => {
	return Object.fromEntries(
		Object
			.entries(settings)
			.filter(
				([key]) => !(key.startsWith('is') && key.endsWith('Changing'))
			)
	);
}

export const { setSettings, resetSettings } = settingsSlice.actions;

export const selectSettingsState = (state: { settings: SettingsState }) => state.settings;

export default settingsSlice.reducer;