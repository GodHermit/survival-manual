
import { selectSideNavState, toggleSideNav } from '@/_store/slices/sideNavSlice';
import { Box, ButtonGroup, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import NextLink from 'next-intl/link';
import { MdMenu, MdMenuOpen, MdSearch, MdSettings } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import HeaderSearch from '../SearchModal';
import HeaderMenu from './HeaderMenu';

export default function Header() {
	const sideNavState = useSelector(selectSideNavState);
	const dispatch = useDispatch();
	const searchDisclosure = useDisclosure();
	const t = useTranslations();

	return (
		<Box
			display='flex'
			alignItems='center'
			p={4}
		>
			<IconButton
				aria-label={t('Header.menu')}
				icon={sideNavState.isOpen ? <MdMenuOpen /> : <MdMenu />}
				onClick={() => dispatch(toggleSideNav())}
			/>
			<Text as='b' ml={4}>{t('title')}</Text>
			<ButtonGroup ml='auto' spacing={2}>
				<IconButton
					aria-label={t('Header.search')}
					icon={<MdSearch />}
					onClick={searchDisclosure.onOpen}
				/>
				<HeaderSearch {...searchDisclosure} />
				<IconButton
					as={NextLink}
					href='/settings'
					aria-label={t('Header.settings')}
					icon={<MdSettings />} /
				>
				<HeaderMenu />
			</ButtonGroup>
		</Box>
	);
}