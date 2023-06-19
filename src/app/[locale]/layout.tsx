import { NextIntlClientProvider } from 'next-intl'
import { Providers } from './providers'
import { notFound } from 'next/navigation';

export const metadata = {
	title: 'Довідник по виживанню', // TODO: depend on locale
	description: '',
}

type Messages = typeof import('@/_messages/en.json');

export function generateStaticParams() {
	return [{ locale: 'en' }, { locale: 'uk' }];
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
