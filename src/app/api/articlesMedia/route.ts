import { getArticlesMedia } from '@/_lib/articles';
import { isLocaleSupported } from '@/_lib/locales';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles GET requests for /api/articlesMedia
 * @param request request object
 * @returns array of media files
 */
export async function GET(request: NextRequest) {
	const params = new URL(request.url).searchParams;
	const localeParam = params.get('locale') || undefined;

	if (localeParam && localeParam !== 'everyLocale' && !isLocaleSupported(localeParam)) {
		return NextResponse.json({
			error: 'LOCALE_IS_NOT_SUPPORTED'
		}, {
			status: 400
		})
	}

	const articlesMedia = await getArticlesMedia(localeParam);
	return NextResponse.json(articlesMedia);
};