'use client';

import { SettingsState, initialSettings, resetSettings, selectSettingsState, setSettings } from '@/_helpers/settingsSlice';
import useNetworkStatus from '@/_hooks/useNetworkStatus';
import { Box, Heading, IconButton, Tooltip, useColorMode } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { MdSettingsBackupRestore } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import CachingSettings from './_componenets/CachingSettings/';
import ColorModeSettings from './_componenets/ColorModeSettings';
import FontSizeSettings from './_componenets/FontSizeSettings';
import LocaleSettings from './_componenets/LocaleSettings';

function drySettings(settings: SettingsState) {
	return Object.fromEntries(
		Object
			.entries(settings)
			.filter(
				([key]) => !(key.startsWith('is') && key.endsWith('Changing'))
			)
	);
}

export default function SettingsPage() {
	const state = useSelector(selectSettingsState);
	const dispatch = useDispatch();
	const t = useTranslations('Settings');
	const { setColorMode } = useColorMode()
	const router = useRouter();
	const isOnline = useNetworkStatus();

	/**
	 * Check if settings were modified.
	 * Ignore `is*Changing` properties.
	 */
	const isSettingsModified = JSON.stringify(drySettings(state)) !== JSON.stringify(drySettings(initialSettings));

	const handleReset = () => {
		if (!isSettingsModified) {
			return;
		}

		if (!isOnline) {
			return;
		}

		dispatch(resetSettings());

		router.push(`/${initialSettings.locale}/settings`); // reset locale
		setColorMode(initialSettings.colorMode); // reset color mode

		dispatch(setSettings(
			Object.fromEntries( // set all `is*Changing` properties to false
				Object
					.entries(state)
					.filter(
						([key]) => (key.startsWith('is') && key.endsWith('Changing'))
					)
					.map(([key]) => [key, false])
			)
		));
	};

	return (
		<>
			<Box
				display='flex'
				justifyContent='space-between'
				alignItems='baseline'
				mb={4}
			>
				<Heading as='h1' mb={0}>{t('title')}</Heading>
				<Tooltip
					label={t('reset')}
					placement='bottom-end'
					isDisabled={!isSettingsModified || !isOnline}
				>
					<IconButton
						aria-label={t('reset')}
						icon={<MdSettingsBackupRestore />}
						onClick={handleReset}
						isDisabled={!isSettingsModified || !isOnline}
					/>
				</Tooltip>
			</Box>
			<LocaleSettings />
			<ColorModeSettings />
			<FontSizeSettings />
			<CachingSettings />
		</>
	);
}