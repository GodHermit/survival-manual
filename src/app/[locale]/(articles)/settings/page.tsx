'use client';

import { SettingsState, resetSettings, selectSettingsState, setSettings } from '@/_helpers/settingsSlice';
import { Box, FormControl, FormHelperText, FormLabel, Heading, IconButton, Select, Stack, Switch, Tooltip } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { MdSettingsBackupRestore } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

export default function SettingsPage() {
	const state = useSelector(selectSettingsState);
	const dispatch = useDispatch();
	const t = useTranslations('Settings');

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
				>
					<IconButton
						aria-label={t('reset')}
						icon={<MdSettingsBackupRestore />}
						onClick={() => dispatch(resetSettings())}
					/>
				</Tooltip>
			</Box>
			<FormControl mb={4}>
				<FormLabel>{t('language')}</FormLabel>
				<Select
					value={state.language}
					onChange={e => dispatch(setSettings({
						language: e.target.value
					}))}
				>
					<option value='en'>English</option>
					<option value='uk'>Українська</option>
				</Select>
			</FormControl>
			<FormControl mb={4}>
				<FormLabel>{t('colorMode.label')}</FormLabel>
				<Select
					value={state.colorMode}
					onChange={e => dispatch(setSettings({
						colorMode: e.target.value as SettingsState['colorMode']
					}))}
				>
					<option value='light'>{t('colorMode.light')}</option>
					<option value='dark'>{t('colorMode.dark')}</option>
					<option value='amoled'>{t('colorMode.amoled')}</option>
					<option value='system'>{t('colorMode.system')}</option>
				</Select>
			</FormControl>
			<FormControl mb={4}>
				<FormLabel>{t('fontSize.label')}</FormLabel>
				<Select
					value={state.fontSize}
					onChange={e => dispatch(setSettings({
						fontSize: e.target.value as SettingsState['fontSize']
					}))}
				>
					<option value='base'>{t('fontSize.base')}</option>
					<option value='sm'>{t('fontSize.sm')}</option>
					<option value='md'>{t('fontSize.md')}</option>
					<option value='lg'>{t('fontSize.lg')}</option>
					<option value='xl'>{t('fontSize.xl')}</option>
				</Select>
			</FormControl>
			<Heading as='h2' size='lg' mb={4} mt={6}>{t('caching.heading')}</Heading>
			<FormControl mb={4}>
				<Box
					display='flex'
					justifyContent='space-between'
					alignItems='center'
				>
					<FormLabel mb={0}>{t('caching.label')}</FormLabel>
					<Switch
						isChecked={state.isCachingEnabled}
						onChange={e => dispatch(setSettings({
							isCachingEnabled: e.target.checked,
							isCachingMediaEnabled: e.target.checked
						}))}
					/>
				</Box>
				{state.isCachingEnabled && (
					<FormHelperText>{t('caching.lastSync')}: {new Date().toDateString()}</FormHelperText>
				)}
			</FormControl>
			<Stack pl={6} spacing={4}>
				<FormControl
					isDisabled={!state.isCachingEnabled}
				>
					<FormLabel>{t('caching.language.label')}</FormLabel>
					<Select
						value={state.cacheLanguages}
						onChange={e => dispatch(setSettings({
							cacheLanguages: e.target.value as SettingsState['cacheLanguages']
						}))}
					>
						<option value='current'>{t('caching.language.selected')}</option>
						<option value='all'>{t('caching.language.all')}</option>
					</Select>
				</FormControl>
				<FormControl
					display='flex'
					justifyContent='space-between'
					alignItems='center'
					isDisabled={!state.isCachingEnabled}
				>
					<FormLabel>{t('caching.saveMedia')}</FormLabel>
					<Switch
						isChecked={state.isCachingMediaEnabled}
						onChange={e => dispatch(setSettings({
							isCachingMediaEnabled: e.target.checked
						}))}
					/>
				</FormControl>
			</Stack>
		</>
	);
}