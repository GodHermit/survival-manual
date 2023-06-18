'use client';

import Header from '@/components/Header';
import SideNav from '@/components/SideNav';
import { Box, Grid, GridItem, useBreakpoint } from '@chakra-ui/react';

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const breakpoint = useBreakpoint();

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
					bg='gray.100'
					p={{
						base: 4,
						md: 8
					}}
					overflow='auto'
				>
					<Box
						bg='white'
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
