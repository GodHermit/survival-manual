'use client'

import store, { preloadedState } from '@/_store';
import theme from '@/_theme';
import { customStorageManager } from '@/_theme/customStorageManager';
import SWUpdate from '@/components/SWUpdate';
import { CacheProvider } from '@chakra-ui/next-js';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { Provider } from 'react-redux';

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