'use server';

import { locales as supportedLocales } from '@/middleware';
import path from 'path';

const fs = require('fs');

export interface Locale {
	code: string;
	name: string;
}

/**
 * Get locales list
 * @returns {Promise<Locale[]>} locales list
 */
export async function getLocales() {
	const dirPath = await path.join(process.cwd(), `/src/_messages/`);

	// If _messages folder doesn't exist, return empty array
	if (!await fs.existsSync(dirPath)) {
		return [];
	}

	const locales: Locale[] = [];

	// For each locale, check if it has a json file
	for (const locale of supportedLocales) {
		const filePath = path.join(dirPath, `${locale}.json`);

		// If locale file doesn't exist, skip it
		if (!await fs.existsSync(filePath)) {
			continue;
		}

		// Read locale data from json file
		const localeData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

		// If file doesn't have a specified language, skip it
		if (!localeData.language) {
			continue;
		}

		// Add locale to locales list
		locales.push({
			code: locale,
			name: localeData.language
		});
	}

	return locales; // Return locales list
}