import { getArticles, getArticlesMetadata } from '@/_lib/articles';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	const params = new URL(request.url).searchParams;

	let locale = 'en';
	if (params.has('locale')) {
		locale = params.get('locale') as string;
	}
	
	if (params.has('metadataOnly')) {
		const articles = await getArticlesMetadata(locale);
		return NextResponse.json(articles);
	}

	const articles = await getArticles(locale);
	return NextResponse.json(articles);
};