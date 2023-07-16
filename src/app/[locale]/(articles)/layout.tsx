'use client';

import useNetworkStatus from '@/_hooks/useNetworkStatus';
import { fetchArticlesMetadata, setArticlesState } from '@/_store/slices/articlesSlice';
import { selectSettingsState } from '@/_store/slices/settingsSlice';
import Header from '@/components/Header';
import SideNav from '@/components/SideNav';
import { Alert, AlertIcon, AlertTitle, Box, Grid, GridItem, useBreakpoint, useColorModeValue } from '@chakra-ui/react';
import { useLocale } from 'next-intl';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function ArticlesLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const breakpoint = useBreakpoint();
	const mainBg = useColorModeValue('gray.100', 'gray.700');
	const mainContentBg = useColorModeValue('white', 'gray.800');
	const settings = useSelector(selectSettingsState);
	const dispatch = useDispatch();
	const locale = useLocale();
	const isOnline = useNetworkStatus();

	useEffect(() => {
		dispatch(setArticlesState({ isLoading: true }));
		fetchArticlesMetadata(locale)
			.then(articlesMetadata => {
				dispatch(setArticlesState({ articlesMetadata, isLoading: false }));
			});
	}, [locale, dispatch]);

	return (
		<>
			<style jsx global>{`
				html, body {
					font-size: var(--chakra-fontSizes-${settings.fontSize == 'base' ? 'md' : settings.fontSize});
				}
			`}</style>
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
					position='relative'
					area='main'
					bg={mainBg}
					borderTopLeftRadius={{
						base: 0,
						md: 'md'
					}}
					p={{
						base: 4,
						md: 8
					}}
					pt={!isOnline ? {
						base: 'calc(var(--chakra-space-4) + 48px)',
						md: 'calc(var(--chakra-space-8) + 48px)'
					} : undefined}
					overflow='auto'
				>
					{!isOnline && (
						<Alert
							status='error'
							variant='solid'
							position='absolute'
							top={0}
							left={0}
						>
							<AlertIcon />
							<AlertTitle>Offline!</AlertTitle>
						</Alert>
					)}
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
