import useNetworkStatus from '@/_hooks/useNetworkStatus';
import { setArticlesCache } from '@/_lib/articlesCaching';
import { selectSettingsState } from '@/_store/slices/settingsSlice';
import { Button, Tooltip } from '@chakra-ui/react';
import { useLocale, useNow, useTranslations } from 'next-intl';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export default function UpdateCacheButton() {
	const settings = useSelector(selectSettingsState);
	const t = useTranslations('Settings.caching.UpdateCacheButton');
	const locale = useLocale();
	const isOnline = useNetworkStatus();
	const now = useNow({
		updateInterval: 1000 * 60, // 1 minute
	});

	const timeDiff = useMemo(() => {
		if (!settings.cacheLastSyncTimestamp) {
			return null;
		}

		const diff = now.getTime() - settings.cacheLastSyncTimestamp;
		const diffInMinutes = Math.floor(diff / 1000 / 60);

		return diffInMinutes;
	}, [now, settings.cacheLastSyncTimestamp]);

	const handleUpdateCacheClick = () => {
		if (!isOnline) {
			return;
		}

		if (settings.isCachingEnabled && !settings.isCacheChanging) {
			setArticlesCache(locale);
		}
	};

	if (!isOnline) {
		return null;
	}

	return (
		<Tooltip
			label={timeDiff ? t('willBeAvailableIn', { minutes: 5 - timeDiff }) : t('willBeAvailableIn', { minutes: 5 })}
			isDisabled={settings.isCacheChanging || (timeDiff === null || 5 - timeDiff <= 0)}
		>
			<Button
				size='xs'
				ml={2}
				isDisabled={settings.isCacheChanging || (timeDiff === null || timeDiff <= 5)}
				isLoading={settings.isCacheChanging}
				onClick={handleUpdateCacheClick}
			>
				{t('updateButton')}
			</Button>
		</Tooltip>
	);
}