import { cn } from '@/lib/utils';

type InnerWrapperProps = {
	children: React.ReactNode;
	styles?: string;
};

const InnerWrapper: React.FunctionComponent<InnerWrapperProps> = ({
	children,
	styles = '',
}): React.ReactNode => {
	return (
		<div
			className={cn(
				`mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-24 py-48 ${styles}`,
			)}>
			{children}
		</div>
	);
};

export default InnerWrapper;
