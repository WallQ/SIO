import { type Metadata } from 'next/types';

import Navbar from './_components/ui/navbar';
import Sidebar from './_components/ui/sidebar';

export const metadata: Metadata = {
	title: 'Dashboard',
};

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='flex min-h-screen w-full flex-col bg-muted/50'>
			<Sidebar />
			<div className='flex flex-col sm:gap-4 sm:py-4 sm:pl-14'>
				<Navbar />
				{children}
			</div>
		</div>
	);
}
