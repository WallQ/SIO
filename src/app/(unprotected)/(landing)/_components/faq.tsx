import Balancer from 'react-wrap-balancer';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import InnerWrapper from '@/components/inner-wrapper';
import OuterWrapper from '@/components/outer-wrapper';
import { Heading, Paragraph, Span } from '@/components/typography';

import Reveal from './ui/reveal';

const faq = [
	{
		question: 'How does the subscription model work for the app?',
		answer: 'Our app operates on a monthly subscription basis, with a 7-day free trial. You can cancel your subscription at any time. Users can choose a plan that suits their needs and budget, gaining access to features such as analytics, report exporting, and more.',
	},
	{
		question: 'What file formats does the app support for data input?',
		answer: 'At the moment, our app supports only .xml file formats for data input. Users can upload files in this format to import data into the app. We are working on adding support for more file formats in the future.',
	},
	{
		question:
			'What kind of analytics and KPIs can I expect to see in the app?',
		answer: 'Our app provides comprehensive analytics and key performance indicators (KPIs) tailored to your specific needs. From sales trends to customer behavior analysis, our platform offers insightful data visualization and reporting to drive informed decision-making.',
	},
	{
		question: 'Can I export reports from the app?',
		answer: 'Absolutely! Our app allows users to export reports in PDF. This feature enables you to share data insights with stakeholders, incorporate findings into presentations, or further analyze the data using external tools.',
	},
	{
		question:
			'Is there a limit to the number of files or data size I can upload?',
		answer: 'We understand the importance of flexibility and scalability. Our app accommodates varying data volumes and file sizes, ensuring that you can upload and analyze your information without encountering limitations.',
	},
	{
		question: 'How secure is my data within the app?',
		answer: 'Security is paramount to us. We employ industry-standard encryption protocols and robust data protection measures to safeguard your information. Your data is stored securely, and access is restricted to authorized users only, providing you with peace of mind regarding confidentiality and integrity.',
	},
];

const Faq: React.FunctionComponent = (): React.ReactNode => {
	return (
		<section id='faq' className='border-t'>
			<OuterWrapper>
				<InnerWrapper>
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
					<Reveal>
						<Accordion type='single' collapsible className='w-full'>
							{faq.map((item, index) => (
								<AccordionItem
									key={`${item.question}-${index}`}
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
					</Reveal>
				</InnerWrapper>
			</OuterWrapper>
		</section>
	);
};

export default Faq;
