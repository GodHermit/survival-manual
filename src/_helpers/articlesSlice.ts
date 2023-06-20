import { createSlice } from '@reduxjs/toolkit';

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

const initialState: ArticlesState = {
	isLoading: true,
	articlesMetadata: []
};

export const articlesSlice = createSlice({
	name: 'articles',
	initialState,
	reducers: {
		setArticlesState: (state, action: SettingsAction): ArticlesState => {
			return { ...state, ...action.payload };
		}
	}
});

export const { setArticlesState } = articlesSlice.actions;

export const selectArticlesState = (state: { articles: ArticlesState }) => state.articles;

export default articlesSlice.reducer;