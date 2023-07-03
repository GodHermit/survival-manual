import { getLocales } from '@/_lib/messages';
import { NextResponse } from 'next/server';

export async function GET() {
	const locales = await getLocales();
	return NextResponse.json(locales);
}