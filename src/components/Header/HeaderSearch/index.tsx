import { Card, CardBody, CardHeader, HStack, Heading, IconButton, Input, InputGroup, InputLeftElement, LinkBox, LinkOverlay, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, VStack, useDisclosure } from '@chakra-ui/react';
import NextLink from 'next/link';
import { MdClose, MdSearch } from 'react-icons/md';

const items = [{ // TODO: Replace with real data
	title: 'Знайомство',
	href: '/',
	description: 'Уривок контенту 1'
}, {
	title: 'Вогонь',
	href: '/fire',
	description: 'Уривок контенту 2'
}, {
	title: 'Вода',
	href: '/water',
	description: 'Уривок контенту 3'
}];

export default function HeaderSearch() {
	const { isOpen, onOpen, onClose } = useDisclosure();

	return (
		<>
			<IconButton
				aria-label='Search'
				icon={<MdSearch />}
				onClick={onOpen}
			/>
			<Modal
				isOpen={isOpen}
				onClose={onClose}
				size={{
					base: 'xs',
					sm: 'sm',
					md: 'lg'
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader pl={4} pr={4}>
						<HStack spacing={2}>
							<InputGroup size='lg'>
								<InputLeftElement pointerEvents='none'>
									<MdSearch />
								</InputLeftElement>
								<Input
									variant='filled'
									placeholder='Пошук...'
									size='lg'
								/>
							</InputGroup>
							<IconButton
								icon={<MdClose />}
								aria-label='Скасувати'
								size='lg'
								onClick={onClose}
							/>
						</HStack>
					</ModalHeader>
					<ModalBody pl={4} pr={4} pb={4}>
						<VStack spacing={2}>
							{items.map((item) => (
								<LinkBox
									as={Card}
									key={item.href}
									w='100%'
									size='sm'
									variant='filled'
								>
									<LinkOverlay
										as={NextLink}
										href={item.href || ''}
										onClick={onClose}
									>
										<CardHeader pb={1}>
											<Heading size='sm'>
												{item.title}
											</Heading>
										</CardHeader>
										<CardBody pt={1}>
											{item.description}
										</CardBody>
									</LinkOverlay>
								</LinkBox>
							))}
						</VStack>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
}