import getURL from '@/_helpers/getURL';
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, UseDisclosureReturn, useClipboard, useToast } from '@chakra-ui/react';
import { useQRCode } from 'next-qrcode';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { MdLink } from 'react-icons/md';
import { useTranslations } from 'next-intl';

export default function ShareLinkModal(props: UseDisclosureReturn) {
	const pathname = usePathname();
	const { onCopy, value, setValue, hasCopied } = useClipboard('');
	const toast = useToast();
	const { SVG } = useQRCode();
	const t = useTranslations('ShareLinkModal');

	useEffect(() => {
		setValue(getURL(pathname));
	}, [pathname, setValue]);

	const handleOnCopy = () => {
		try {
			onCopy();
			toast({
				position: 'top',
				status: 'success',
				title: t('copySuccess'),
			});
		} catch (error) {
			toast({
				position: 'top',
				status: 'error',
				title: t('copyError'),
			});
		}
	};

	return (
		<Modal
			isOpen={props.isOpen}
			onClose={props.onClose}
			size={{
				base: 'xs',
				md: 'md',
			}}
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t('title')}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<SVG text={value} />
					<Input
						type='url'
						value={value}
						readOnly
					/>
				</ModalBody>
				<ModalFooter
					display='flex'
					justifyContent='space-between'
				>
					<Button
						leftIcon={<MdLink />}
						onClick={handleOnCopy}
						isDisabled={hasCopied}
					>
						{hasCopied ? t('copyButtonSuccess') : t('copyButton')}
					</Button>
					<Button colorScheme='blue' onClick={props.onClose}>{t('doneButton')}</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}