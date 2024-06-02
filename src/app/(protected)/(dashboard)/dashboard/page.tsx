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

import TotalSalesRevenueByCustomer from './_components/analytics/total-sales-revenue-by-customer';
import TotalSalesRevenueByProduct from './_components/analytics/total-sales-revenue-by-product';
import TotalSalesRevenueByRegion from './_components/analytics/total-sales-revenue-by-region';
import TotalSalesRevenueByTrimester from './_components/analytics/total-sales-revenue-by-trimester';
import TotalSalesRevenueByYear from './_components/analytics/total-sales-revenue-by-year';

export default function Dashboard() {
	const selectedCompany = useCompanyStore((state) => state.selectedCompany);

	const totalSalesRevenueByYear =
		api.overview.totalSalesRevenueByYear.useQuery({
			companyId: selectedCompany ? selectedCompany.id : 0,
			year: 2023,
		});

	const totalSalesRevenueByProduct =
		api.overview.totalSalesRevenueByProduct.useQuery({
			companyId: selectedCompany ? selectedCompany.id : 0,
			year: 2023,
		});

	const totalSalesRevenueByCity =
		api.overview.totalSalesRevenueByCity.useQuery({
			companyId: selectedCompany ? selectedCompany.id : 0,
			year: 2023,
		});

	const totalSalesRevenueByTrimester =
		api.overview.totalSalesRevenueByTrimester.useQuery({
			companyId: selectedCompany ? selectedCompany.id : 0,
			year: 2023,
		});

	const totalSalesRevenueByCustomer =
		api.overview.totalSalesRevenueByCustomer.useQuery({
			companyId: selectedCompany ? selectedCompany.id : 0,
			year: 2023,
		});

	return (
		<main className='flex w-full flex-1 flex-col items-start justify-between gap-4 p-4 sm:px-6 sm:py-0'>
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
				<div className='flex flex-col items-center justify-between border border-red-500'>
					<div className='border border-blue-500'>Testing</div>
					<div className='border border-green-500'>Testing</div>
				</div>
				<div className='flex flex-col items-center justify-between border border-red-500'>
					<div className='border border-blue-500'>Testing</div>
					<div className='border border-green-500'>Testing</div>
				</div>
				<div className='flex flex-col items-center justify-between border border-red-500'>
					<div className='border border-blue-500'>Testing</div>
					<div className='border border-green-500'>Testing</div>
				</div>
				<div className='flex flex-col items-center justify-between border border-red-500'>
					<div className='border border-blue-500'>Testing</div>
					<div className='border border-green-500'>Testing</div>
				</div>
			</div>
			<div className='grid w-full gap-4 lg:grid-cols-7'>
				{totalSalesRevenueByProduct.isLoading ? (
					<div>Loading...</div>
				) : totalSalesRevenueByProduct.isError ? (
					<div>Error: {totalSalesRevenueByProduct.error.message}</div>
				) : totalSalesRevenueByProduct.data ? (
					<Card className='lg:col-span-2'>
						<CardHeader>
							<CardTitle>
								Total Sales Revenue By Product
							</CardTitle>
						</CardHeader>
						<CardContent>
							<TotalSalesRevenueByProduct
								data={totalSalesRevenueByProduct.data}
							/>
						</CardContent>
					</Card>
				) : null}
				{totalSalesRevenueByCity.isLoading ? (
					<div>Loading...</div>
				) : totalSalesRevenueByCity.isError ? (
					<div>Error: {totalSalesRevenueByCity.error.message}</div>
				) : totalSalesRevenueByCity.data ? (
					<Card className='lg:col-span-5'>
						<CardHeader>
							<CardTitle>Total Sales Revenue By Region</CardTitle>
						</CardHeader>
						<CardContent className='relative h-96 overflow-x-hidden overflow-y-hidden'>
							<TotalSalesRevenueByRegion
								data={totalSalesRevenueByCity.data}
							/>
						</CardContent>
					</Card>
				) : null}
			</div>
			<Tabs defaultValue='year' className='w-full'>
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
				<TabsContent value='year'>
					<div className='grid gap-4 lg:grid-cols-7'>
						{totalSalesRevenueByTrimester.isLoading ? (
							<div>Loading...</div>
						) : totalSalesRevenueByTrimester.isError ? (
							<div>
								Error:{' '}
								{totalSalesRevenueByTrimester.error.message}
							</div>
						) : totalSalesRevenueByTrimester.data ? (
							<Card className='lg:col-span-5'>
								<CardHeader>
									<CardTitle>
										Total Sales Revenue By Trimester
									</CardTitle>
								</CardHeader>
								<CardContent>
									<TotalSalesRevenueByTrimester
										data={totalSalesRevenueByTrimester.data}
									/>
								</CardContent>
							</Card>
						) : null}
						{totalSalesRevenueByCustomer.isLoading ? (
							<div>Loading...</div>
						) : totalSalesRevenueByCustomer.isError ? (
							<div>
								Error:{' '}
								{totalSalesRevenueByCustomer.error.message}
							</div>
						) : totalSalesRevenueByCustomer.data ? (
							<Card className='lg:col-span-2'>
								<CardHeader>
									<CardTitle>Customers By Revenue</CardTitle>
								</CardHeader>
								<CardContent>
									<TotalSalesRevenueByCustomer
										data={totalSalesRevenueByCustomer.data}
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
