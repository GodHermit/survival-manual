import { getArticleBySlug } from '@/_lib/articles';
import HtmlToChakra from '@/components/HtmlToChakra';

export default async function ArticlePage({ params }: { params: { article: string, locale: string } }) {
	const slug = params.article ? `/${params.article[0]}` : '/';
	const article = await getArticleBySlug(slug, params.locale);

	return (
		<>
			{<HtmlToChakra dangerouslySetInnerHTML={article.contentHtml} />}
		</>
	);
}