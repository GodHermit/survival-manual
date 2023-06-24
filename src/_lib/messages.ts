'use server';

import path from 'path';

const fs = require('fs');

export interface Locale {
	code: string;
	name: string;
}

export async function getLocales() {
	const dirPath = await path.join(process.cwd(), `/src/_messages/`);
	if (!await fs.existsSync(dirPath)) {
		return [];
	}

	const files = await fs.readdirSync(dirPath);

	let locales: Locale[] = [];
	for (const file of files) {
		if (file.endsWith(`.json`)) {
			locales.push({
				code: file.replace('.json', ''),
				name: JSON.parse(fs.readFileSync(path.join(dirPath, file), 'utf8')).language
			});
		}
	}

	return locales;
}