'use client';

import { useCompanyStore } from '@/stores/companies';
import { useSelectedYearStore } from '@/stores/years';
import { api } from '@/trpc/react';

import TotalSalesRevenueByYear from './_components/analytics/total-sales-revenue-by-year';
import StatCard from './_components/analytics/stat-card';
import { Card } from '@tremor/react';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TotalSalesRevenueByTrimester from './_components/analytics/total-sales-revenue-by-trimester';
import TotalSalesRevenueByCustomer from './_components/analytics/total-sales-revenue-by-customer';
import TotalSalesRevenueByProduct from './_components/analytics/total-sales-revenue-by-product';
import TotalSalesRevenueByCity from './_components/analytics/total-sales-revenue-by-city';

export default function Dashboard() {
	const selectedCompany = useCompanyStore((state) => state.selectedCompany);
	const selectedYear = useSelectedYearStore((state) => state.selectedYear);

	console.log('Selected Company:', selectedCompany);
	console.log('Selected Year:', selectedYear);

	const totalSalesRevenueByYear = api.overview.totalSalesRevenueByYear.useQuery({
		company: selectedCompany ? selectedCompany.name : '',
		year: selectedYear ? parseInt(selectedYear) : 2023,
	});

	const totalSalesRevenueThisMonth = api.overview.totalSalesRevenueThisMonth.useQuery({
		company: selectedCompany ? selectedCompany.name : '',
		year: selectedYear ? parseInt(selectedYear) : 2023,
	});

	const totalSalesRevenueThisQuarter = api.overview.totalSalesRevenueThisQuarter.useQuery({
		company: selectedCompany ? selectedCompany.name : '',
		year: selectedYear ? parseInt(selectedYear) : 2023,
	});

	const averageSaleRevenuePerSale = api.overview.averageSaleRevenuePerSale.useQuery({
		company: selectedCompany ? selectedCompany.name : '',
	});

	const totalSalesRevenueByTrimester = api.overview.totalSalesRevenueByTrimester.useQuery({
		company: selectedCompany ? selectedCompany.name : '',
		year: selectedYear ? parseInt(selectedYear) : 2023,
	});

	const totalSalesRevenueByCustomer = api.overview.totalSalesRevenueByCustomer.useQuery({
		company: selectedCompany ? selectedCompany.name : '',
		year: selectedYear ? parseInt(selectedYear) : 2023,
	});

	const totalSalesRevenueByProduct = api.overview.totalSalesRevenueByProduct.useQuery({
		company: selectedCompany ? selectedCompany.name : '',
		year: selectedYear ? parseInt(selectedYear) : 2023,
	});

	const totalSalesRevenueByCity = api.overview.totalSalesRevenueByCity.useQuery({
		company: selectedCompany ? selectedCompany.name : '',
		year: selectedYear ? parseInt(selectedYear) : 2023,
	});

	console.log('Total Sales Revenue By Year:', totalSalesRevenueThisQuarter.data?.total_sales);

	return (
		<main className='flex w-full flex-1 flex-col items-start justify-between gap-4 p-4 sm:px-6 sm:py-0'>
			<div className='grid w-full gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
				{totalSalesRevenueByYear.isLoading ? (
					<div>Loading...</div>
				) : totalSalesRevenueByYear.isError ? (
					<div>Error: {totalSalesRevenueByYear.error.message}</div>
				) : totalSalesRevenueByYear.data ? (
					<TotalSalesRevenueByYear
						data={totalSalesRevenueByYear.data}
					/>
				) : null}
				<div className='flex flex-col items-center justify-between gap-4'>
					{totalSalesRevenueThisMonth.isLoading ? (
						<div>Loading...</div>
					) : totalSalesRevenueThisMonth.isError ? (
						<div>Error: {totalSalesRevenueThisMonth.error.message}</div>
					) : totalSalesRevenueThisMonth.data && typeof totalSalesRevenueThisMonth.data.total_sales === 'number' ? (
						<StatCard
							title='Total Sales Revenue This Month'
							value={totalSalesRevenueThisMonth.data.total_sales}
						/>
					) : null}
				</div>
				<div className='flex flex-col items-center justify-between gap-4'>
					{totalSalesRevenueThisQuarter.isLoading ? (
						<div>Loading...</div>
					) : totalSalesRevenueThisQuarter.isError ? (
						<div>
							Error: {totalSalesRevenueThisQuarter.error.message}
						</div>
					) : totalSalesRevenueThisQuarter.data ? (
						<StatCard
							title='Total Sales Revenue This Quarter'
							value={totalSalesRevenueThisQuarter.data.total_sales}
						/>
					) : null}
				</div>
				<div className='flex flex-col items-center justify-between gap-4'>
					{averageSaleRevenuePerSale.isLoading ? (
						<div>Loading...</div>
					) : averageSaleRevenuePerSale.isError ? (
						<div>
							Error: {averageSaleRevenuePerSale.error.message}
						</div>
					) : averageSaleRevenuePerSale.data ? (
						<StatCard
							title='Average Sale Revenue Per Sale'
							value={averageSaleRevenuePerSale.data.average}
						/>
					) : null}
				</div>
			</div>
			{/* <div className='grid w-full gap-4 lg:grid-cols-7'>
				{totalSalesRevenueByCity.isLoading ? (
					<div>Loading...</div>
				) : totalSalesRevenueByCity.isError ? (
					<div>Error: {totalSalesRevenueByCity.error.message}</div>
				) : totalSalesRevenueByCity.data ? (
					<Card className='lg:col-span-5'>
						<CardHeader>
							<CardTitle>
								Total Sales Revenue By Country
							</CardTitle>
						</CardHeader>
						<CardContent className='relative h-96 overflow-x-hidden overflow-y-hidden'>
							<TotalSalesRevenueByCountry
								data={totalSalesRevenueByCity.data}
							/>
						</CardContent>
					</Card>
				) : null}
			</div> */}
			<div className='grid w-full gap-4 lg:grid-cols-7'>
				{totalSalesRevenueByTrimester.isLoading ? (
					<div>Loading...</div>
				) : totalSalesRevenueByTrimester.isError ? (
					<div>Error: {totalSalesRevenueByTrimester.error.message}</div>
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
				<div className='grid gap-3 lg:col-span-2'>
					{totalSalesRevenueByCustomer.isLoading ? (
						<div>Loading...</div>
					) : totalSalesRevenueByCustomer.isError ? (
						<div>
							Error: {totalSalesRevenueByCustomer.error.message}
						</div>
					) : totalSalesRevenueByCustomer.data ? (
						<Card>
							<CardHeader>
								<CardTitle>Sales By Customer</CardTitle>
							</CardHeader>
							<CardContent>
								<TotalSalesRevenueByCustomer
									data={totalSalesRevenueByCustomer.data}
								/>{' '}
							</CardContent>
						</Card>
					) : null}
					{totalSalesRevenueByProduct.isLoading ? (
						<div>Loading...</div>
					) : totalSalesRevenueByProduct.isError ? (
						<div>Error: {totalSalesRevenueByProduct.error.message}</div>
					) : totalSalesRevenueByProduct.data ? (
						<Card>
							<CardHeader>
								<CardTitle>Total Sales Revenue By Product</CardTitle>
							</CardHeader>
							<CardContent>
								<TotalSalesRevenueByProduct data={totalSalesRevenueByProduct.data} />
							</CardContent>
						</Card>
					) : null}
					{totalSalesRevenueByCity.isLoading ? (
						<div>Loading...</div>
					) : totalSalesRevenueByCity.isError ? (
						<div>
							Error: {totalSalesRevenueByCity.error.message}
						</div>
					) : totalSalesRevenueByCity.data ? (
						<Card>
							<CardHeader>
								<CardTitle>Sales By City</CardTitle>
							</CardHeader>
							<CardContent>
								<TotalSalesRevenueByCity
									data={totalSalesRevenueByCity.data}
								/>{' '}
							</CardContent>
						</Card>
					) : null}
				</div>
			</div>
		</main>
	);
}
