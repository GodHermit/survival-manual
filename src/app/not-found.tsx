'use client';

import NotFoundContent from '@/components/NotFoundContent';
import { defaultLocale } from '@/middleware';
import { Container } from '@chakra-ui/react';
import { getCookie } from 'cookies-next';
import { NextIntlClientProvider } from 'next-intl';
import { Providers } from './[locale]/providers';

export default function NotFound() {
	const locale = getCookie('NEXT_LOCALE')?.toString() || defaultLocale;

	let messages;
	try {
		messages = require(`@/_messages/${locale}.json`);
	} catch (error) {

	}

	return (
		<html lang={locale}>
			<body>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<Providers>
						<Container
							as='center'
							display='flex'
							justifyContent='center'
							alignItems='center'
							maxW='container.md'
							minH='100svh'
							maxH='100svh'
							p={{
								base: 4,
								md: 8
							}}
						>
							<NotFoundContent />
						</Container>
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}