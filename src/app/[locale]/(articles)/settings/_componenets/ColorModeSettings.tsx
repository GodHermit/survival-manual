import { SettingsState, selectSettingsState, setSettings } from '@/_helpers/settingsSlice';
import { FormControl, FormLabel, Select, useColorMode } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function ColorModeSettings() {
	const state = useSelector(selectSettingsState);
	const dispatch = useDispatch();
	const t = useTranslations();
	const { setColorMode } = useColorMode();

	const handleColorModeChange = (e: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setSettings({
			colorMode: e.target.value as SettingsState['colorMode'],
			isColorModeChanging: true
		}));

		setColorMode(e.target.value as SettingsState['colorMode']);
	};

	useEffect(() => {
		dispatch(setSettings({
			isColorModeChanging: false
		}));
	}, [dispatch, state.colorMode]);

	return (
		<FormControl
			mb={4}
			isDisabled={state.isColorModeChanging}
		>
			<FormLabel>{t('Settings.colorMode.label')}</FormLabel>
			<Select
				value={state.isColorModeChanging ? 'loading' : state.colorMode}
				onChange={handleColorModeChange}
			>
				<option value='loading' hidden disabled>{t('loading')}...</option>
				<option value='light'>{t('Settings.colorMode.light')}</option>
				<option value='dark'>{t('Settings.colorMode.dark')}</option>
				<option value='system'>{t('Settings.colorMode.system')}</option>
			</Select>
		</FormControl>
	);
}