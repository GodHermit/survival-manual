'use client';

import Storyset404 from '@/_assets/404.svg';
import { Box, Button, Heading, Image, Link } from '@chakra-ui/react';
import { useLocale, useTranslations } from 'next-intl';
import NextImage from 'next/image';
import NextLink from 'next/link';

export default function NotFoundContent() {
	const locale = useLocale();
	const t = useTranslations('404Error');

	return (
		<Box
			textAlign='center'
		>
			<Heading
				as='h1'
				mb={8}
			>
				{t('title')}
			</Heading>
			<Image
				as={NextImage}
				src={Storyset404}
				alt='404'
				width={400}
				height={400}
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
					href='https://storyset.com/web'
					isExternal
					color='gray.500'
				>
					{t('webIllustrationBy')}
				</Link>
			</Box>
			<Button
				as={NextLink}
				href={`/${locale}`}
				w='100%'
			>
				{t('backHome')}
			</Button>
		</Box>
	);
}