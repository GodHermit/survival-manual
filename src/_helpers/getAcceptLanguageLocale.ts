import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

export function getAcceptLanguageLocale(
	requestHeaders: Headers,
	locales: Array<string>,
	defaultLocale: string
) {
	let locale = defaultLocale;

	const languages = new Negotiator({
		headers: {
			'accept-language': requestHeaders.get('accept-language') || undefined
		}
	}).languages();
	try {
		locale = match(languages, locales, defaultLocale);
	} catch (e) {
		// Invalid language
	}

	return locale;
}