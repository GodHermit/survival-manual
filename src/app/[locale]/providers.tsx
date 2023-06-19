'use client'

import theme from '@/_theme';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import store from './store';

export function Providers({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<ColorModeScript />
			<Provider store={store}>
				<CacheProvider>
					<ChakraProvider theme={theme}>
						{children}
					</ChakraProvider>
				</CacheProvider>
			</Provider>
		</>
	)
}