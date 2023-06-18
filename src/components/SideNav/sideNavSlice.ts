import { createSlice } from '@reduxjs/toolkit';

interface SideNavState {
	isOpen: boolean;
}

interface SideNavAction {
	payload: Partial<{
		isOpen: boolean;
	}>;
}

const initialState: SideNavState = {
	isOpen: false,
};

export const sideNavSlice = createSlice({
	name: 'sideNav',
	initialState,
	reducers: {
		setSideNav: (state, action: SideNavAction): SideNavState => ({
			...state,
			isOpen: action.payload?.isOpen ?? state.isOpen,
		}),
		toggleSideNav: (state): SideNavState => ({
			...state,
			isOpen: !state.isOpen,
		})
	}
});

export const { setSideNav, toggleSideNav } = sideNavSlice.actions;

export const selectSideNavState = (state: { sideNav: SideNavState }) => state.sideNav;

export default sideNavSlice.reducer;