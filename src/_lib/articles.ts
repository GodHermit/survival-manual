'use server';

import { ArticleMetadata } from '@/_helpers/articlesSlice';
import { notFound } from 'next/navigation';
import path from 'path';
import { remark } from 'remark';
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkFrontmatter from 'remark-frontmatter';
import html from 'remark-html';
import { getLocales } from './messages';

const fs = require('fs');
const yaml = require('yaml').parse;

const RESERVED_ARTICLE_NAMES = [
	'api',
	'wiki',
	'assets',
	'offline',
	'404',
	'settings',
];

export async function getArticleByFilename(filename: string, locale: string = 'en') {
	// If the article name is reserved, return 404
	if (RESERVED_ARTICLE_NAMES.includes(filename)) {
		return notFound();
	}

	const fullPath = await path.join(process.cwd(), `/public/wiki/${locale}/${filename}.md`);

	if (!await fs.existsSync(fullPath)) {
		return notFound();
	}

	const fileContents = fs.readFileSync(fullPath, 'utf8');

	const processedContent = await remark()
		.use(remarkFrontmatter, ['yaml'])
		.use(remarkExtractFrontmatter, yaml)
		.use(html)
		.process(fileContents);

	return {
		metadata: processedContent.data,
		contentHtml: processedContent.toString(),
	};
}

export async function getArticles(locale: string = 'en') {
	const dirPath = await path.join(process.cwd(), `/public/wiki/${locale}/`);
	if (!await fs.existsSync(dirPath)) {
		return [];
	}

	const files = await fs.readdirSync(dirPath);

	const articles = [];

	for (const file of files) {
		// Ignore reserved names
		if (RESERVED_ARTICLE_NAMES.includes(path.basename(file, path.extname(file)))) {
			continue;
		}

		if (file.endsWith(`.md`)) {
			const fullPath = await path.join(dirPath, file);
			const fileContents = fs.readFileSync(fullPath, 'utf8');
			const processedContent = await remark()
				.use(remarkFrontmatter, ['yaml'])
				.use(remarkExtractFrontmatter, yaml)
				.use(html)
				.process(fileContents);
			const metadata = processedContent.data;
			const contentHtml = processedContent.toString();
			articles.push({ metadata, contentHtml });
		}
	}

	return articles;
}

export async function getArticlesMetadata(locale: string = 'en') {
	const dirPath = await path.join(process.cwd(), `/public/wiki/${locale}/`);
	if (!await fs.existsSync(dirPath)) {
		return [];
	}

	const files = await fs.readdirSync(dirPath);

	const articles: ArticleMetadata[] = [];

	for (const file of files) {
		// Ignore reserved names
		if (RESERVED_ARTICLE_NAMES.includes(path.basename(file, path.extname(file)))) {
			continue;
		}

		if (file.endsWith(`.md`)) {
			const fullPath = await path.join(dirPath, file);
			const fileContents = fs.readFileSync(fullPath, 'utf8');
			const processedContent = await remark()
				.use(remarkFrontmatter, ['yaml'])
				.use(remarkExtractFrontmatter, yaml)
				.use(html)
				.process(fileContents);
			const metadata: ArticleMetadata = {
				name: processedContent.data.name as string,
				icon: processedContent.data.icon as string,
				slug: processedContent.data.slug as string,
			};
			articles.push(metadata);
		}
	}

	return articles;
}

/**
 * Returns all articles media files
 * @param {string} locale if specified, returns general media files + translated media files 
 */
export async function getArticlesMedia(locale?: string) {
	const publicURLToGeneralMediaFiles = `/wiki/assets/`; // URL to general media files

	let media: string[] = []; // Array of media files

	// Read general media files
	const generalMediaFilesPath = await path.join(process.cwd(), `/public/wiki/assets/`);
	const generalMediaFiles = await readDir(generalMediaFilesPath);

	for (const file of generalMediaFiles) {
		if (file.endsWith(`.md`)) { // Ignore markdown files
			continue;
		}

		media.push(`${publicURLToGeneralMediaFiles}${file}`);
	}

	if (!locale) {
		// If locale is not specified, return general media files
		return media;
	}

	let locales = [locale]; // Array of locales
	if (locale === 'everyLocale') { // If locale is 'everyLocale', return media files for every locale
		locales = (await getLocales()).map(locale => locale.code);
	}

	for (const locale of locales) {
		const publicURLToTranslatedMediaFiles = `/wiki/${locale}/`; // URL to translated media files

		const localeMediaFilesPath = await path.join(process.cwd(), `/public/wiki/${locale}/`);
		const localeMediaFiles = await readDir(localeMediaFilesPath);

		for (const file of localeMediaFiles) {
			if (file.endsWith(`.md`)) { // Ignore markdown files
				continue;
			}

			media.push(`${publicURLToTranslatedMediaFiles}${file}`);
		}
	}

	return media;
}

/**
 * Reads directory and returns all files
 * @param {string} dirPath path to directory
 * @returns {string[]} array of files
 */
async function readDir(dirPath: string): Promise<string[]> {
	if (!await fs.existsSync(dirPath) && !await fs.lstatSync(dirPath).isDirectory()) {
		return [];
	}

	return await fs.readdirSync(dirPath);
}