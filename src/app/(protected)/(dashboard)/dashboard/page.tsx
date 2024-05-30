import { api } from '@/trpc/server';
import { ListFilterIcon } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
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

import CustomerStat from './_components/customer-stat';
import Overview from './_components/overview';
import StatCard from './_components/stat-card';

export default async function Dashboard() {
	const [productsByRevenue, citiesByRevenue, customersByRevenue] =
		await Promise.all([
			api.analytics.productsByRevenue(),
			api.analytics.citiesByRevenue(),
			api.analytics.customersByRevenue(),
		]);

	return (
		<main className='flex w-full flex-1 flex-col items-start justify-between gap-4 p-4 sm:px-6 sm:py-0'>
			<div className='grid w-full grid-cols-4 gap-8'>
				{productsByRevenue ? (
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
				{customersByRevenue ? (
					<table className='border border-red-500'>
						<thead>
							<tr>
								<th>Customer</th>
								<th>Amount</th>
							</tr>
						</thead>
						<tbody>
							{customersByRevenue.map((item, index) => (
								<tr
									key={`${index}-${item.amount}-${item.name}`}>
									<td>{item.name}</td>
									<td>{formatCurrency(item.amount)}</td>
								</tr>
							))}
						</tbody>
						<tfoot>
							<tr>
								<td>Total Revenue by Customer</td>
							</tr>
						</tfoot>
					</table>
				) : null}
			</div>
			<div className='grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
				<StatCard
					label='Yearly Total Sales Revenue'
					amount={1000000.0}
					diffrence={-50}
					time='year'
				/>
				<StatCard
					label='Monthly Testing 2'
					amount={100000.0}
					diffrence={-25}
					time='month'
				/>
				<StatCard
					label='Weekly Testing 3'
					amount={1000.0}
					diffrence={0}
					time='week'
				/>
				<StatCard
					label='Daily Testing 4'
					amount={100.0}
					diffrence={25}
					time='day'
				/>
				<StatCard
					label='Testing 5'
					amount={0}
					diffrence={50}
					time='day'
				/>
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
								<CardTitle>Overview</CardTitle>
							</CardHeader>
							<CardContent>
								<Overview />
							</CardContent>
						</Card>
						<Card className='lg:col-span-2'>
							<CardHeader>
								<CardTitle>Recent Sales</CardTitle>
							</CardHeader>
							<CardContent>
								<CustomerStat data={customersByRevenue} />
							</CardContent>
						</Card>
					</div>
				</TabsContent>
			</Tabs>
		</main>
	);
}
