import { Providers } from './providers'

export const metadata = {
	title: 'Довідник по виживанню',
	description: '',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="uk">
			<body>
				<Providers>
					{children}
				</Providers>
			</body>
		</html>
	)
}
