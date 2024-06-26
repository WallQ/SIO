import Image from 'next/image';
import DefaultFeaturesImage from '@/assets/images/dashboard-screenshot.png';
import { Bot, File, LayoutDashboard, LineChart } from 'lucide-react';
import Balancer from 'react-wrap-balancer';

import InnerWrapper from '@/components/inner-wrapper';
import OuterWrapper from '@/components/outer-wrapper';
import { Heading, Paragraph, Span } from '@/components/typography';

import Reveal from './ui/reveal';
import Spotlight from './ui/spotlight';

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
		<section id='features' className='relative overflow-hidden border-t'>
			<Reveal movement={false}>
				<Spotlight
					className='-top-40 left-0 md:-top-20 md:left-60'
					fill='white'
				/>
			</Reveal>
			<OuterWrapper>
				<InnerWrapper styles='lg:flex-row items-start'>
					<div className='flex w-full flex-shrink-0 flex-col gap-6 lg:max-w-2xl'>
						<Reveal>
							<div className='flex flex-col items-center gap-6 text-center lg:items-start lg:text-start'>
								<Span>Features</Span>
								<Heading level={2}>
									Everything You&apos;ll Ever Need
								</Heading>
								<Paragraph>
									<Balancer>
										Discover a suite of essential tools
										tailored for your data needs.
									</Balancer>
								</Paragraph>
							</div>
							<dl className='grid grid-cols-2 gap-4 lg:flex lg:flex-col'>
								{features.map((feature) => (
									<div
										key={feature.name}
										className='flex flex-col items-center lg:items-start'>
										<div className='flex items-center gap-2 '>
											<feature.icon className='size-4' />
											<span>{feature.name}</span>
										</div>
										<Paragraph styles='text-sm text-center lg:text-start'>
											{feature.description}
										</Paragraph>
									</div>
								))}
							</dl>
						</Reveal>
					</div>
					<div className='lg:l-32 lg:flex'>
						<div className='max-w-none flex-none'>
							<Image
								src={DefaultFeaturesImage}
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
