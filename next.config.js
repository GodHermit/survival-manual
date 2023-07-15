const withPWA = require('@ducanh2912/next-pwa').default({
	register: process.env.NODE_ENV !== 'development',
	disable: process.env.NODE_ENV === 'development',
	dest: 'public',
	sw: 'serviceWorker.js',
	publicExcludes: ['!wiki/**/*'],
	cacheStartUrl: false,
	dynamicStartUrl: false,
	workboxOptions: {
		skipWaiting: false,
		additionalManifestEntries: [
			{ url: '/offline', revision: null },
		],
		importScripts: ['/articlesSW.js'],
		runtimeCaching: [
			{
				urlPattern: ({ url: { pathname }, sameOrigin }) => // /manifest.json?locale=...
					sameOrigin && (
						pathname.startsWith('/manifest.json')
					),
				handler: 'NetworkFirst',
				options: {
					cacheName: 'manifest'
				}
			},
			{
				urlPattern: ({ url: { pathname }, sameOrigin }) => // static assets, /favicon.ico
					sameOrigin && (
						pathname.startsWith('/assets/') ||
						pathname.startsWith('/favicon.ico')
					),
				handler: 'StaleWhileRevalidate',
				options: {
					cacheName: 'static-assets'
				}
			},
			{
				urlPattern: /\/.*/i, // everything else
				handler: 'NetworkOnly',
				options: {
					precacheFallback: {
						fallbackURL: '/offline',
					}
				}
			}
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
