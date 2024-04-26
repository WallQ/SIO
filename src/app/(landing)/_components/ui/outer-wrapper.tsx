type OuterWrapperProps = {
	children: React.ReactNode;
};

const OuterWrapper: React.FunctionComponent<OuterWrapperProps> = ({
	children,
}): React.ReactNode => {
	return (
		<div className='relative mx-auto h-full max-w-7xl px-4 py-2 sm:px-6 sm:py-4 lg:px-8 lg:py-6'>
			{children}
		</div>
	);
};

export default OuterWrapper;
