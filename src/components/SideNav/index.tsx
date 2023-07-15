import { selectSideNavState, setSideNav } from '@/_store/slices/sideNavSlice';
import SideNavMenu from '@/components/SideNav/SideNavMenu';
import { Box, useBreakpoint, useBreakpointValue } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SideNavMobile from './SideNavMobile';

export default function SideNav() {
	const state = useSelector(selectSideNavState);
	const dispatch = useDispatch();
	const breakpoint = useBreakpoint();
	const preferredIsOpen = useBreakpointValue({
		base: false,
		sm: false,
		md: false,
		lg: true,
	}, {
		fallback: 'base'
	});

	useEffect(() => {
		dispatch(setSideNav({ isOpen: preferredIsOpen }));
	}, [preferredIsOpen, dispatch]);

	return (breakpoint === 'base' || breakpoint === 'sm') ? (
		<SideNavMobile />
	) : (
		<Box
			h='100vh'
			minW={state.isOpen ? '250px' : undefined}
			maxH='100svh'
			p={2}
			overflow='auto'
		>
			<SideNavMenu />
		</Box>
	);
}