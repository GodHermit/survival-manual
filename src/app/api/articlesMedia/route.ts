import { getArticlesMedia } from '@/_lib/articles';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Handles GET requests for /api/articlesMedia
 * @param request request object
 * @returns array of media files
 */
export async function GET(request: NextRequest) {
	const params = new URL(request.url).searchParams;

	const articlesMedia = await getArticlesMedia(params.get('locale') || undefined);
	return NextResponse.json(articlesMedia);
};