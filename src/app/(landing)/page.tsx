import { Fragment } from 'react';

import ScrollToTop from '@/components/scroll-to-top';

import Faq from './_components/faq';
import Features from './_components/features';
import Footer from './_components/footer';
import Hero from './_components/hero';
import Navbar from './_components/navbar';
import Pricing from './_components/pricing';

export default async function Homepage() {
	return (
		<Fragment>
			<Navbar />
			<main>
				<Hero />
				<Features />
				<Pricing />
				<Faq />
			</main>
			<ScrollToTop />
			<Footer />
		</Fragment>
	);
}
