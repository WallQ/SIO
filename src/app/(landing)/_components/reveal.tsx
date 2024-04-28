'use client';

import { useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';

type RevealProps = {
	children: React.ReactNode;
	opacity?: boolean;
	movement?: boolean;
};

const Reveal: React.FunctionComponent<RevealProps> = ({
	children,
	opacity = true,
	movement = true,
}): React.ReactNode => {
	const targetRef = useRef<HTMLDivElement>(null);
	const isInView = useInView(targetRef, { once: true });

	const mainControls = useAnimation();

	useEffect(() => {
		if (isInView) {
			void mainControls.start('visible');
		}
	}, [isInView, mainControls]);

	return (
		<div ref={targetRef} className='w-full'>
			<motion.div
				variants={{
					hidden: {
						opacity: opacity ? 0 : 1,
						y: movement ? -50 : 0,
					},
					visible: {
						opacity: 1,
						y: 0,
						transition: { duration: 0.5 },
					},
				}}
				initial='hidden'
				animate={mainControls}
				transition={{ duration: 0.5, delay: 0.25 }}>
				{children}
			</motion.div>
		</div>
	);
};

export default Reveal;
