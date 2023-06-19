import SideNavMenu from '@/components/SideNav/SideNavMenu';
import { Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay } from '@chakra-ui/react';
import { useDispatch, useSelector } from 'react-redux';
import { selectSideNavState, setSideNav } from './sideNavSlice';
import { useTranslations } from 'next-intl';

export default function SideNavMobile() {
	const state = useSelector(selectSideNavState);
	const dispatch = useDispatch();
	const t = useTranslations();

	return (
		<Drawer
			isOpen={state.isOpen}
			placement='left'
			onClose={() => dispatch(setSideNav({ isOpen: false }))}
		>
			<DrawerOverlay />
			<DrawerContent>
				<DrawerCloseButton />
				<DrawerHeader>{t('title')}</DrawerHeader>
				<DrawerBody
					p={2}
				>
					<SideNavMenu />
				</DrawerBody>
			</DrawerContent>
		</Drawer>
	);
}