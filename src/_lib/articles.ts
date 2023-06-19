'use server';

import path from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import remarkFrontmatter from 'remark-frontmatter';
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import { notFound } from 'next/navigation';

const fs = require('fs');
const yaml = require('yaml').parse;

export async function getArticleByFilename(filename: string, locale: string = 'en') {
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