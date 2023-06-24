import { createSlice } from '@reduxjs/toolkit';

export interface SettingsState {
	language: string;
	isLanguageChanging: boolean;
	colorMode: 'light' | 'dark' | 'system';
	isColorModeChanging: boolean;
	fontSize: 'base' | 'xs' | 'ms' | 'lg' | 'xl';
	isCachingEnabled: boolean;
	isCachingMediaEnabled: boolean;
	cacheLanguages: 'current' | 'all';
}

interface SettingsAction {
	payload: Partial<SettingsState>;
}

export const initialSettings: SettingsState = {
	language: 'en',
	isLanguageChanging: false,
	colorMode: 'system',
	isColorModeChanging: true,
	fontSize: 'base',
	isCachingEnabled: false,
	isCachingMediaEnabled: false,
	cacheLanguages: 'current'
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

export const { setSettings, resetSettings } = settingsSlice.actions;

export const selectSettingsState = (state: { settings: SettingsState }) => state.settings;

export default settingsSlice.reducer;