'use client';

import { useCompanyStore } from '@/stores/companies';
import { api } from '@/trpc/react';
import { ListFilterIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import CustomersByRevenue from './_components/analytics/customers-by-revenue';
import TotalSalesRevenueByYear from './_components/analytics/total-sales-revenue-by-year';
import Overview from './_components/overview';

export default function Dashboard() {
	const selectedCompany = useCompanyStore((state) => state.selectedCompany);

	const totalSalesRevenueByYear =
		api.overview.totalSalesRevenueByYear.useQuery({
			companyId: selectedCompany ? selectedCompany.id : 0,
			year: 2023,
		});

	const totalSalesRevenueByTrimester =
		api.overview.totalSalesRevenueByTrimester.useQuery({
			companyId: selectedCompany ? selectedCompany.id : 0,
			year: 2023,
		});

	const customersByRevenue = api.overview.customersByRevenue.useQuery({
		companyId: selectedCompany ? selectedCompany.id : 0,
		year: 2023,
	});

	return (
		<main className='flex w-full flex-1 flex-col items-start justify-between gap-4 p-4 sm:px-6 sm:py-0'>
			<div className='grid w-full grid-cols-4 gap-8'>
				{/* {productsByRevenue ? (
					<table className='border border-red-500'>
						<thead>
							<tr>
								<th>Product</th>
								<th>Quantity</th>
								<th>Amount</th>
							</tr>
						</thead>
						<tbody>
							{productsByRevenue.map((item, index) => (
								<tr
									key={`${index}-${item.amount}-${item.product}`}>
									<td>{item.product}</td>
									<td>{item.quantity}</td>
									<td>{formatCurrency(item.amount)}</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td>Total Revenue by Product</td>
							</tr>
						</tfoot>
					</table>
				) : null}
				{citiesByRevenue ? (
					<table className='border border-red-500'>
						<thead>
							<tr>
								<th>City</th>
								<th>Amount</th>
							</tr>
						</thead>
						<tbody>
							{citiesByRevenue.map((item, index) => (
								<tr
									key={`${index}-${item.amount}-${item.city}`}>
									<td>{item.city}</td>
									<td>{formatCurrency(item.amount)}</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td>Total Revenue by City</td>
							</tr>
						</tfoot>
					</table>
				) : null}
				*/}
			</div>
			<div className='grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
				{totalSalesRevenueByYear.isLoading ? (
					<div>Loading...</div>
				) : totalSalesRevenueByYear.isError ? (
					<div>Error: {totalSalesRevenueByYear.error.message}</div>
				) : totalSalesRevenueByYear.data ? (
					<TotalSalesRevenueByYear
						data={totalSalesRevenueByYear.data}
					/>
				) : null}
			</div>
			<Tabs defaultValue='month' className='w-full'>
				<div className='flex items-center'>
					<TabsList>
						<TabsTrigger value='week'>Week</TabsTrigger>
						<TabsTrigger value='month'>Month</TabsTrigger>
						<TabsTrigger value='year'>Year</TabsTrigger>
					</TabsList>
					<div className='ml-auto flex items-center gap-2'>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button size='sm' variant='outline'>
									<ListFilterIcon className='mr-2 size-4' />
									Filter
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align='end'>
								<DropdownMenuLabel>Filter by</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuCheckboxItem>
									Year
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem>
									Month
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem>
									Week
								</DropdownMenuCheckboxItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
				<TabsContent value='month'>
					<div className='grid gap-4 lg:grid-cols-7'>
						<Card className='lg:col-span-5'>
							<CardHeader>
								<CardTitle>
									Total Sales Revenue Per Trimester
								</CardTitle>
							</CardHeader>
							<CardContent>
								{totalSalesRevenueByTrimester.isLoading ? (
									<div>Loading...</div>
								) : totalSalesRevenueByTrimester.isError ? (
									<div>
										Error:{' '}
										{
											totalSalesRevenueByTrimester.error
												.message
										}
									</div>
								) : totalSalesRevenueByTrimester.data ? (
									<Overview
										data={totalSalesRevenueByTrimester.data}
									/>
								) : null}
							</CardContent>
						</Card>
						{customersByRevenue.isLoading ? (
							<div>Loading...</div>
						) : customersByRevenue.isError ? (
							<div>Error: {customersByRevenue.error.message}</div>
						) : customersByRevenue.data ? (
							<Card className='lg:col-span-2'>
								<CardHeader>
									<CardTitle>Customers by Revenue</CardTitle>
								</CardHeader>
								<CardContent>
									<CustomersByRevenue
										data={customersByRevenue.data}
									/>{' '}
								</CardContent>
							</Card>
						) : null}
					</div>
				</TabsContent>
			</Tabs>
		</main>
	);
}
