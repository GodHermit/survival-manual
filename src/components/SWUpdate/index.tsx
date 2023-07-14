import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';
import { Workbox } from 'workbox-window';

declare global {
	interface Window {
		workbox: Workbox;
	}
}

export default function SWUpdate() {
	const confirmRef = useRef<HTMLButtonElement>(null);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isConfirmed, setIsConfirmed] = useState(false);
	const t = useTranslations('SWUpdateDialog');

	/**
	 * Check if there is an update available
	 */
	useEffect(() => {
		if (
			typeof window !== 'undefined' // Check if in browser
			&& 'serviceWorker' in navigator // Check if service worker is supported
			&& window.workbox !== undefined // Check if Workbox is loaded
		) {
			const wb = window.workbox; // Get Workbox instance

			// Add an event listener to detect when the registered service worker has installed but is waiting to activate
			wb.addEventListener('waiting', () => {
				onOpen();
			});

			// If the user accepts the update
			if (isOpen && isConfirmed) {
				// Set the callback to reload the page once the service worker has taken control
				wb.addEventListener('controlling', () => {
					window.location.reload();
				});

				// Send a message to the waiting service worker, instructing it to activate
				wb.messageSkipWaiting();
			}
		}
	});

	/**
	 * Handle the user's negative response to the update dialog
	 */
	const handleCancel = () => {
		setIsConfirmed(false);

		onClose();
	};

	/**
	 * Handle the user's positive response to the update dialog
	 */
	const handleConfirm = () => {
		setIsConfirmed(true);
	};

	return (
		<AlertDialog
			isOpen={isOpen}
			leastDestructiveRef={confirmRef}
			onClose={onClose}
			isCentered
		>
			<AlertDialogOverlay>
				<AlertDialogContent>
					<AlertDialogHeader fontSize='lg' fontWeight='bold'>
						{t('title')}
					</AlertDialogHeader>

					<AlertDialogBody>
						{t('text')}
					</AlertDialogBody>

					<AlertDialogFooter>
						<Button
							onClick={handleCancel}
						>
							{t('cancelButton')}
						</Button>
						<Button
							ml={3}
							colorScheme='green'
							onClick={handleConfirm}
							isLoading={isConfirmed}
							ref={confirmRef}
						>
							{t('confirmButton')}
						</Button>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialogOverlay>
		</AlertDialog>

	);
}