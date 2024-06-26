import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';
import Balancer from 'react-wrap-balancer';

import { cn, formatCurrency } from '@/lib/utils';
import InnerWrapper from '@/components/inner-wrapper';
import OuterWrapper from '@/components/outer-wrapper';
import { Heading, Paragraph, Span } from '@/components/typography';

import Glow from './ui/glow';
import { Highlight, HighlightCard } from './ui/highlight';
import Particles from './ui/particles';
import Reveal from './ui/reveal';

const plans = [
	{
		name: 'Basic',
		price: 5,
		description: 'For teams just getting started.',
		features: ['1 company', 'Community support'],
		cta: 'Get started',
	},
	{
		name: 'Pro',
		price: 25,
		description: 'For larger teams with increased usage.',
		features: ['5 companies', 'Exportable reports', 'Email support'],
		cta: 'Upgrade now',
	},
	{
		name: 'Enterprise',
		price: 50,
		description: 'For businesses with custom needs.',
		features: [
			'15 companies',
			'Exportable reports',
			'Exclusive analytics',
			'Premium support',
		],
		cta: 'Time to scale up',
	},
];

const Pricing: React.FunctionComponent = (): React.ReactNode => {
	return (
		<section id='pricing' className='border-t'>
			<OuterWrapper>
				<Reveal movement={false}>
					<Glow position='top' />
				</Reveal>
				<InnerWrapper>
					<div className='flex flex-col items-center justify-between gap-6 text-center'>
						<Span>Pricing</Span>
						<Heading level={2}>Pricing based on your needs</Heading>
						<Paragraph>
							<Balancer>
								Choose the plan that best fits your needs. All
								plans include a 7-day free trial.
							</Balancer>
						</Paragraph>
					</div>
					<Reveal>
						<Highlight className='group grid gap-6 md:grid-cols-12'>
							{plans.map((plan, index) => (
								<div
									key={plan.name}
									className='group/item h-full md:col-span-6 lg:col-span-4'>
									<HighlightCard>
										<div className='relative z-10 h-full overflow-hidden rounded-md bg-primary-foreground'>
											<Particles
												className='absolute inset-0 -z-10 opacity-25 transition-opacity duration-1000 ease-in-out group-hover/item:opacity-100'
												quantity={(index + 1) ** 2 * 10}
												color={
													[
														'#14b8a6',
														'#c026d3',
														'#2563eb',
													][index]
												}
												vy={-0.2}
											/>
											<div className='flex h-full flex-col justify-between gap-8 p-8'>
												<div className='flex flex-col gap-4'>
													<div className='flex flex-col gap-2'>
														<h3
															className={cn(
																'text-xl font-semibold tracking-tight',
																{
																	'text-teal-500':
																		index ===
																		0,
																	'text-fuchsia-600':
																		index ===
																		1,
																	'text-blue-600':
																		index ===
																		2,
																},
															)}>
															{plan.name}
														</h3>
														<h3 className='inline-flex items-baseline bg-gradient-to-r from-primary/60 via-primary to-primary/60 bg-clip-text font-bold text-transparent'>
															<span className='text-4xl tracking-tight'>
																{formatCurrency(
																	plan.price,
																	false,
																	false,
																)}
															</span>
															<span className='text-xl'>
																/ month
															</span>
														</h3>
													</div>
													<p className='text-sm leading-7 text-muted-foreground'>
														{plan.description}
													</p>
													<ul
														role='list'
														className='flex flex-col gap-2 text-sm text-primary'>
														{plan.features.map(
															(feature) => (
																<li
																	key={
																		feature
																	}
																	className='flex gap-2'>
																	<Check
																		className={cn(
																			'size-5 flex-none',
																			{
																				'text-teal-500':
																					index ===
																					0,
																				'text-fuchsia-600':
																					index ===
																					1,
																				'text-blue-600':
																					index ===
																					2,
																			},
																		)}
																	/>
																	{feature}
																</li>
															),
														)}
													</ul>
												</div>
												<Link
													href={'#'}
													className={cn(
														'inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
														{
															'bg-secondary text-secondary-foreground hover:bg-secondary/80':
																index === 0 ||
																index === 2,
															'bg-primary text-primary-foreground hover:bg-primary/90':
																index === 1,
														},
													)}>
													{plan.cta}
													<ArrowRight className='ml-2 size-4' />
												</Link>
											</div>
										</div>
									</HighlightCard>
								</div>
							))}
						</Highlight>
					</Reveal>
				</InnerWrapper>
			</OuterWrapper>
		</section>
	);
};

export default Pricing;
