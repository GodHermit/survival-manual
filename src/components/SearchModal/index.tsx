import { selectArticlesState } from '@/_store/slices/articlesSlice';
import { Card, CardBody, CardHeader, HStack, Heading, IconButton, Input, InputGroup, InputLeftElement, LinkBox, LinkOverlay, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, Text, UseDisclosureReturn, VStack } from '@chakra-ui/react';
import { useTranslations } from 'next-intl';
import NextLink from 'next-intl/link';
import { useState } from 'react';
import { MdClose, MdSearch } from 'react-icons/md';
import { useSelector } from 'react-redux';

interface SearchResults {
	title: string;
	href: string;
	description: string;
}

export default function HeaderSearch(props: UseDisclosureReturn) {
	const [search, setSearch] = useState('');
	const t = useTranslations('SearchModal');
	const articlesState = useSelector(selectArticlesState);

	const results: SearchResults[] = articlesState.articlesMetadata
		.slice(0, 5)
		.map((article) => ({
			title: article.name as string,
			href: `${article.slug}`,
			description: 'Test'
		}));

	return (
		<>
			<Modal
				isOpen={props.isOpen}
				onClose={props.onClose}
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
									placeholder={t('placeholder')}
									size='lg'
								/>
							</InputGroup>
							<IconButton
								icon={<MdClose />}
								aria-label={t('cancel')}
								size='lg'
								onClick={props.onClose}
							/>
						</HStack>
					</ModalHeader>
					<ModalBody pl={4} pr={4} pb={4}>
						<VStack spacing={2}>
							{results.length <= 0 && (
								<Text as='b'>
									{t('noResults')}
								</Text>
							)}
							{results.length > 0 && results.map((item) => (
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
										onClick={props.onClose}
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