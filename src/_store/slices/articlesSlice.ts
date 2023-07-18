import { createSlice } from '@reduxjs/toolkit';

export interface ArticleMetadata {
	name: string;
	description?: string;
	icon: string;
	slug: string;
	filename?: string;
}

export interface ArticlesState {
	isLoading: boolean;
	articlesMetadata: ArticleMetadata[];
}

interface SettingsAction {
	payload: Partial<ArticlesState>;
}

export const initialArticlesState: ArticlesState = {
	isLoading: true,
	articlesMetadata: []
};

export const articlesSlice = createSlice({
	name: 'articles',
	initialState: initialArticlesState,
	reducers: {
		setArticlesState: (state, action: SettingsAction): ArticlesState => {
			return { ...state, ...action.payload };
		}
	}
});

export const fetchArticlesMetadata = async (locale: string): Promise<ArticleMetadata[]> => {
	try {
		const res = await fetch(`/api/articles?locale=${locale}&metadataOnly=true`, {
			headers: {
				'Accept': 'application/json'
			}
		});

		if (!res.ok) {
			throw new Error(res.statusText);
		}

		const articlesMetadata = await res.json();

		return articlesMetadata;
	} catch (error) {
		return [];
	}
};

export const { setArticlesState } = articlesSlice.actions;

export const selectArticlesState = (state: { articles: ArticlesState }) => state.articles;

export default articlesSlice.reducer;