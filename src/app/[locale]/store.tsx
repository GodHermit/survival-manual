import articlesSlice from '@/_helpers/articlesSlice';
import settingsSlice from '@/_helpers/settingsSlice';
import sideNavSlice from '@/components/SideNav/sideNavSlice';
import { configureStore } from '@reduxjs/toolkit';

export default configureStore({
	reducer: {
		sideNav: sideNavSlice,
		settings: settingsSlice,
		articles: articlesSlice
	}
});