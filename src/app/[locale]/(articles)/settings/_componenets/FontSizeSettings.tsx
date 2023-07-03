import { SettingsState, selectSettingsState, setSettings } from '@/_helpers/settingsSlice';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function FontSizeSettings() {
	const state = useSelector(selectSettingsState);
	const dispatch = useDispatch();
	const t = useTranslations();

	const handleFontSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
		dispatch(setSettings({
			fontSize: e.target.value as SettingsState['fontSize'],
			isFontSizeChanging: true
		}));
	};

	useEffect(() => {
		dispatch(setSettings({
			isFontSizeChanging: false
		}));
	}, [dispatch, state.fontSize]);

	return (
		<FormControl
			mb={4}
			isDisabled={state.isFontSizeChanging}
		>
			<FormLabel>{t('Settings.fontSize.label')}</FormLabel>
			<Select
				value={state.isFontSizeChanging ? 'loading' : state.fontSize}
				onChange={handleFontSizeChange}
			>
				<option value='loading' hidden disabled>{t('loading')}...</option>
				<option value='base'>{t('Settings.fontSize.base')}</option>
				<option value='sm'>{t('Settings.fontSize.sm')}</option>
				<option value='md'>{t('Settings.fontSize.md')}</option>
				<option value='lg'>{t('Settings.fontSize.lg')}</option>
				<option value='xl'>{t('Settings.fontSize.xl')}</option>
			</Select>
		</FormControl>
	);
}