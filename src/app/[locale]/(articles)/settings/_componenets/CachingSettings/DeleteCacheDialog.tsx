import { setSettings } from '@/_helpers/settingsSlice';
import useNetworkStatus from '@/_hooks/useNetworkStatus';
import { deleteArticlesCache } from '@/_lib/articlesCaching';
import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, UseDisclosureReturn } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useCountdown } from 'usehooks-ts';

export default function DeleteCacheDialog(props: UseDisclosureReturn) {
	const cancelRef = useRef<HTMLButtonElement>(null);
	const dispatch = useDispatch();
	const isOnline = useNetworkStatus();
	const t = useTranslations('Settings.caching.DeleteCacheDialog');
	const [count, { startCountdown, stopCountdown, resetCountdown }] =
		useCountdown({
			countStart: isOnline ? 15 : 60, // 15 seconds if online, 1 minute if offline
			intervalMs: 1000, // 1 second
		});

	useEffect(() => {
		if (props.isOpen) {
			startCountdown();
		} else {
			//FIXME: countdown stops after ~4 seconds
			stopCountdown();
			resetCountdown();
		}
	}, [props.isOpen, startCountdown, stopCountdown, resetCountdown]);

	const handleDeleteCache = () => {
		if (count > 0) {
			return;
		}

		deleteArticlesCache();
		dispatch(setSettings({
			isCachingEnabled: false,
			cacheLocales: 'current',
			isCachingMediaEnabled: false
		}));
		props.onClose();
	};

	return (
		<AlertDialog
			isOpen={props.isOpen}
			leastDestructiveRef={cancelRef}
			onClose={props.onClose}
			isCentered
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize='lg' fontWeight='bold'>
						{t('heading')}
					</AlertDialogHeader>

					<AlertDialogBody>
						{t('text')}
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button ref={cancelRef} onClick={props.onClose}>
							{t('cancelButton')}
						</Button>
						<Button
							ml={3}
							colorScheme='red'
							onClick={handleDeleteCache}
							isDisabled={count > 0}
						>
							{t('confirmButton', { seconds: count })}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>
	);
}