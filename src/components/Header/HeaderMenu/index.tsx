import ShareLinkModal from '@/components/ShareLinkModal';
import { Kbd, Menu, MenuButton, MenuItem, MenuList, IconButton, useDisclosure } from '@chakra-ui/react';
import { MdFileDownload, MdLink, MdMoreVert, MdPrint } from 'react-icons/md';

export default function HeaderMenu() {
	const shareLinkDisclosure = useDisclosure();	

	return (
		<Menu>
			<MenuButton as={IconButton} aria-label='More options' icon={<MdMoreVert />} />
			<MenuList>
				<MenuItem
					icon={<MdFileDownload />}
					command={<span><Kbd>CTRL</Kbd> + <Kbd>S</Kbd></span>}
				>
					Експорт
				</MenuItem>
				<MenuItem
					icon={<MdLink />}
					onClick={shareLinkDisclosure.onOpen}
				>
					Поділитися посиланням
				</MenuItem>
				<ShareLinkModal {...shareLinkDisclosure} />
				<MenuItem
					icon={<MdPrint />}
					command={<span><Kbd>CTRL</Kbd> + <Kbd>P</Kbd></span>}
					onClick={() => window.print()}
				>
					Друк
				</MenuItem>
			</MenuList>
		</Menu>
	);
}