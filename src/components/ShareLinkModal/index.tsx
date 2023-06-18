import getURL from '@/_helpers/getURL';
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, UseDisclosureReturn, useClipboard, useToast } from '@chakra-ui/react';
import { useQRCode } from 'next-qrcode';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { MdLink } from 'react-icons/md';

export default function ShareLinkModal(props: UseDisclosureReturn) {
	const pathname = usePathname();
	const { onCopy, value, setValue, hasCopied } = useClipboard('');
	const toast = useToast();
	const { SVG } = useQRCode();

	useEffect(() => {
		setValue(getURL(pathname));
	}, [pathname, setValue]);


	const handleOnCopy = () => {
		onCopy();
		toast({
			position: 'top',
			status: 'success',
			title: 'Посилання скопійовано',
		});
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
				<ModalHeader>Поділитися посиланням</ModalHeader>
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
						{hasCopied ? 'Скопійовано' : 'Копіювати'}
					</Button>
					<Button colorScheme='blue' onClick={props.onClose}>Готово</Button>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
}