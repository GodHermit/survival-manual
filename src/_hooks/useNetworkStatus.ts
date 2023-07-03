import { useEffect, useState } from 'react';

export default function useNetworkStatus() {
	const [isOnline, setIsOnline] = useState(true);

	const updateNetworkStatus = () => {
		setIsOnline(window.navigator.onLine);
	};

	useEffect(() => {
		updateNetworkStatus();

		window.addEventListener('online', updateNetworkStatus);
		window.addEventListener('offline', updateNetworkStatus);

		return () => {
			window.removeEventListener('online', updateNetworkStatus);
			window.removeEventListener('offline', updateNetworkStatus);
		};
	}, []);

	return isOnline;
}