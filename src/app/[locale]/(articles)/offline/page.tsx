'use client';

import { Button, Heading, Text } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next-intl/client';

export default function OfflinePage() {
	const router = useRouter();
	const t = useTranslations();

	//TODO: redirect to home page if online

	return (
		<>
			<Heading as='h1' mb={7}>{t('Offline.title')}</Heading>
			<Text mb={7}>{t('Offline.message')}</Text>
			<Button onClick={() => router.refresh()}>{t('tryAgain')}</Button>
		</>
	);
}