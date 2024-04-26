import { cn } from '@/lib/utils';

type OuterWrapperProps = {
	children: React.ReactNode;
	styles?: string;
};

const OuterWrapper: React.FunctionComponent<OuterWrapperProps> = ({
	children,
	styles = '',
}): React.ReactNode => {
	return (
		<div
			className={cn(
				`relative mx-auto h-full max-w-7xl px-4 py-2 sm:px-6 sm:py-4 lg:px-8 lg:py-6 ${styles}`,
			)}>
			{children}
		</div>
	);
};

export default OuterWrapper;
