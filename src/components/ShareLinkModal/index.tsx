import getURL from '@/_helpers/getURL';
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, UseDisclosureReturn, useClipboard, useColorModeValue, useToast } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import { useQRCode } from 'next-qrcode';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { MdLink } from 'react-icons/md';

export default function ShareLinkModal(props: UseDisclosureReturn) {
	const pathname = usePathname();
	const { onCopy, value, setValue, hasCopied } = useClipboard('');
	const toast = useToast();
	const { SVG } = useQRCode();
	const t = useTranslations('ShareLinkModal');
	const QRColor = useColorModeValue({
		light: '#fff',
		dark: '#000'
	}, {
		light: 'grey.800',
		dark: '#fff'
	});

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
			isCentered
		>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>{t('title')}</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					<SVG
						text={value}
						options={{
							color: QRColor
						}}
					/>
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