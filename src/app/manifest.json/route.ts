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
		'short_name': t('title'),
		'start_url': '/',
		'icons': [
			{
				'src': '/assets/android-chrome-192x192.png',
				'sizes': '192x192',
				'type': 'image/png'
			},
			{
				'src': '/assets/android-chrome-512x512.png',
				'sizes': '512x512',
				'type': 'image/png'
			}
		],
		'theme_color': '#ffffff',
		'background_color': '#ffffff',
		'display': 'standalone'
	});
}