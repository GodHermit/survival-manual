'use client';

import { Box, Button, Center, Container, Heading, Icon, Spinner, Text } from '@chakra-ui/react';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from 'next/navigation';
import { useLayoutEffect, useTransition } from 'react';
import { MdCloudOff } from 'react-icons/md';

export default function OfflinePage() {
	const router = useRouter();
	const t = useTranslations();
	const locale = useLocale();
	const pathname = usePathname();
	const [isPending, startTransition] = useTransition();

	useLayoutEffect(() => {
		if (pathname === '/offline') {
			router.replace(`/${locale}`);
		}
	}, [pathname, router, locale]);

	const handleTryAgain = () => {
		startTransition(async () => {
			await router.refresh();
			await new Promise(r => setTimeout(r, 1000)); // Wait for 1 second
		});
	};

	if (isPending) {
		return (
			<Center
				minH='100svh'
				maxH='100svh'
			>
				<Spinner />
			</Center>
		);
	}

	return (
		<Container
			display='flex'
			alignItems='center'
			minH='100svh'
			maxH='100svh'
			p={{
				base: 4,
				md: 8
			}}
		>
			<Box
				textAlign='center'
			>
				<Icon
					as={MdCloudOff}
					mb={4}
					fontSize='4xl'
				/>
				<Heading
					as='h1'
					mb={8}
				>
					{t('Offline.title')}
				</Heading>
				<Text
					mb={8}
					fontSize='lg'
				>
					{t('Offline.message')}
				</Text>
				<Button onClick={handleTryAgain}>{t('tryAgain')}</Button>
			</Box>
		</Container>
	);
}