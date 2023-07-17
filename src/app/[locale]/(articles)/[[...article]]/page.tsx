import getURL from '@/_helpers/getURL';
import { getArticleBySlug } from '@/_lib/articles';
import { isLocaleSupported } from '@/_lib/locales';
import { generateAlternatesFor } from '@/_lib/metadata';
import HtmlToChakra from '@/components/HtmlToChakra';
import { Metadata } from 'next';
import { createTranslator } from 'next-intl';
import { notFound } from 'next/navigation';

interface ArticlePageParams {
	article: string;
	locale: string;
}

export async function generateMetadata({ params }: { params: ArticlePageParams }): Promise<Metadata> {
	if (!isLocaleSupported(params.locale)) {
		notFound();
	}

	const slug = params.article ? `/${params.article[0]}` : '/';
	const article = await getArticleBySlug(slug, params.locale);

	const messages = (await import(`@/_messages/${params.locale}.json`)).default;
	const t = createTranslator({ locale: params.locale, messages });
	const metadata = article.metadata;

	return {
		title: metadata.name as string,
		description: metadata.description as string,
		...generateAlternatesFor(slug, params.locale),
		openGraph: {
			title: metadata.name as string,
			description: metadata.description as string,
			url: getURL(`${params.locale}${slug}`),
			siteName: t('title'),
			locale: params.locale,
		},
		robots: {}
	};
}

export default async function ArticlePage({ params }: { params: ArticlePageParams }) {
	const slug = params.article ? `/${params.article[0]}` : '/';
	const article = await getArticleBySlug(slug, params.locale);

	return (
		<>
			{<HtmlToChakra dangerouslySetInnerHTML={article.contentHtml} />}
		</>
	);
}