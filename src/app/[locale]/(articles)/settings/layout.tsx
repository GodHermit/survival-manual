import { isLocaleSupported } from '@/_lib/locales';
import { generateMetadataFor, generateOGFor } from '@/_lib/metadata';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
	if (!isLocaleSupported(locale)) {
		notFound();
	}

	return {
		...await generateMetadataFor('Settings', locale),
		...await generateOGFor('Settings', locale, '/settings'),
		alternates: {}, // Disable alternates
		robots: {
			index: false // Disable indexing
		}
	};
}

export default function OfflineLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return children;
}