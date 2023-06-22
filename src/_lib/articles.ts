'use server';

import { ArticleMetadata } from '@/_helpers/articlesSlice';
import { notFound } from 'next/navigation';
import path from 'path';
import { remark } from 'remark';
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkFrontmatter from 'remark-frontmatter';
import html from 'remark-html';

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

export async function getArticlesMetadata(locale: string = 'en') {
	const dirPath = await path.join(process.cwd(), `/public/wiki/${locale}/`);
	if (!await fs.existsSync(dirPath)) {
		return [];
	}

	const files = await fs.readdirSync(dirPath);

	const articles: ArticleMetadata[] = [];

	for (const file of files) {
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
