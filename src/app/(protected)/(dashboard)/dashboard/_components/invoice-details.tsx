import invoiceDetailsStore from '@/stores/invoice-details';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Copy, File } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
} from '@/components/ui/pagination';
import { Separator } from '@/components/ui/separator';

const InvoiceDetails = () => {
	const containerVariants = {
		hidden: { x: 1, opacity: 0 },
		visible: {
			x: 0,
			opacity: 1,
			transition: { duration: 0.5, ease: 'linear' },
		},
	};

	const selectedInvoice = invoiceDetailsStore(
		(state) => state.selectedInvoice,
	);

	if (!selectedInvoice) {
		return null;
	}

	return (
		<motion.div
			className='invoice-details-container'
			variants={containerVariants}
			initial='hidden'
			animate='visible'>
			<Card className='overflow-hidden'>
				<CardHeader className='flex flex-row items-start bg-muted/50'>
					<div className='grid gap-0.5'>
						<CardTitle className='group flex items-center gap-2 text-lg'>
							Invoice {selectedInvoice.hash}
							<Button
								size='icon'
								variant='outline'
								className='h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100'>
								<Copy className='h-3 w-3' />
								<span className='sr-only'>Copy Order ID</span>
							</Button>
						</CardTitle>
						<CardDescription>
							Date: {selectedInvoice.invoiceDate}
						</CardDescription>
					</div>
					<div className='ml-auto flex items-center gap-1'>
						<Button
							size='sm'
							variant='outline'
							className='h-8 gap-1'>
							<File className='h-3.5 w-3.5' />
							<span className='lg:sr-only xl:not-sr-only xl:whitespace-nowrap'>
								Export
							</span>
						</Button>
					</div>
				</CardHeader>
				<CardContent className='p-6 text-sm'>
					<div className='grid gap-3'>
						<div className='font-semibold'>Order Details</div>
						<ul className='grid gap-3'>
							{selectedInvoice.line.map((line, index) => (
								<li
									className='flex items-center justify-between'
									key={index}>
									<span className='text-muted-foreground'>
										{line.productName} x{' '}
										<span>{line.quantity}</span>
									</span>
									<span>${line.amount}</span>
								</li>
							))}
						</ul>
						<Separator className='my-2' />
						<ul className='grid gap-3'>
							<li className='flex items-center justify-between'>
								<span className='text-muted-foreground'>
									Subtotal
								</span>
								<span>${selectedInvoice.netTotal}</span>
							</li>
							<li className='flex items-center justify-between'>
								<span className='text-muted-foreground'>
									Tax
								</span>
								<span>${selectedInvoice.taxPayable}</span>
							</li>
							<li className='flex items-center justify-between font-semibold'>
								<span className='text-muted-foreground'>
									Total
								</span>
								<span>${selectedInvoice.grossTotal}</span>
							</li>
						</ul>
					</div>
					<Separator className='my-4' />
					<div className='grid gap-3'>
						<div className='font-semibold'>
							Customer Information
						</div>
						<dl className='grid gap-3'>
							<div className='flex items-center justify-between'>
								<dt className='text-muted-foreground'>
									Customer
								</dt>
								<dd>Liam Johnson</dd>
							</div>
							<div className='flex items-center justify-between'>
								<dt className='text-muted-foreground'>Email</dt>
								<dd>
									<a href='mailto:'>liam@acme.com</a>
								</dd>
							</div>
							<div className='flex items-center justify-between'>
								<dt className='text-muted-foreground'>Phone</dt>
								<dd>
									<a href='tel:'>+1 234 567 890</a>
								</dd>
							</div>
						</dl>
					</div>
				</CardContent>
				<CardFooter className='flex flex-row items-center border-t bg-muted/50 px-6 py-3'>
					<div className='text-xs text-muted-foreground'>
						Updated{' '}
						<time dateTime='2023-11-23'>November 23, 2023</time>
					</div>
					<Pagination className='ml-auto mr-0 w-auto'>
						<PaginationContent>
							<PaginationItem>
								<Button
									size='icon'
									variant='outline'
									className='h-6 w-6'>
									<ChevronLeft className='h-3.5 w-3.5' />
									<span className='sr-only'>
										Previous Order
									</span>
								</Button>
							</PaginationItem>
							<PaginationItem>
								<Button
									size='icon'
									variant='outline'
									className='h-6 w-6'>
									<ChevronRight className='h-3.5 w-3.5' />
									<span className='sr-only'>Next Order</span>
								</Button>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				</CardFooter>
			</Card>
		</motion.div>
	);
};

export default InvoiceDetails;
