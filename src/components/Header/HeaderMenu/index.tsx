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
					command={<span><Kbd>CTRL</Kbd> + <Kbd>S</Kbd></span>}
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
					command={<span><Kbd>CTRL</Kbd> + <Kbd>P</Kbd></span>}
					onClick={() => window.print()}
				>
					{t('Header.print')}
				</MenuItem>
			</MenuList>
		</Menu>
	);
}