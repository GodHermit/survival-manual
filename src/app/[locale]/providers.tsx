'use client'

import theme from '@/_theme';
import { customStorageManager } from '@/_theme/customStorageManager';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import store, { preloadedState } from './store';
import SWUpdate from '@/components/SWUpdate';

export function Providers({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<ColorModeScript storageKey='settings.colorMode' />
			<Provider store={store} serverState={preloadedState}>
				<CacheProvider>
					<ChakraProvider theme={theme} colorModeManager={customStorageManager}>
						{children}
						<SWUpdate />
					</ChakraProvider>
				</CacheProvider>
			</Provider>
		</>
	)
}