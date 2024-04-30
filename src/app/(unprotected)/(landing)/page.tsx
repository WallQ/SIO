import { Fragment } from 'react';

import Cta from './_components/cta';
import Faq from './_components/faq';
import Features from './_components/features';
import Footer from './_components/footer';
import Hero from './_components/hero';
import Navbar from './_components/navbar';
import Pricing from './_components/pricing';
import ScrollToTop from './_components/ui/scroll-to-top';

export default async function Homepage() {
	return (
		<Fragment>
			<Navbar />
			<main>
				<Hero />
				<Features />
				<Pricing />
				<Faq />
				<Cta />
			</main>
			<ScrollToTop />
			<Footer />
		</Fragment>
	);
}
