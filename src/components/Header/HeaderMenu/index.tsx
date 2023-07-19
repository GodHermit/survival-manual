import ExportModal from '@/components/ExportModal';
import ShareLinkModal from '@/components/ShareLinkModal';
import { IconButton, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { MdFileDownload, MdLink, MdMoreVert, MdPrint } from 'react-icons/md';

export default function HeaderMenu() {
	const exportModalDisclosure = useDisclosure();
	const shareLinkDisclosure = useDisclosure();
	const t = useTranslations();

	/**
	 * Keyboard shortcuts
	 */
	useEffect(() => {
		/**
		 * Handle keydown event
		 */
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.ctrlKey && e.key === 's') { // CTRL + S
				e.preventDefault();
				exportModalDisclosure.onOpen(); // Open export modal
			}
		};
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		}
	}, [exportModalDisclosure]);

	return (
		<Menu>
			<MenuButton as={IconButton} aria-label='More options' icon={<MdMoreVert />} />
			<MenuList>
				<MenuItem
					icon={<MdFileDownload />}
					command='CTRL + S'
					onClick={exportModalDisclosure.onOpen}
				>
					{t('Header.export')}
				</MenuItem>
				<ExportModal {...exportModalDisclosure} />
				<MenuItem
					icon={<MdLink />}
					onClick={shareLinkDisclosure.onOpen}
				>
					{t('Header.share')}
				</MenuItem>
				<ShareLinkModal {...shareLinkDisclosure} />
				<MenuItem
					icon={<MdPrint />}
					command='CTRL + P'
					onClick={() => window.print()}
				>
					{t('Header.print')}
				</MenuItem>
			</MenuList>
		</Menu>
	);
}