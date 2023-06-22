import { NextIntlClientProvider, createTranslator } from 'next-intl'
import { Providers } from './providers'
import { notFound } from 'next/navigation';

type Messages = typeof import('@/_messages/en.json');

export function generateStaticParams() {
	return [{ locale: 'en' }, { locale: 'uk' }];
}

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
	const messages = (await import(`@/_messages/${locale}.json`)).default;

	const t = createTranslator({ locale, messages });

	return {
		title: t('title')
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
