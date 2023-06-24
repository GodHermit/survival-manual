import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

export interface ArticleMetadata {
	name: string;
	icon: string;
	slug: string;
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

export const fetchArticlesMetadata = async (locale: string) => {
	try {
		const articlesMetadata = await axios.post('/api/articles', {
			locale,
			metadataOnly: true
		}).then(res => res.data) as ArticleMetadata[];

		return articlesMetadata;
	} catch (error) {
		return [];
	}
}

export const { setArticlesState } = articlesSlice.actions;

export const selectArticlesState = (state: { articles: ArticlesState }) => state.articles;

export default articlesSlice.reducer;