import { getArticleByFilename } from '@/_lib/articles';
import HtmlToChakra from '@/components/HtmlToChakra';

export default async function ArticlePage({ params }: { params: { article: string, locale: string } }) {
	const filename = params.article ? params.article[0] : 'introduction';
	const article = await getArticleByFilename(filename, params.locale);

	return (
		<>
			{<HtmlToChakra dangerouslySetInnerHTML={article.contentHtml} />}
		</>
	);
}