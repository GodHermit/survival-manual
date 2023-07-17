import { getLocaleFromRequest, isLocaleSupported } from '@/_lib/locales';
import { createTranslator } from 'next-intl';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const params = new URL(request.url).searchParams;

	let locale = getLocaleFromRequest(request);

	if (params.has('locale')) {
		const localeParam = params.get('locale') as string;
		if (!isLocaleSupported(localeParam)) {
			return NextResponse.json({
				error: 'LOCALE_IS_NOT_SUPPORTED'
			}, {
				status: 400
			})
		}
		locale = localeParam;
	}

	const messages = (await import(`@/_messages/${locale}.json`)).default;
	const t = createTranslator({ locale, messages });

	return NextResponse.json({
		'name': t('title'),
		'short_name': t('metadata.shortName'),
		'start_url': '/',
		'id': '/',
		'description': t('metadata.description'),
		'display': 'standalone',
		'orientation': 'any',
		'theme_color': '#fff',
		'background_color': '#fff',
		'icons': [
			{
				'src': '/assets/favicon-16x16.png',
				'sizes': '16x16',
				'type': 'image/png'
			},
			{
				'src': '/assets/favicon-32x32.png',
				'sizes': '32x32',
				'type': 'image/png'
			},
			{
				'src': '/favicon.ico',
				'sizes': '48x48',
				'type': 'image/x-icon',
			},
			{
				'src': '/assets/android-chrome-192x192.png',
				'sizes': '192x192',
				'type': 'image/png'
			},
			{
				'src': '/assets/android-chrome-512x512.png',
				'sizes': '512x512',
				'type': 'image/png'
			},
			{
				'src': '/assets/maskable-icon-512x512.png',
				'sizes': '512x512',
				'type': 'image/png',
				"purpose": "maskable"
			}
		]
	});
}