'use client';

import { Prose } from '@nikolovlazar/chakra-ui-prose';

export default function HtmlToChakra({ dangerouslySetInnerHTML }: { dangerouslySetInnerHTML: string }) {
	return (
		<Prose>
			<div dangerouslySetInnerHTML={{ __html: dangerouslySetInnerHTML }} />
		</Prose>
	);
}