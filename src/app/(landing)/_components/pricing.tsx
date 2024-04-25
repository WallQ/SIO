import Link from 'next/link';
import { APP_ROUTES } from '@/routes/app';
import { ArrowRight, Check } from 'lucide-react';

import { cn, formatCurrency } from '@/lib/utils';

import Particles from './particles';
import { Spotlight, SpotlightCard } from './spotlight';

const plans = [
	{
		name: 'Basic',
		price: 5,
		description: 'For teams just getting started.',
		features: ['1 company', 'Community support'],
		cta: 'Getting Started',
	},
	{
		name: 'Pro',
		price: 25,
		description: 'For larger teams with increased usage.',
		features: ['5 companies', 'Exportable reports', 'Email support'],
		cta: 'Upgrade Now',
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
		<section id='pricing' className='border border-t'>
			<div className='relative mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='pointer-events-none absolute inset-0 -z-10 overflow-hidden'>
					<div className='absolute left-1/2 top-0 aspect-[1/1] w-1/4 -translate-x-1/2 -translate-y-1/2'>
						<div className='absolute inset-0 rounded-full bg-primary blur-[128px]' />
					</div>
				</div>
				<div className='mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-24 py-48'>
					<div className='flex flex-col items-center justify-between gap-6 text-center'>
						<span className='bg-gradient-to-r from-primary/60 via-primary to-primary/60 bg-clip-text text-base font-medium uppercase text-transparent'>
							Pricing
						</span>
						<h2 className='bg-gradient-to-r from-primary/60 via-primary to-primary/60 bg-clip-text text-4xl font-semibold tracking-tight text-transparent'>
							Pricing based on your needs
						</h2>
						<p className='text-lg leading-7 text-muted-foreground'>
							Invite your whole team, we don&apos;t do seat based
							pricing here.
						</p>
					</div>
					<Spotlight className='group grid gap-6 md:grid-cols-12'>
						{plans.map((plan, i) => (
							<div
								key={plan.name}
								className='group/item h-full md:col-span-6 lg:col-span-4'>
								<SpotlightCard>
									<div className='relative z-10 h-full overflow-hidden rounded-md bg-primary-foreground'>
										<Particles
											className='absolute inset-0 -z-10 opacity-10 transition-opacity duration-1000 ease-in-out group-hover/item:opacity-100'
											quantity={(i + 1) ** 2 * 10}
											color={
												[
													'#14b8a6',
													'#c026d3',
													'#2563eb',
												][i]
											}
											vy={-0.2}
										/>
										<div className='flex h-full flex-col justify-between gap-8 p-8'>
											<div className='flex flex-col gap-4'>
												<div className='flex flex-col gap-2'>
													<h3
														className={cn(
															'text-lg font-semibold tracking-tight',
															{
																'text-teal-500':
																	i === 0,
																'text-fuchsia-600':
																	i === 1,
																'text-blue-600':
																	i === 2,
															},
														)}>
														{plan.name}
													</h3>
													<h3 className='inline-flex items-baseline bg-gradient-to-r from-primary/60 via-primary to-primary/60 bg-clip-text font-bold text-transparent'>
														<span className='text-4xl tracking-tight'>
															{formatCurrency(
																plan.price,
																false,
															)}
														</span>
														<span className='text-lg'>
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
																key={feature}
																className='flex gap-2'>
																<Check
																	className={cn(
																		'size-5 flex-none',
																		{
																			'text-teal-500':
																				i ===
																				0,
																			'text-fuchsia-600':
																				i ===
																				1,
																			'text-blue-600':
																				i ===
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
												href={
													APP_ROUTES.DASHBOARD.BILLING
												}
												className={cn(
													'inline-flex h-10 items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
													{
														'bg-secondary text-secondary-foreground hover:bg-secondary/80':
															i === 0 || i === 2,
														'bg-primary text-primary-foreground hover:bg-primary/90':
															i === 1,
													},
												)}>
												{plan.cta}
												<ArrowRight className='ml-2 size-4' />
											</Link>
										</div>
									</div>
								</SpotlightCard>
							</div>
						))}
					</Spotlight>
				</div>
			</div>
		</section>
	);
};

export default Pricing;
