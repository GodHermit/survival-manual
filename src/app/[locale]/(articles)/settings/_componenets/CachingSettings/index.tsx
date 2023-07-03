import { SettingsState, selectSettingsState, setSettings } from '@/_helpers/settingsSlice';
import useNetworkStatus from '@/_hooks/useNetworkStatus';
import { ARTICLES_MEDIA_CACHE, setArticlesCache, setArticlesMediaCache } from '@/_lib/articlesCaching';
import { Box, FormControl, FormHelperText, FormLabel, Heading, Select, Spinner, Stack, Switch, Tag, useDisclosure } from '@chakra-ui/react';
import { useFormatter, useLocale, useTranslations } from 'next-intl';
import { ChangeEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DeleteCacheDialog from './DeleteCacheDialog';
import UpdateCacheButton from './UpdateCacheButton';

export default function CachingSettings() {
	const deleteCacheDialog = useDisclosure();
	const state = useSelector(selectSettingsState);
	const dispatch = useDispatch();
	const t = useTranslations('Settings');
	const locale = useLocale();
	const format = useFormatter();
	const isOnline = useNetworkStatus();

	/**
	 * Get last sync date from cache.
	 */
	useEffect(() => {
		caches.open('articles')
			.then(async (cache) => {
				const keys = await cache.keys();

				if (keys && keys.length <= 0) {
					// cache is empty
					return;
				}

				const article = await cache.match(keys[0]);
				const date = await article?.headers.get('date');
				date && dispatch(setSettings({
					cacheLastSyncTimestamp: new Date(date).getTime()
				}));
			});
	}, [dispatch]);

	/**
	 * Handle 'caching' switch change.
	 * @param e event object
	 */
	const handleArticlesCachingChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.checked) {
			dispatch(setSettings({
				isCachingEnabled: e.target.checked,
				cacheLocales: 'current',
				isCachingMediaEnabled: e.target.checked
			}));
			setArticlesCache(locale);
		} else {
			// open dialog to confirm cache deletion
			deleteCacheDialog.onOpen();
		}
	};

	/**
	 * Handle 'caching language' select change.
	 * @param e event object
	 */
	const handleCachingLocalesChange = (e: ChangeEvent<HTMLSelectElement>) => {
		if (!isOnline) {
			return;
		}

		dispatch(setSettings({
			cacheLocales: e.target.value as SettingsState['cacheLocales']
		}));

		setArticlesCache(locale);
	};

	/**
	 * Handle 'caching media' switch change.
	 * @param e event object
	 */
	const handleArticlesMediaCachingChange = (e: ChangeEvent<HTMLInputElement>) => {
		dispatch(setSettings({
			isCachingMediaEnabled: e.target.checked
		}));

		if (e.target.checked) {
			setArticlesMediaCache(locale);
		} else {
			caches.delete(ARTICLES_MEDIA_CACHE);
		}
	}

	return (
		<>
			<Heading as='h2' size='lg' mb={4} mt={6}>{t('caching.heading')}</Heading>
			<FormControl
				mb={4}
				isDisabled={state.isCacheChanging || (!isOnline && !state.isCachingEnabled)}
			>
				<Box
					display='flex'
					justifyContent='space-between'
					alignItems='center'
				>
					<FormLabel
						display='flex'
						alignItems='baseline'
						mb={0}
					>
						{t('caching.label')}
						{(!isOnline && !state.isCachingEnabled) && (
							<Tag
								ml={2}
								variant='subtle'
								colorScheme='red'
								size='sm'
							>
								{t('caching.onlineOnly')}
							</Tag>
						)}
					</FormLabel>
					<Switch
						isChecked={state.isCachingEnabled}
						onChange={handleArticlesCachingChange}
					/>
				</Box>
				{state.isCachingEnabled && (
					<FormHelperText
						display='flex'
						alignItems='baseline'
					>
						{t('caching.lastSync')}: {
							state.cacheLastSyncTimestamp ?
								<>
									{format.dateTime(new Date(state.cacheLastSyncTimestamp), {
										year: 'numeric',
										month: 'long',
										day: 'numeric'
									})}
									<UpdateCacheButton />
								</>
								:
								<Spinner size='xs' ml={2} />
						}
					</FormHelperText>
				)}
			</FormControl>
			<Stack pl={6} spacing={4}>
				<FormControl
					isDisabled={state.isCacheChanging || !state.isCachingEnabled || !isOnline}
				>
					<FormLabel
						display='flex'
						alignItems='baseline'
					>
						{t('caching.language.label')}
						{!isOnline && (
							<Tag
								ml={2}
								variant='subtle'
								colorScheme='red'
								size='sm'
							>
								{t('caching.onlineOnly')}
							</Tag>
						)}
					</FormLabel>
					<Select
						value={state.cacheLocales}
						onChange={handleCachingLocalesChange}
					>
						<option value='current'>{t('caching.language.selected')}</option>
						<option value='all'>{t('caching.language.all')}</option>
					</Select>
				</FormControl>
				<FormControl
					display='flex'
					justifyContent='space-between'
					alignItems='center'
					isDisabled={state.isCacheChanging || !state.isCachingEnabled || !isOnline}
				>
					<FormLabel
						display='flex'
						alignItems='baseline'
					>
						{t('caching.saveMedia')}
						{!isOnline && (
							<Tag
								ml={2}
								variant='subtle'
								colorScheme='red'
								size='sm'
							>
								{t('caching.onlineOnly')}
							</Tag>
						)}
					</FormLabel>
					<Switch
						isChecked={state.isCachingMediaEnabled}
						onChange={handleArticlesMediaCachingChange}
					/>
				</FormControl>
			</Stack>
			<DeleteCacheDialog {...deleteCacheDialog} />
		</>
	);
}