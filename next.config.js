const withPWA = require('@ducanh2912/next-pwa').default({
	register: process.env.NODE_ENV !== 'development',
	disable: process.env.NODE_ENV === 'development',
	skipWaiting: true,
	dest: 'public',
	sw: 'serviceWorker.js',
	publicExcludes: ['!wiki/**/*'],
	cacheStartUrl: false,
	dynamicStartUrl: false,
	fallbacks: {
		document: '/offline',
	},
	workboxOptions: {
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
					cacheName: 'manifest',
					expiration: {
						maxEntries: 1
					},
					matchOptions: {
						ignoreSearch: true
					}
				}
			},
			{
				urlPattern: ({ url: { pathname }, sameOrigin }) => // static assets, /favicon.ico
					sameOrigin && (
						pathname.startsWith('/assets/')
						|| pathname.startsWith('/favicon.ico')
					),
				handler: 'StaleWhileRevalidate',
				options: {
					cacheName: 'static-assets'
				}
			},
			{
				urlPattern: /\/.*/i, // everything else
				handler: 'NetworkOnly'
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
