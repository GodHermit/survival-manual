
import { Box, ButtonGroup, IconButton, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { MdMenu, MdMenuOpen, MdSettings } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { selectSideNavState, toggleSideNav } from '../SideNav/sideNavSlice';
import HeaderMenu from './HeaderMenu';
import HeaderSearch from './HeaderSearch';

export default function Header() {
	const sideNavState = useSelector(selectSideNavState);
	const dispatch = useDispatch();

	return (
		<Box
			display='flex'
			alignItems='center'
			p={4}
		>
			<IconButton
				aria-label='Menu'
				icon={sideNavState.isOpen ? <MdMenuOpen /> : <MdMenu />}
				onClick={() => dispatch(toggleSideNav())}
			/>
			<Text as='b' ml={4}>Довідник по виживанню</Text>
			<ButtonGroup ml='auto' spacing={2}>
				<HeaderSearch />
				<IconButton as={NextLink} href='/settings' aria-label='Settings' icon={<MdSettings />} />
				<HeaderMenu />
			</ButtonGroup>
		</Box>
	);
}