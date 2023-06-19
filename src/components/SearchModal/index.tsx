import { Card, CardBody, CardHeader, HStack, Heading, IconButton, Input, InputGroup, InputLeftElement, LinkBox, LinkOverlay, Modal, ModalBody, ModalContent, ModalHeader, ModalOverlay, UseDisclosureReturn, VStack } from '@chakra-ui/react';
import NextLink from 'next/link';
import { MdClose, MdSearch } from 'react-icons/md';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { getArticles } from '@/_lib/articles';

interface SearchResults {
	title: string;
	href: string;
	description: string;
}

export default function HeaderSearch(props: UseDisclosureReturn) {
	const [search, setSearch] = useState('');
	const [results, setResults] = useState<SearchResults[]>([]);
	const t = useTranslations('SearchModal');
	const locale = useLocale();

	useEffect(() => {
		fetchArticles();
	}, []);

	const fetchArticles = async () => {
		const articles = await getArticles(locale);
		setResults(articles
			.slice(0, 5)
			.map((article) => ({
				title: article.metadata.name as string,
				href: `/articles/${article.metadata.slug}`,
				description: 'Test'
			})));
	};

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
							{results.map((item) => (
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