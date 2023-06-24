'use client'

import theme from '@/_theme';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import store, { preloadedState } from './store';

export function Providers({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<ColorModeScript />
			<Provider store={store} serverState={preloadedState}>
				<CacheProvider>
					<ChakraProvider theme={theme}>
						{children}
					</ChakraProvider>
				</CacheProvider>
			</Provider>
		</>
	)
}