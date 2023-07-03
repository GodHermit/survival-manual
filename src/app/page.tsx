import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

// This page only renders when the app is built statically (output: 'export')
export default function RootPage() {
	const cookiesStore = cookies();
	redirect(cookiesStore.get('NEXT_LOCALE')?.value || 'en');
}