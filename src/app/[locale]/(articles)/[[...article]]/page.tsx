import { getArticleByFilename } from '@/_lib/articles';
import HtmlToChakra from '@/components/HtmlToChakra';

export default async function ArticlePage({ params }: { params: { article: string, locale: string } }) {
	const article = await getArticleByFilename(params.article || 'introduction', params.locale);

	return (
		<>
			{<HtmlToChakra dangerouslySetInnerHTML={article.contentHtml} />}
		</>
	);
}