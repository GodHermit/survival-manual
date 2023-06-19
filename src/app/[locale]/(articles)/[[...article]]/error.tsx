'use client' // Error components must be Client Components

import { Button, Heading, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Error({
	error,
	reset,
}: {
	error: Error
	reset: () => void
}) {
	const t = useTranslations('pageError');

	return (
		<>
			<Heading as='h1' mb={6}>{t('title')}</Heading>
			<Text mb={6}>{error.message}</Text>
			<Button
				as={Link}
				href='/'
			>
				{t('backHome')}
			</Button>
		</>
	)
}