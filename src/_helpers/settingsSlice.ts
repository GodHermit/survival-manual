import { createSlice } from '@reduxjs/toolkit';

export interface SettingsState {
	language: string;
	isLanguageChanging: boolean;
	colorMode: 'light' | 'dark' | 'amoled' | 'system';
	fontSize: 'base' | 'xs' | 'ms' | 'lg' | 'xl';
	isCachingEnabled: boolean;
	isCachingMediaEnabled: boolean;
	cacheLanguages: 'current' | 'all';
}

interface SettingsAction {
	payload: Partial<SettingsState>;
}

const initialState: SettingsState = {
	language: 'en',
	isLanguageChanging: false,
	colorMode: 'system',
	fontSize: 'base',
	isCachingEnabled: false,
	isCachingMediaEnabled: false,
	cacheLanguages: 'current'
};

export const initialSettings = initialState;

export const settingsSlice = createSlice({
	name: 'settings',
	initialState,
	reducers: {
		setSettings: (state, action: SettingsAction): SettingsState => {
			return { ...state, ...action.payload };
		},
		resetSettings: (state): SettingsState => {
			return { ...state, ...initialState };
		}
	}
});

export const { setSettings, resetSettings } = settingsSlice.actions;

export const selectSettingsState = (state: { settings: SettingsState }) => state.settings;

export default settingsSlice.reducer;