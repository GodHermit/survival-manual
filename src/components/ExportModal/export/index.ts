import { isLocaleSupported } from '@/_lib/locales';
import { ArticleMetadata } from '@/_store/slices/articlesSlice';
import { useTranslations } from 'next-intl';
import { exportAllArticlesAsHTML, exportAllArticlesSeparatedAsHTML, exportCurrentArticleAsHTML } from './exportHTML';
import { exportAllArticlesAsMarkdown, exportAllArticlesSeparatedAsMarkdown, exportCurrentArticleAsMarkdown } from './exportMarkdown';

/**
 * Supported formats of the file
 */
export type ExportFormat = 'html' | 'md' | 'pdf';
/**
 * Supported types of export
 */
export type ExportType = 'current' | 'all-in-one' | 'all-separated';
/**
 * Options for the export
 */
export type ExportOptions = {
	/**
	 * List of articles to export
	 * (if not provided, all articles will be fetched from the server)
	 */
	articles?: ArticleMetadata[];
	/**
	 * Whether to include media files in the exported file or not
	 */
	embeddedMedia: boolean;
	/**
	 * Locale of the exported files
	 */
	locale: string;
	/**
	 * Current article slug
	 * 
	 * (Used only when exporting the current article)
	 */
	currentArticleSlug: string;
	/**
	 * Name of the exported file
	 */
	filename?: string;
	/**
	 * Function to translate messages
	 */
	translator: (namespace: Parameters<typeof useTranslations>[0]) => string;
	/**
	 * Function to be called after the export is done
	 */
	callback?: () => void;
};

/**
 * Download a file
 * @param file blob file to download
 * @param filename name of the file
 */
export function downloadFile(file: Blob, filename: string) {
	const url = URL.createObjectURL(file); // Create a URL for the file
	const link = document.createElement("a"); // Create a link element
	link.href = url; // Set the link href to point to the file
	link.target = '_blank';
	link.download = filename; // Set the download attribute to the file name
	link.click(); // Actually download the file using the link element
	link.remove(); // Remove the link element
}

export async function exportArticles(type: ExportType, format: ExportFormat, options: ExportOptions) {
	// If the locale is not supported
	if (!isLocaleSupported(options.locale)) {
		throw new Error(`Locale ${options.locale} is not supported`);
	}

	let articles = options.articles;

	// If the articles are not provided, fetch them from the server
	if (!options.articles) {
		const res = await fetch(`/api/articles?locales=${options.locale}&metadataOnly=true`);
		if (!res.ok) {
			throw new Error('NOT_FOUND');
		}

		articles = await res.json();
	}

	if (!articles || articles.length <= 0) {
		throw new Error('NOTHING_TO_EXPORT');
	}

	switch (type) {
		case 'current':
			const currentArticle = articles.find(article => article.slug === options.currentArticleSlug);
			if (!currentArticle) {
				throw new Error('NOT_FOUND');
			}

			options = { // Set the filename to the current article's filename
				...options,
				filename: currentArticle.filename
			};

			await exportCurrentArticle(currentArticle, format, options);
			break;
		case 'all-in-one':
			exportAllArticles(articles, format, options);
			break;
		case 'all-separated':
			exportAllArticlesSeparated(articles, format, options);
			break;
		default:
			throw new Error(`Unknown export type: ${type}`);
	}
}

async function exportCurrentArticle(articleMetadata: ArticleMetadata, format: ExportFormat, options: ExportOptions) {
	const res = await fetch(`/wiki/${options.locale}/${articleMetadata.filename}`);
	const markdown = await res.text();

	switch (format) {
		case 'html':
			exportCurrentArticleAsHTML(markdown, options);
			break;
		case 'md':
			exportCurrentArticleAsMarkdown(markdown, options);
			break;
		case 'pdf':
			throw new Error('NOT_IMPLEMENTED');
			break;
		default:
			throw new Error(`Unknown export format: ${format}`);
	}
}

function exportAllArticles(articles: ArticleMetadata[], format: ExportFormat, options: ExportOptions) {
	switch (format) {
		case 'html':
			exportAllArticlesAsHTML(articles, options);
			break;
		case 'md':
			exportAllArticlesAsMarkdown(articles, options);
			break;
		case 'pdf':
			throw new Error('NOT_IMPLEMENTED');
			break;
		default:
			throw new Error(`Unknown export format: ${format}`);
	}
}

function exportAllArticlesSeparated(articles: ArticleMetadata[], format: ExportFormat, options: ExportOptions) {
	switch (format) {
		case 'html':
			exportAllArticlesSeparatedAsHTML(articles, options);
			break;
		case 'md':
			exportAllArticlesSeparatedAsMarkdown(articles, options);
			break;
		case 'pdf':
			throw new Error('NOT_IMPLEMENTED');
			break;
		default:
			throw new Error(`Unknown export format: ${format}`);
	}
}

