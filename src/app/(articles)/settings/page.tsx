'use client';

import { SettingsState, resetSettings, selectSettingsState, setSettings } from '@/_helpers/settingsSlice';
import { Box, FormControl, FormHelperText, FormLabel, Heading, IconButton, Select, SimpleGrid, Stack, Switch, Tooltip } from '@chakra-ui/react';
import { MdSettingsBackupRestore } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

export default function SettingsPage() {
	const state = useSelector(selectSettingsState);
	const dispatch = useDispatch();

	return (
		<>
			<Box
				display='flex'
				justifyContent='space-between'
				alignItems='baseline'
				mb={4}
			>
				<Heading as='h1' mb={0}>Налаштування</Heading>
				<Tooltip
					label='Скинути налаштування'
					placement='bottom-end'
				>
					<IconButton
						aria-label='Скинути налаштування'
						icon={<MdSettingsBackupRestore />}
						onClick={() => dispatch(resetSettings())}
					/>
				</Tooltip>
			</Box>
			<FormControl mb={4}>
				<FormLabel>Мова</FormLabel>
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
				<FormLabel>Тема</FormLabel>
				<Select
					value={state.colorMode}
					onChange={e => dispatch(setSettings({
						colorMode: e.target.value as SettingsState['colorMode']
					}))}
				>
					<option value='light'>Світла</option>
					<option value='dark'>Темна</option>
					<option value='amoled'>Amoled</option>
					<option value='system'>Системна</option>
				</Select>
			</FormControl>
			<FormControl mb={4}>
				<FormLabel>Розмір тексту</FormLabel>
				<Select
					value={state.fontSize}
					onChange={e => dispatch(setSettings({
						fontSize: e.target.value as SettingsState['fontSize']
					}))}
				>
					<option value='base'>За замовчуванням</option>
					<option value='sm'>Малий</option>
					<option value='md'>Середній</option>
					<option value='lg'>Великий</option>
					<option value='xl'>Величезний</option>
				</Select>
			</FormControl>
			<Heading as='h2' size='lg' mb={4} mt={6}>Доступ офлайн</Heading>
			<FormControl mb={4}>
				<Box
					display='flex'
					justifyContent='space-between'
					alignItems='center'
				>
					<FormLabel mb={0}>Зберігати статті</FormLabel>
					<Switch
						isChecked={state.isCachingEnabled}
						onChange={e => dispatch(setSettings({
							isCachingEnabled: e.target.checked,
							isCachingMediaEnabled: e.target.checked
						}))}
					/>
				</Box>
				{state.isCachingEnabled && (
					<FormHelperText>Останнє оновлення: {new Date().toDateString()}</FormHelperText>
				)}
			</FormControl>
			<Stack pl={6} spacing={4}>
				<FormControl
					isDisabled={!state.isCachingEnabled}
				>
					<FormLabel>Мова</FormLabel>
					<Select
						value={state.cacheLanguages}
						onChange={e => dispatch(setSettings({
							cacheLanguages: e.target.value as SettingsState['cacheLanguages']
						}))}
					>
						<option value='current'>Вибрана</option>
						<option value='all'>Усі</option>
					</Select>
				</FormControl>
				<FormControl
					display='flex'
					justifyContent='space-between'
					alignItems='center'
					isDisabled={!state.isCachingEnabled}
				>
					<FormLabel>Зберігати медіафайли</FormLabel>
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