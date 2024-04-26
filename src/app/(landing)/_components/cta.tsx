'use client';

import Link from 'next/link';
import { APP_ROUTES } from '@/routes/app';
import Autoplay from 'embla-carousel-autoplay';
import { ArrowRight } from 'lucide-react';
import Balancer from 'react-wrap-balancer';

import { getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import {
	Carousel,
	CarouselContent,
	CarouselItem,
} from '@/components/ui/carousel';

import Glow from './ui/glow';
import InnerWrapper from './ui/inner-wrapper';
import OuterWrapper from './ui/outer-wrapper';
import Particles from './ui/particles';
import { Heading, Paragraph, Span } from './ui/typography';

const testimonials = [
	{
		image: 'https://github.com/h4zaky.png',
		username: '@h4zaky',
		name: 'Carlos Leite',
		review: 'I love issuing invoices.',
	},
	{
		image: 'https://github.com/joaovieira13.png',
		username: '@joaovieira13',
		name: 'João Vieira',
		review: `Those bmpn's were crazy.`,
	},
	{
		image: 'https://github.com/pedrotiago70.png',
		username: '@pedrotiago70',
		name: 'Pedro Tiago',
		review: 'This year I will pass this curricular unit.',
	},
	{
		image: 'https://github.com/rafaelferraz2002.png',
		username: '@rafaelferraz2002',
		name: 'Rafael Ferraz',
		review: 'That hairdryer was too expensive.',
	},
	{
		image: 'https://github.com/wallq.png',
		username: '@wallq',
		name: 'Sérgio Félix',
		review: `This wasn't even painful to do.`,
	},
];

const Cta: React.FunctionComponent = (): React.ReactNode => {
	return (
		<section id='cta' className='border-t'>
			<OuterWrapper>
				<Particles
					className='pointer-events-none absolute inset-0 -z-10'
					quantity={50}
				/>
				<Glow position='bottom' />
				<InnerWrapper>
					<div className='flex flex-col items-center justify-between gap-6 text-center'>
						<Span>Join us</Span>
						<Heading level={2}>
							Take control of your finances
						</Heading>
						<Paragraph>
							<Balancer>
								Thousands of people are already using our
								platform. What are you waiting for?
							</Balancer>
						</Paragraph>
					</div>
					<Carousel
						opts={{
							loop: true,
						}}
						plugins={[
							Autoplay({
								delay: 2250,
							}),
						]}
						className='w-full'>
						<CarouselContent>
							{testimonials.map((testimonial) => (
								<CarouselItem
									key={testimonial.name}
									className='md:basis-1/2 lg:basis-1/3'>
									<Card className='h-full bg-primary-foreground'>
										<CardContent className='flex h-full flex-col gap-4 px-8 py-6'>
											<div className='flex items-center gap-4'>
												<Avatar className='size-8'>
													<AvatarImage
														src={testimonial.image}
														alt={
															testimonial.username
														}
													/>
													<AvatarFallback>
														{getInitials(
															testimonial.image,
														)}
													</AvatarFallback>
												</Avatar>
												<div className='flex flex-col'>
													<span>
														{testimonial.name}
													</span>
													<span className='text-xs text-muted-foreground'>
														{testimonial.username}
													</span>
												</div>
											</div>
											<Paragraph styles='text-sm text-primary'>
												{testimonial.review}
											</Paragraph>
										</CardContent>
									</Card>
								</CarouselItem>
							))}
						</CarouselContent>
					</Carousel>
					<Link
						href={APP_ROUTES.DASHBOARD.ROOT}
						className='inline-flex h-10 animate-shine items-center justify-center whitespace-nowrap rounded-md bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
						Get Started
						<ArrowRight className='ml-2 size-4' />
					</Link>
				</InnerWrapper>
			</OuterWrapper>
		</section>
	);
};

export default Cta;
