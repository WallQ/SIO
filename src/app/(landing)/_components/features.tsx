import Image from 'next/image';
import { Bot, File, LayoutDashboard, LineChart } from 'lucide-react';
import Balancer from 'react-wrap-balancer';

import InnerWrapper from './ui/inner-wrapper';
import OuterWrapper from './ui/outer-wrapper';
import { Heading, Paragraph, Span } from './ui/typography';

const features = [
	{
		icon: LayoutDashboard,
		name: 'Clear Overview',
		description: 'Get a clear overview of all your data.',
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
		icon: Bot,
		name: 'AI Predictions',
		description: 'Get AI-powered predictions for your business.',
	},
];

const Features: React.FunctionComponent = (): React.ReactNode => {
	return (
		<section id='features' className='overflow-hidden border-t'>
			<OuterWrapper>
				<InnerWrapper styles='lg:flex-row items-start'>
					<div className='order-last flex max-w-2xl flex-shrink-0 flex-col gap-6 lg:order-none'>
						<div className='flex flex-col items-start justify-between gap-6'>
							<Span>Features</Span>
							<Heading level={2}>
								Everything You&apos;ll Ever Need
							</Heading>
							<Paragraph>
								<Balancer>
									Discover a suite of essential tools tailored
									for your data needs.
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
										<span>{feature.name}</span>
									</div>
									<Paragraph styles='text-sm'>
										{feature.description}
									</Paragraph>
								</div>
							))}
						</dl>
					</div>
					<div className='lg:l-32 order-first lg:order-none lg:flex'>
						<div className='max-w-none flex-none'>
							<Image
								src='/assets/images/dashboard-screenshot.png'
								alt='App screenshot'
								width={1440}
								height={900}
								className='h-auto w-[1024px] rounded-md border'
							/>
						</div>
					</div>
				</InnerWrapper>
			</OuterWrapper>
		</section>
	);
};

export default Features;
