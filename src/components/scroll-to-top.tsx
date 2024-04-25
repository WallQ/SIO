'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const ScrollToTop: React.FunctionComponent = (): React.ReactNode => {
	const [isVisible, setIsVisible] = useState<boolean>(false);

	const toggleVisibility = () => {
		if (window.scrollY > 400) return setIsVisible(true);
		return setIsVisible(false);
	};

	useEffect(() => {
		window.addEventListener('scroll', toggleVisibility);
		return () => {
			window.removeEventListener('scroll', toggleVisibility);
		};
	}, []);

	const isBrowser = () => typeof window !== 'undefined';

	const scrollToTop = () => {
		if (!isBrowser()) return;
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<Button
			onClick={scrollToTop}
			variant='ghost'
			size='icon'
			className={cn(
				'fixed bottom-0 right-0 z-10 m-4 transition-opacity duration-300 ease-in-out',
				{
					'opacity-0': !isVisible,
					'opacity-100': isVisible,
				},
			)}>
			<ArrowUp className='size-4' />
		</Button>
	);
};

export default ScrollToTop;
