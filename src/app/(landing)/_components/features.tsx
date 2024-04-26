import Image from 'next/image';
import { File, GitMerge, LayoutDashboard, LineChart } from 'lucide-react';
import Balancer from 'react-wrap-balancer';

import InnerWrapper from './ui/inner-wrapper';
import OuterWrapper from './ui/outer-wrapper';
import { Heading, Paragraph, Span } from './ui/typography';

const features = [
	{
		icon: GitMerge,
		name: 'Consolidate Events',
		description:
			'Get all your event data in one place to reduce alert noise',
	},
	{
		icon: LineChart,
		name: 'Visualize analytics',
		description: 'Make better decisions with data-driven insights.',
	},
	{
		icon: File,
		name: 'Export reports',
		description: 'Share reports with your team in a few clicks.',
	},
	{
		icon: LayoutDashboard,
		name: 'Clear Overview',
		description: 'Get a clear overview of all your alerts in one place',
	},
];

const Features: React.FunctionComponent = (): React.ReactNode => {
	return (
		<section id='features' className='relative border-t'>
			<OuterWrapper>
				<InnerWrapper>
					<div className='mx-auto flex max-w-xl flex-col space-y-8 space-y-reverse md:max-w-none md:flex-row md:space-x-8 md:space-y-0 lg:space-x-16 xl:space-x-20'>
						<div className='flex flex-col gap-6'>
							<div className='flex flex-col items-start justify-between gap-6'>
								<Span>Features</Span>
								<Heading level={2}>
									Everything You&apos;ll Ever Need
								</Heading>
								<Paragraph>
									<Balancer>
										Keep your workspace focused on
										what&apos;s important with our
										customizable alert settings. Get a clear
										overview of all your alerts in one place
										to reduce alert noise.
									</Balancer>
								</Paragraph>
							</div>
							<dl className='flex flex-col gap-4'>
								{features.map((feature) => (
									<div
										key={feature.name}
										className='flex flex-col'>
										<div className='flex items-center gap-2 '>
											<feature.icon className='size-4' />
											<h3 className='text-lg font-medium tracking-tight'>
												{feature.name}
											</h3>
										</div>
										<p className='text-sm leading-7 text-muted-foreground'>
											{feature.description}
										</p>
									</div>
								))}
							</dl>
						</div>
						<div className=' mx-auto mt-16 flex max-w-2xl sm:mt-24 md:w-5/12 lg:ml-10 lg:mr-0 lg:mt-0 lg:w-1/2 lg:max-w-none lg:flex-none xl:ml-32'>
							<div className='z-10 max-w-3xl flex-none sm:max-w-5xl lg:max-w-none'>
								<Image
									src='/assets/images/dashboard-screenshot.png'
									alt='App screenshot'
									width={1440}
									height={900}
									className='w-[1024px] rounded-md border'
								/>
							</div>
						</div>
					</div>
				</InnerWrapper>
			</OuterWrapper>
		</section>
	);
};

export default Features;
