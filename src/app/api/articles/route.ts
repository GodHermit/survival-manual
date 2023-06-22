import { getArticles, getArticlesMetadata } from '@/_lib/articles';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	const {locale, metadataOnly} = await request.json();

	if (metadataOnly) {
		const articles = await getArticlesMetadata(locale);
		return NextResponse.json(articles);
	} 
	
	const articles = await getArticles(locale);
	return NextResponse.json(articles);
}