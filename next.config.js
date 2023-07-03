const withPWA = require('@ducanh2912/next-pwa').default({
	register: process.env.NODE_ENV !== 'development',
	disable: process.env.NODE_ENV === 'development',
	skipWaiting: true,
	dest: 'public',
	sw: 'serviceWorker.js',
	publicExcludes: ['!wiki/**/*'],
	workboxOptions: {
		additionalManifestEntries: [
			{ url: '/offline', revision: null },
		],
		importScripts: ['/articlesSW.js'],
		runtimeCaching: [
			{
				urlPattern: /assets\/.*|favicon\.ico/i, // static assets
				handler: 'StaleWhileRevalidate',
				options: {
					cacheName: 'static-assets'
				}
			},
			{
				urlPattern: /\/.*/i,
				handler: 'NetworkOnly',
				options: {
					precacheFallback: {
						fallbackURL: '/offline',
					}
				}
			},
		]
	}
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {
		serverActions: true,
	}
};

module.exports = withPWA(nextConfig);
