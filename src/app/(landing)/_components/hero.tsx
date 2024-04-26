'use client';

import Link from 'next/link';
import { APP_ROUTES } from '@/routes/app';
import { motion } from 'framer-motion';
import { ArrowRight, ExternalLink } from 'lucide-react';
import Balancer from 'react-wrap-balancer';

import { buttonVariants } from '@/components/ui/button';

import Glow from './ui/glow';
import InnerWrapper from './ui/inner-wrapper';
import OuterWrapper from './ui/outer-wrapper';
import Particles from './ui/particles';
import { Heading, Paragraph } from './ui/typography';

const Hero: React.FunctionComponent = (): React.ReactNode => {
	const FADE_DOWN_ANIMATION_VARIANTS = {
		hidden: { opacity: 0, y: -5 },
		show: { opacity: 1, y: 0, transition: { type: 'spring' } },
	};
	return (
		<motion.div
			initial='hidden'
			animate='show'
			viewport={{ once: true }}
			variants={{
				hidden: {},
				show: {
					transition: {
						staggerChildren: 0.15,
					},
				},
			}}>
			<section id='hero' className='h-screen'>
				<OuterWrapper>
					<Particles
						className='pointer-events-none absolute inset-0 -z-10'
						quantity={50}
					/>
					<Glow position='bottom' />
					<InnerWrapper styles='gap-12'>
						<div className='flex flex-col items-center justify-between gap-6 text-center'>
							<motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
								<Heading level={1}>
									<Balancer>
										Organizational Information Systems
									</Balancer>
								</Heading>
							</motion.div>
							<motion.div variants={FADE_DOWN_ANIMATION_VARIANTS}>
								<Paragraph>
									Unlock the power of your data with our
									comprehensive suite of tools. From clear
									insights to predictive analytics, we&apos;ve
									got everything you need to thrive. Join us
									today and take the first step towards
									data-driven decision-making.
								</Paragraph>
							</motion.div>
						</div>
						<motion.div
							className='flex gap-4'
							variants={FADE_DOWN_ANIMATION_VARIANTS}>
							<Link
								href={APP_ROUTES.DASHBOARD.ROOT}
								className='inline-flex h-10 animate-shine items-center justify-center whitespace-nowrap rounded-md bg-gradient-to-r from-primary via-primary/75 to-primary bg-[length:400%_100%] px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50'>
								Get Started
								<ArrowRight className='ml-2 size-4' />
							</Link>
							<a
								href='https://github.com/WallQ/SIO'
								target='_blank'
								rel='noopener noreferrer'
								aria-label='GitHub Repository'
								className={buttonVariants({
									variant: 'outline',
								})}>
								Repository
								<ExternalLink className='ml-2 h-4 w-4' />
							</a>
						</motion.div>
					</InnerWrapper>
				</OuterWrapper>
			</section>
		</motion.div>
	);
};

export default Hero;
