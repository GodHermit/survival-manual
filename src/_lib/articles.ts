'use server';

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

/**
 * Returns all articles for the specified locale from the public/wiki directory
 * @param locale locale to get articles for (default: 'en')
 * @returns array of articles
 */
export async function getArticles(locale: string = 'en') {
	const dirPath = await path.join(process.cwd(), `/public/wiki/${locale}/`);
	if (!await fs.existsSync(dirPath)) {
		return [];
	}

	const files = await fs.readdirSync(dirPath) // Get all files in the directory
		.filter((file: string) => (
			fs.statSync(path.join(dirPath, file)).isFile() // Get files only
			&& file.endsWith(`.md`) // Get markdown files only
			&& !new RegExp( // Ignore files with reserved names
				RESERVED_ARTICLE_NAMES.map(name => `${name.toLowerCase()}`).join(`|`)
			).test(file.toLowerCase())
		))
		.sort((a: string, b: string) => { // Sort files by number in the beginning of the filename
			const aNumber = parseInt(a.split('.')[0]);
			const bNumber = parseInt(b.split('.')[0]);

			if (aNumber && bNumber) { // If both files have numbers in the beginning of the filename
				return aNumber - bNumber; // Sort by number (ascending)
			}

			return 0; // Otherwise, don't sort
		});

	const articles = [];

	for (const file of files) {
		const fullPath = await path.join(dirPath, file); // Get full path to the file
		const fileContents = fs.readFileSync(fullPath, 'utf8'); // Read file contents
		const processedContent = await remark() // Process markdown
			.use(remarkFrontmatter, ['yaml']) // Extract frontmatter
			.use(remarkExtractFrontmatter, yaml) // Parse frontmatter
			.use(html) // Convert markdown to HTML
			.process(fileContents); // Process file contents
		const metadata = processedContent.data; // Get metadata
		const contentHtml = processedContent.toString(); // Get HTML
		articles.push({ metadata, contentHtml }); // Add article to the array
	}

	return articles;
}

/**
 * Returns all articles metadata for the specified locale from the public/wiki directory
 * @param locale locale to get articles metadata for (default: 'en')
 * @returns array of articles metadata
 */
export async function getArticlesMetadata(locale: string = 'en') {
	const articles = await getArticles(locale);

	return articles
		.map(article => article.metadata) // Get metadata
		.filter(metadata => Object.values(metadata).length > 0); // Ignore articles without metadata
}

/**
 * Searches for articles by the URL Slug
 * @param slug URL Slug
 * @param locale locale to search articles in (default: 'en')
 * @returns article
 */
export async function getArticleBySlug(slug: string, locale: string = 'en') {
	const articles = await getArticles(locale);

	if (articles.length <= 0) {
		return notFound();
	}

	const article = articles.find(article => article.metadata.slug === slug);

	if (!article) {
		return notFound();
	}

	return article;
}

/**
 * Returns all articles media files
 * @param {string} locale if specified, returns general media files + translated media files
 * @returns array of media files
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