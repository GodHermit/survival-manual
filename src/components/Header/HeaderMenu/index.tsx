import ShareLinkModal from '@/components/ShareLinkModal';
import { Kbd, Menu, MenuButton, MenuItem, MenuList, IconButton, useDisclosure } from '@chakra-ui/react';
import { MdFileDownload, MdLink, MdMoreVert, MdPrint } from 'react-icons/md';
import { useTranslations } from 'next-intl';

export default function HeaderMenu() {
	const shareLinkDisclosure = useDisclosure();
	const t = useTranslations();

	return (
		<Menu>
			<MenuButton as={IconButton} aria-label='More options' icon={<MdMoreVert />} />
			<MenuList>
				<MenuItem
					icon={<MdFileDownload />}
					command='CTRL + S'
				>
					{t('Header.export')}
				</MenuItem>
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