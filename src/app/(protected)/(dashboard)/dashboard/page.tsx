'use client';

import invoiceDetailsStore from '@/stores/invoice-details';
import { FileIcon, ListFilterIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import InvoiceDetails from './_components/invoice-details';
import InvoicesTable from './_components/invoices-table';
import StatCard from './_components/stat-card';

export default function Dashboard() {
	const selectedInvoice = invoiceDetailsStore(
		(state) => state.selectedInvoice,
	);

	const handleSelectInvoice = () => {
		invoiceDetailsStore.setState({
			selectedInvoice: {
				hash: '1',
				customerId: '1',
				invoiceDate: '2021-01-01',
				taxPayable: 100,
				netTotal: 100,
				grossTotal: 100,
				line: [
					{
						productId: '1',
						productName: 'Product 1',
						quantity: 1,
						unitPrice: 100,
						amount: 100,
					},
				],
			},
		});
	};

	return (
		<main
			className={cn(
				'grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8',
				selectedInvoice
					? 'lg:grid-cols-3 xl:grid-cols-3'
					: 'lg:grid-cols-2 xl:grid-cols-2',
			)}>
			<div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
				<div className='grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4'>
					<StatCard time='day' amount={100} diffrence={12} />
					<StatCard time='week' amount={100} diffrence={12} />
					<StatCard time='month' amount={100} diffrence={12} />
					<StatCard time='year' amount={100} diffrence={12} />
				</div>
				<Tabs defaultValue='week'>
					<div className='flex items-center'>
						<TabsList>
							<TabsTrigger value='week'>Week</TabsTrigger>
							<TabsTrigger value='month'>Month</TabsTrigger>
							<TabsTrigger value='year'>Year</TabsTrigger>
						</TabsList>
						<div className='ml-auto flex items-center gap-2'>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										className='h-7 gap-1 text-sm'
										size='sm'
										variant='outline'>
										<ListFilterIcon className='h-3.5 w-3.5' />
										<span className='sr-only sm:not-sr-only'>
											Filter
										</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align='end'>
									<DropdownMenuLabel>
										Filter by
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuCheckboxItem checked>
										Fulfilled
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem>
										Declined
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem>
										Refunded
									</DropdownMenuCheckboxItem>
								</DropdownMenuContent>
							</DropdownMenu>
							<Button
								className='h-7 gap-1 text-sm'
								size='sm'
								variant='outline'>
								<FileIcon className='h-3.5 w-3.5' />
								<span className='sr-only sm:not-sr-only'>
									Export
								</span>
							</Button>
						</div>
					</div>
					<TabsContent value='week' onClick={handleSelectInvoice}>
						<InvoicesTable />
					</TabsContent>
				</Tabs>
			</div>
			{selectedInvoice && <InvoiceDetails />}
		</main>
	);
}
