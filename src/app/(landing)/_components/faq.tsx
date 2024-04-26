import Balancer from 'react-wrap-balancer';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';

import { Heading, Paragraph, Span } from './ui/typography';

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
		<section id='faq' className='border-t'>
			<div className='mx-auto h-full max-w-7xl px-4 sm:px-6 lg:px-8'>
				<div className='mx-auto flex h-full max-w-3xl flex-col items-center justify-center gap-24 py-48'>
					<div className='flex flex-col items-center justify-between gap-6 text-center'>
						<Span>FAQ</Span>
						<Heading level={2}>Clarify all your doubts</Heading>
						<Paragraph>
							<Balancer>
								Here are some of the frequently asked questions.
								If you have any other questions, feel free to
								reach out to us.
							</Balancer>
						</Paragraph>
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
