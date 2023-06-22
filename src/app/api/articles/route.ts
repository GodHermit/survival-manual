import { getArticleByFilename, getArticles, getArticlesMetadata } from '@/_lib/articles';
import { NextRequest, NextResponse } from 'next/server';

interface RequestBody {
	action: 'getByFilename' | 'getAll';
	filename?: string;
	locale: string;
	metadataOnly: boolean;
}

export async function POST(request: NextRequest) {
	const { action, locale, metadataOnly } = await request.json() as RequestBody;

	switch (action) {
		case 'getByFilename':
			const { filename } = await request.json() as RequestBody;
			if (filename) {
				return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
			}
			const article = await getArticleByFilename(filename as string, locale);
			return NextResponse.json(article);
			break;
		case 'getAll':
		default:
			if (metadataOnly) {
				const articles = await getArticlesMetadata(locale);
				return NextResponse.json(articles);
			}

			const articles = await getArticles(locale);
			return NextResponse.json(articles);
	}
}