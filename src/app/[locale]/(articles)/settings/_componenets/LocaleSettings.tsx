import useNetworkStatus from '@/_hooks/useNetworkStatus';
import { setArticlesCache } from '@/_lib/articlesCaching';
import { isLocaleSupported } from '@/_lib/locales';
import { Locale } from '@/_lib/messages';
import { selectSettingsState, setSettings } from '@/_store/slices/settingsSlice';
import { FormControl, FormLabel, Select } from '@chakra-ui/react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState, useTransition } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function LocaleSettings() {
	const [locales, setLocales] = useState<Locale[]>([]);
	const state = useSelector(selectSettingsState);
	const dispatch = useDispatch();
	const isOnline = useNetworkStatus();
	const router = useRouter();
	const locale = useLocale();
	const t = useTranslations();
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setLocales([]);
		fetch('/api/locales')
			.then((res) => res.json())
			.then((data) => {
				setLocales(data);
			});
	}, [isOnline]);

	const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
		if (!isLocaleSupported(e.target.value)) {
			return;
		}

		dispatch(setSettings({
			locale: e.target.value,
		}));

		if (isOnline && state.isCachingEnabled && state.cacheLocales === 'current') {
			// update cache if:
			// isOnline - to prevent deleting cache offline
			// isCachingEnabled - caching is enabled
			// cacheLocales === 'current' - no reason to update cache if it's not current locale
			setArticlesCache(e.target.value);
		}

		startTransition(() => {
			router.replace(`/${e.target.value}/settings`);
		});
	};

	useEffect(() => {
		dispatch(setSettings({
			isLanguageChanging: isPending
		}));
	}, [dispatch, isPending]);

	return (
		<FormControl
			mb={4}
			isDisabled={state.isLanguageChanging || locales.length <= 0}
		>
			<FormLabel>{t('Settings.language')}</FormLabel>
			<Select
				value={state.isLanguageChanging || locales.length <= 0 ? 'loading' : locale}
				onChange={handleLanguageChange}
			>
				<option value='loading' hidden disabled>{t('loading')}...</option>
				{locales && locales.map((locale) => (
					<option
						key={locale.code}
						value={locale.code}
					>
						{locale.name}
					</option>
				))}
			</Select>
		</FormControl>
	);
}