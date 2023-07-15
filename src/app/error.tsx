'use client';

import StorysetError from '@/_assets/error.svg';
import { defaultLocale } from '@/middleware';
import { Box, Button, ButtonGroup, Container, Heading, Image, Link } from '@chakra-ui/react';
import { getCookie } from 'cookies-next';
import { NextIntlClientProvider, createTranslator } from 'next-intl';
import NextImage from 'next/image';
import NextLink from 'next/link';
import { Providers } from './[locale]/providers';

export default function RootError({
	error,
	reset
}: {
	error: Error
	reset: () => void
}) {
	const locale = getCookie('NEXT_LOCALE')?.toString() || defaultLocale;

	let messages;
	try {
		messages = require(`@/_messages/${locale}.json`);
	} catch (error) { }

	const t = createTranslator({ locale, messages });

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
							<Box>
								<Heading as='h1' mb={6}>{t('pageError.title')}</Heading>

								<Image
									as={NextImage}
									src={StorysetError}
									alt={error.message}
									width={350}
									height={350}
									display='inline-block'
									mb={2}
									style={{
										maxWidth: '100%'
									}}
								/>
								<Box
									mb={8}
								>
									<Link
										href='https://storyset.com/'
										isExternal
										color='gray.500'
									>
										{t('404Error.webIllustrationBy')}
									</Link>
								</Box>
								<ButtonGroup spacing={4}>
									<Button
										onClick={reset}
									>
										{t('tryAgain')}
									</Button>
									<Button
										as={NextLink}
										href='/'
									>
										{t('pageError.backHome')}
									</Button>
								</ButtonGroup>
							</Box>
						</Container>
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}