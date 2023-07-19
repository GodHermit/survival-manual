import embedMedia from '@/_helpers/embedMedia';
import { ArticleMetadata } from '@/_store/slices/articlesSlice';
import { downloadZip } from 'client-zip';
import { remark } from 'remark';
import remarkExtractFrontmatter from 'remark-extract-frontmatter';
import remarkFrontmatter from 'remark-frontmatter';
import { VFile } from 'vfile';
import { ExportOptions, downloadFile } from '.';
const yaml = require('yaml').parse;

interface ParseOptions {
	embeddedMedia: boolean;
	useRelativePath?: boolean;
	pathReplace?: string;
}

/**
 * Parse markdown
 * @param markdown input markdown 
 * @param options options for parsing
 * @returns parsed markdown
 */
async function parseMarkdown(markdown: string, options: ParseOptions): Promise<VFile> {
	return await remark() // Process markdown
		.use(remarkFrontmatter, ['yaml']) // Extract frontmatter
		.use(remarkExtractFrontmatter, {
			yaml: yaml,
			remove: true
		}) // Parse frontmatter
		.use(embedMedia, {
			embeddedMedia: options.embeddedMedia,
			useRelativePath: options.useRelativePath,
			pathReplace: options.pathReplace
		})
		.process(markdown); // Process file contents
}

/**
 * Export current article as markdown
 * @param markdown input markdown
 * @param options export options
 */
export async function exportCurrentArticleAsMarkdown(markdown: string, options: ExportOptions) {
	const fileContent = await parseMarkdown(markdown, {
		embeddedMedia: options.embeddedMedia
	}); // Parse markdown to HTML

	downloadFile(
		new Blob([fileContent.toString()], { type: 'text/markdown' }),
		`${options.filename}`
	);
	options.callback?.();
}

/**
 * Export all articles as one markdown file
 * @param articles list of articles
 * @param options export options
 */
export async function exportAllArticlesAsMarkdown(articles: ArticleMetadata[], options: ExportOptions) {
	let markdownString = '';
	for (let i = 0; i < articles.length; i++) {
		const article = articles[i];
		const res = await fetch(`/wiki/${options.locale}/${article.filename}`);
		const markdown = await res.text();

		const fileContent = await parseMarkdown(markdown, {
			embeddedMedia: options.embeddedMedia,
		}); // Parse markdown to HTML
		markdownString += fileContent.toString(); // Add HTML to the string
		markdownString += (i < articles.length - 1) ? '\n' : ''; // Add a new line between articles
	}

	const t = options.translator; // Get translator from options

	downloadFile(
		new Blob([markdownString], { type: 'text/markdown' }),
		`${t('title')}.md`
	);
	options.callback?.();
}

/**
 * Export all articles as a zip file with each article as a separate Markdown file
 * @param articles list of articles
 * @param options export options
 */
export async function exportAllArticlesSeparatedAsMarkdown(articles: ArticleMetadata[], options: ExportOptions) {
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

		const fileContent = await parseMarkdown(markdown, {
			embeddedMedia: false,
			useRelativePath: true,
			pathReplace: 'assets/'
		}); // Parse markdown
		const file = new Blob([fileContent.toString()], { type: 'text/markdown' }); // Create file

		files.push({
			name: `${article.filename}`,
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