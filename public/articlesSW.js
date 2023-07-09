self.addEventListener('fetch', (e) => {
	if (!e.request.url.startsWith(self.origin)) {
		return;
	}

	const url = e.request.url
		.replace(self.origin, '')
		.replace(/\?_rsc=(.*)/, '?_rsc');

	const urlWithoutParams = url.replace(/\?.*/, '');

	if (/\/(?:assets|_next|favicon|manifest).*/i.test(urlWithoutParams)) { // exclude static assets and nextjs files+
		return;
	}

	e.respondWith(
		fetch(e.request)
			.catch(async () => {
				const res = await caches.match(url);
				return res || caches.match('/offline');
			})
	);
});