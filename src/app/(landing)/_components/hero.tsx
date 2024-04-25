'use client';

import Link from 'next/link';
import { APP_ROUTES } from '@/routes/app';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import Balancer from 'react-wrap-balancer';

import { buttonVariants } from '@/components/ui/button';

import Particles from './particles';

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
				<div className='relative mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8'>
					<Particles
						className='pointer-events-none absolute inset-0 -z-10'
						quantity={50}
					/>
					<div className='mx-auto flex h-full max-w-5xl flex-col items-center justify-center gap-12'>
						<div className='flex flex-col items-center justify-between gap-6 text-center'>
							<motion.h1
								className='bg-gradient-to-r from-primary/60 via-primary to-primary/60 bg-clip-text text-6xl font-extrabold tracking-tight text-transparent lg:text-7xl'
								variants={FADE_DOWN_ANIMATION_VARIANTS}>
								<Balancer>
									Sistemas de Informação Organizacionais
								</Balancer>
							</motion.h1>
							<motion.p
								className='text-lg leading-7 text-muted-foreground'
								variants={FADE_DOWN_ANIMATION_VARIANTS}>
								Lorem ipsum, dolor sit amet consectetur
								adipisicing elit.
							</motion.p>
						</div>
						<motion.div
							className='flex gap-4'
							variants={FADE_DOWN_ANIMATION_VARIANTS}>
							<Link
								href={APP_ROUTES.DASHBOARD.ROOT}
								className={buttonVariants({
									variant: 'default',
								})}>
								Get Started
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
					</div>
				</div>
			</section>
		</motion.div>
	);
};

export default Hero;
