const toCache = [
	{
		url: '/offline?_rsc',
		cacheName: 'workbox-precache',
		useStartsWith: true,
		options: {
			headers: {
				'Rsc': '1',
			},
			redirect: 'follow'
		}
	},
	{
		url: '/assets/android-chrome-192x192.png',
		cacheName: 'static-assets'
	},
	{
		url: '/assets/android-chrome-512x512.png',
		cacheName: 'static-assets'
	},
	{
		url: '/assets/apple-touch-icon.png',
		cacheName: 'static-assets'
	},
	{
		url: '/favicon.ico',
		cacheName: 'static-assets'
	},
	{
		url: '/assets/favicon-16x16.png',
		cacheName: 'static-assets'
	},
	{
		url: '/assets/favicon-32x32.png',
		cacheName: 'static-assets'
	},
];

self.addEventListener('activate', async (e) => {
	// If browser doesn't support caches
	if (!('caches' in self)) {
		return; // Return error response
	}

	// If network is offline, don't try to cache offline page
	if (!self.navigator.onLine) {
		return;
	}

	const cacheNames = await caches.keys();

	for (let { url, cacheName, useStartsWith, options } of toCache) {

		if (useStartsWith) {
			// Get cache with specified name
			cacheName = cacheNames.filter(name => name.startsWith(cacheName));

			// If there is no cache with specified name
			if (cacheNames.length <= 0) {
				return;
			}
		}

		const cache = await caches.open(cacheName);

		cache.put(url, await fetch(url, options));
	}
});

const ignoreSearchParams = [
	{
		param: 'locale',
		path: '/api/articlesMedia'
	}
]

self.addEventListener('fetch', (e) => {
	if (!e.request.url.startsWith(self.origin)) {
		return;
	}

	const url = e.request.url
		.replace(self.origin, '')
		.replace(/\?_rsc=(.*)/, '?_rsc');

	const urlWithoutParams = url.replace(/\?.*/, '');
	const isRsc = /\?_rsc/.test(url);

	if (/^\/(assets|_next|favicon|manifest).*/i.test(urlWithoutParams)) { // exclude static assets and nextjs files+
		return;
	}

	e.respondWith(
		fetch(e.request, isRsc ? {
			...e.request,
			headers: {
				'Rsc': '1'
			}
		} : {
			...e.request,
		})
			.catch(async () => {
				// If browser doesn't support caches
				if (!('caches' in self)) {
					return Response.error(); // Return error response
				}

				let ignoreSearch = false;

				// For some routes, need to ignore search params
				for (let { param, path } of ignoreSearchParams) { // For each param to ignore
					// If path matches
					if (urlWithoutParams.startsWith(path) && new URL(e.request.url).searchParams.has(param)) {
						// Ignore search params
						ignoreSearch = true;
					}
				}

				// Get cached response
				const res = await caches.match(url, { ignoreSearch });

				// If cached response exists
				if (res) {
					return res;
				}

				if (
					url.startsWith('/api') || // Exclude API routes
					/^\/.+\..+$/.test(urlWithoutParams) // Exclude files with extension
				) {
					return Response.error(); // Return error response
				}

				// Otherwise, return offline fallback page
				return caches.match(`/offline${isRsc ? '?_rsc' : ''}`);
			})
	);
});