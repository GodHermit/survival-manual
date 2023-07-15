import { isLocaleSupported } from '@/_lib/locales';
import { locales } from '@/middleware';
import { Metadata } from 'next';
import { NextIntlClientProvider, createTranslator } from 'next-intl';
import { notFound } from 'next/navigation';
import { Providers } from './providers';

type Messages = typeof import('@/_messages/en.json');

export function generateStaticParams() {
	return locales.map(locale => ({
		locale
	}));
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
	if (!isLocaleSupported(locale)) {
		notFound();
	}
	const messages = (await import(`@/_messages/${locale}.json`)).default;

	const t = createTranslator({ locale, messages });

	return {
		title: t('title'),
		alternates: {
			canonical: `/`,
			languages: {
				'en': '/',
				'uk': '/uk',
			},
		},
		icons: {
			icon: [
				{
					url: '/favicon.ico'
				},
				{
					url: '/assets/favicon-32x32.png',
					type: 'image/png',
					sizes: '32x32',
				},
				{
					url: '/assets/favicon-16x16.png',
					type: 'image/png',
					sizes: '16x16',
				}
			],
			apple: '/assets/apple-touch-icon.png'
		},
		manifest: `/manifest.json?locale=${locale}`,
	};
}

export default async function RootLayout({
	children,
	params,
}: {
	children: React.ReactNode,
	params: {
		locale: string,
	},
}) {
	if (!isLocaleSupported(params.locale)) {
		notFound();
	}

	let messages: Messages;
	try {
		messages = (await import(`@/_messages/${params.locale}.json`)).default;
	} catch (error) {
		notFound();
	}

	return (
		<html lang={params.locale}>
			<body>
				<NextIntlClientProvider locale={params.locale} messages={messages}>
					<Providers>
						{children}
					</Providers>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
