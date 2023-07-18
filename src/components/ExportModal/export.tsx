import { renderToString } from 'react-dom/server';

import getURL from '@/_helpers/getURL';
import { ArticleMetadata } from '@/_store/slices/articlesSlice';
import { remark } from 'remark';
import remarkExtractFrontmatter from "remark-extract-frontmatter";
import remarkFrontmatter from 'remark-frontmatter';
import html from 'remark-html';
import { visit } from 'unist-util-visit';
const yaml = require('yaml').parse;

/**
 * Supported formats of the file
 */
export type SupportedFormat = 'html' | 'md' | 'pdf';

/**
 * Download a file
 * @param file blob file to download
 * @param filename name of the file
 */
export function downloadFile(file: Blob, filename: string) {
	const url = URL.createObjectURL(file); // Create a URL for the file
	const link = document.createElement("a"); // Create a link element
	link.href = url; // Set the link href to point to the file
	link.download = filename; // Set the download attribute to the file name
	link.click(); // Actually download the file using the link element
}

/**
 * Get HTML from markdown
 * @param markdown markdown content
 * @returns HTML content
 */
async function getHtmlFromMarkdown(markdown: string, embeddedMedia: boolean): Promise<JSX.Element> {
	const processedContent = await remark() // Process markdown
		.use(remarkFrontmatter, ['yaml']) // Extract frontmatter
		.use(remarkExtractFrontmatter, yaml) // Parse frontmatter
		.use(() => {
			return (tree, file, done) => { // Embed images
				let count = 0;
				visit(tree, 'image', (node: any) => { // Count the amount of images
					if (node.url) {
						count++;
					}
				});

				// If there are no images, we can skip the rest
				if (!count) {
					done()
				}

				visit(tree, 'image', (node: any) => {
					// If the settings are set to not embed images, we can skip the rest
					if (!embeddedMedia) {
						node.url = getURL(node.url);

						if (--count === 0) {
							done();
						}
					} else {
						fetch(getURL(node.url))
							.then(res => res.blob())
							.then(blob => {
								const reader = new FileReader();
								reader.addEventListener('load', (e) => {
									node.url = e.target?.result;
									if (--count === 0) {
										done();
									}
								});
								reader.readAsDataURL(blob);
							});
					}
				});
			};
		})
		.use(html, { sanitize: false })
		.process(markdown); // Process file contents

	const metadata = Object.assign(processedContent.data) as ArticleMetadata;

	/* eslint-disable */
	return (
		<html>
			<head>
				<title>{metadata.name}</title>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				{
					metadata.description && (
						<meta name='description' content={metadata.description} />
					)
				}
			</head>
			<body>
				<div dangerouslySetInnerHTML={{ __html: processedContent.toString() }} />
			</body>
		</html>
	);
}

/**
 * Get a file of the article in the specified format
 * @param filename
 * @param format format of the file 
 * @returns blob
 */
export async function getBlob(filename: string, format: SupportedFormat, embeddedMedia: boolean = true) {
	const res = await fetch(`/wiki/en/${filename}`);
	const markdown = await res.text();

	switch (format) {
		case 'html':
			const content = await getHtmlFromMarkdown(markdown, embeddedMedia);
			return new Blob([renderToString(content)], { type: 'text/html' });
		case 'md':
			return new Blob([markdown], { type: 'text/markdown' });
		case 'pdf':
			throw new Error('NOT_IMPLEMENTED');
		default:
			throw new Error('INVALID_FORMAT');
	}
}