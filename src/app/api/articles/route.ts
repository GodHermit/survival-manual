import { getArticles, getArticlesMetadata } from '@/_lib/articles';
import { getLocaleFromRequest, isLocaleSupported } from '@/_lib/locales';
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

	if (params.has('metadataOnly')) {
		const articles = await getArticlesMetadata(locale);
		return NextResponse.json(articles);
	}

	const articles = await getArticles(locale);
	return NextResponse.json(articles);
};