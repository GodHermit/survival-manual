import embedMedia from '@/_helpers/embedMedia';
import { ArticleMetadata } from '@/_store/slices/articlesSlice';
import { downloadZip } from 'client-zip';
import { Metadata } from 'next';
import { remark } from 'remark';
import remarkExtractFrontmatter from 'remark-extract-frontmatter';
import remarkFrontmatter from 'remark-frontmatter';
import html from 'remark-html';
import { VFile } from 'vfile';
import { ExportOptions, downloadFile } from '.';
const yaml = require('yaml').parse;

interface ParseOptions {
	embeddedMedia: boolean;
	useRelativePath?: boolean;
	pathReplace?: string;
}

/**
 * Parse markdown to HTML
 * @param markdown input markdown
 * @param embeddedMedia option to embed media files in the HTML
 * @returns VFile with the HTML content
 */
async function parseMarkdownToHTML(markdown: string, options: ParseOptions): Promise<VFile> {
	return await remark() // Process markdown
		.use(remarkFrontmatter, ['yaml']) // Extract frontmatter
		.use(remarkExtractFrontmatter, yaml) // Parse frontmatter
		.use(embedMedia, {
			embeddedMedia: options.embeddedMedia,
			useRelativePath: options.useRelativePath,
			pathReplace: options.pathReplace
		})
		.use(html, { sanitize: false })
		.process(markdown); // Process file contents
}

/**
 * Create an HTML file
 * @param HTMLString HTML content
 * @param metadata metadata of the file
 * @returns Blob HTML file
 */
function toHTMLFile(HTMLString: string, metadata: Metadata): Blob {
	const content = (
		`<html>
			<head>
				<title>${metadata.title}</title>
				<meta charset='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1.0' />
				${metadata.description ? `<meta name='description' content='${metadata.description}' />` : ''}
			</head>
			<body>
				${HTMLString}
			</body>
		</html>`
	)
		.replaceAll('\t', '') // Remove tabs
		.replaceAll('\n', ''); // Remove new lines

	return new Blob([content], { type: 'text/html' });
}

/**
 * Export the current article as HTML
 * @param markdown input markdown
 * @param options export options
 */
export async function exportCurrentArticleAsHTML(markdown: string, options: ExportOptions) {
	const fileContent = await parseMarkdownToHTML(markdown, {
		embeddedMedia: options.embeddedMedia
	}); // Parse markdown to HTML
	const articleMetadata = Object.assign(fileContent.data) as ArticleMetadata; // Get article metadata
	const file = toHTMLFile( // Create HTML file
		fileContent.toString(),
		{
			title: articleMetadata.name,
			description: articleMetadata.description,
		}
	);
	const filename = options.filename?.replace(
		options.filename?.split('.').slice(-1)[0],
		''
	);
	downloadFile(file, `${filename}html`); // Download file
	options.callback?.(); // Call callback
}

/**
 * Export all articles as on HTML file
 * @param articles list of articles
 * @param options export options
 */
export async function exportAllArticlesAsHTML(articles: ArticleMetadata[], options: ExportOptions) {
	let HTMLString = '';
	for (const article of articles) {
		const res = await fetch(`/wiki/${options.locale}/${article.filename}`);
		const markdown = await res.text();

		const fileContent = await parseMarkdownToHTML(markdown, {
			embeddedMedia: options.embeddedMedia
		}); // Parse markdown to HTML
		HTMLString += fileContent.toString(); // Add HTML to the string
	}

	const t = options.translator; // Get translator from options

	const file = toHTMLFile( // Create HTML file
		HTMLString,
		{
			title: t('title'),
			description: t('metadata.description'),
		}
	);

	downloadFile(
		file,
		`${t('title')}.html`
	);
	options.callback?.(); // Call callback
}

/**
 * Export all articles as a zip file with each article as a separate HTML file
 * @param articles list of articles
 * @param options export options
 */
export async function exportAllArticlesSeparatedAsHTML(articles: ArticleMetadata[], options: ExportOptions) {
	interface FileInZip {
		name: string,
		lastModified?: Date,
		input?: Blob
	}

	const res = await fetch(`/api/articlesMedia?locale=${options.locale}`);
	if (!res.ok) throw new Error('Failed to fetch articles media');
	const articlesMedia: string[] = await res.json();

	let files: FileInZip[] = []; // Create array of files to be zipped

	if (articlesMedia.length > 0) {
		files.push({ // Add assets folder
			name: 'assets/',
		});

		articlesMedia // Add general assets
			.forEach(async media => {
				const res = await fetch(media);
				if (!res.ok) throw new Error('Failed to fetch media');

				const file = await res.blob();

				files.push({ // Add asset
					name: media
						.replace('/wiki/assets/', 'assets/')
						.replace(`/wiki/${options.locale}/`, 'assets/'),
					lastModified: new Date(),
					input: file
				});
			});
	}

	for (const article of articles) {
		const res = await fetch(`/wiki/${options.locale}/${article.filename}`);
		const markdown = await res.text();

		const fileContent = await parseMarkdownToHTML(markdown, {
			embeddedMedia: false,
			useRelativePath: true,
			pathReplace: 'assets/'
		}); // Parse markdown to HTML
		const file = toHTMLFile( // Create HTML file
			fileContent.toString(),
			{
				title: article.name,
				description: article.description,
			}
		);

		if (!article.filename) {
			continue;
		}

		const filename = article.filename
			.replace(
				article.filename.split('.').slice(-1)[0],
				''
			);

		files.push({
			name: `${filename}html`,
			lastModified: new Date(),
			input: file
		});
	}

	const zipFile = await downloadZip(files).blob();

	const t = options.translator; // Get translator from options

	downloadFile(
		zipFile,
		`${t('title')}.zip`
	);
	options.callback?.(); // Call callback
}
