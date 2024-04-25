const Features: React.FunctionComponent = (): React.ReactNode => {
	return (
		<section id='features' className='h-screen border border-t'>
			<div className='relative mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
					<div className='absolute left-1/2 top-0 aspect-[1/1] w-1/4 -translate-x-1/2 -translate-y-1/2'>
						<div className='absolute inset-0 rounded-full bg-primary blur-[128px]' />
					</div>
				</div>
				<div className='mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-12'></div>
			</div>
		</section>
	);
};

export default Features;
