import { cn } from '@/lib/utils';

type GlowProps = {
	position: 'top' | 'bottom';
};

const Glow: React.FunctionComponent<GlowProps> = ({
	position,
}): React.ReactNode => {
	return (
		<div className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
			<div
				className={cn(
					'absolute left-1/2 flex aspect-[1/1] w-1/3 -translate-x-1/2 items-center justify-center',
					{
						'top-0 -translate-y-1/2': position === 'top',
						'bottom-0 translate-y-1/2': position === 'bottom',
					},
				)}>
				<div className='absolute inset-0 rounded-full bg-primary opacity-75 blur-[128px]' />
				<div className='absolute size-1/4 rounded-full bg-primary blur-[64px]' />
			</div>
		</div>
	);
};

export default Glow;
