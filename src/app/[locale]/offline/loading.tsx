'use client';

import { Center, Spinner } from '@chakra-ui/react';

export default function Loading() {

	return (
		<Center
			minH='100svh'
			maxH='100svh'
		>
			<Spinner />
		</Center>
	);
}