import Balancer from 'react-wrap-balancer';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

const faq = [
	{
		question: 'What is Lorem Ipsum?',
		answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
	},
	{
		question: 'What is Lorem Ipsum?',
		answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
	},
	{
		question: 'What is Lorem Ipsum?',
		answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
	},
	{
		question: 'What is Lorem Ipsum?',
		answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
	},
	{
		question: 'What is Lorem Ipsum?',
		answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
	},
	{
		question: 'What is Lorem Ipsum?',
		answer: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
	},
];

const Faq: React.FunctionComponent = (): React.ReactNode => {
	return (
		<section id='faq' className='border border-t'>
			<div className='mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-24 py-48'>
					<div className='flex flex-col items-center justify-between gap-6 text-center'>
						<span className='bg-gradient-to-r from-primary/60 via-primary to-primary/60 bg-clip-text text-base font-medium uppercase text-transparent'>
							FAQ
						</span>
						<h2 className='bg-gradient-to-r from-primary/60 via-primary to-primary/60 bg-clip-text text-4xl font-semibold tracking-tight text-transparent'>
							Clarify all your doubts
						</h2>
						<p className='text-pretty text-lg leading-7 text-muted-foreground'>
							<Balancer>
								Here are some of the frequently asked questions.
								If you have any other questions, feel free to
								reach out to us.
							</Balancer>
						</p>
					</div>
					<Accordion type='single' collapsible className='w-full'>
						{faq.map((item, index) => (
							<AccordionItem
								key={item.question}
								value={`item-${index}`}>
								<AccordionTrigger>
									{item.question}
								</AccordionTrigger>
								<AccordionContent>
									{item.answer}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
			</div>
		</section>
	);
};

export default Faq;
