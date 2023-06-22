'use client';

import { ArticleMetadata, setArticlesState } from '@/_helpers/articlesSlice';
import Header from '@/components/Header';
import SideNav from '@/components/SideNav';
import { Box, Grid, GridItem, useBreakpoint, useColorModeValue } from '@chakra-ui/react';
import axios from 'axios';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const breakpoint = useBreakpoint();
	const mainBg = useColorModeValue('gray.100', 'gray.700');
	const mainContentBg = useColorModeValue('white', 'gray.800');
	const dispatch = useDispatch();
	const locale = useLocale();

	useEffect(() => {
		fetchArticlesMetadata();
	}, []);

	const fetchArticlesMetadata = async () => {
		try {
			const articlesMetadata = await axios.post('/api/articles', {
				locale,
				metadataOnly: true
			}).then(res => res.data) as ArticleMetadata[];

			dispatch(setArticlesState({ articlesMetadata, isLoading: false }));
		} catch (error) {
			dispatch(setArticlesState({ articlesMetadata: [], isLoading: false }));
		}
	};

	return (
		<>
			{(breakpoint === 'base' || breakpoint === 'sm') && (
				<SideNav />
			)}
			<Grid
				templateAreas={{
					base: `"header" "main"`,
					md: `"nav header" "nav main"`
				}}
				gridTemplateRows={'auto 1fr'}
				gridTemplateColumns={{
					base: '1fr',
					md: 'fit-content(300px) 1fr'
				}}
				minH='100svh'
				maxH='100svh'
			>
				{(breakpoint !== 'base' && breakpoint !== 'sm') && (
					<GridItem area='nav'>
						<SideNav />
					</GridItem>
				)}
				<GridItem area='header'>
					<Header />
				</GridItem>
				<GridItem
					area='main'
					bg={mainBg}
					p={{
						base: 4,
						md: 8
					}}
					overflow='auto'
				>
					<Box
						bg={mainContentBg}
						p={{
							base: 4,
							md: 8
						}}
						borderRadius='md'
					>
						{children}
					</Box>
				</GridItem>
			</Grid>
		</>
	)
}
