'use client';

import { useCompanyStore } from '@/stores/companies';
import { api } from '@/trpc/react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import StatCard from './_components/analytics/stat-card';
import TotalSalesRevenueByCountry from './_components/analytics/total-sales-revenue-by-country';
import TotalSalesRevenueByCustomer from './_components/analytics/total-sales-revenue-by-customer';
import TotalSalesRevenueByProduct from './_components/analytics/total-sales-revenue-by-product';
import TotalSalesRevenueByTrimester from './_components/analytics/total-sales-revenue-by-trimester';
import TotalSalesRevenueByYear from './_components/analytics/total-sales-revenue-by-year';

export default function Dashboard() {
	const selectedCompany = useCompanyStore((state) => state.selectedCompany);

	const totalSalesRevenueByYear =
		api.overview.totalSalesRevenueByYear.useQuery({
			companyId: selectedCompany ? selectedCompany.id : 0,
			year: 2023,
		});

	// const totalSalesRevenueThisTrimester =
	// 	api.overview.totalSalesRevenueThisTrimester.useQuery({
	// 		companyId: selectedCompany ? selectedCompany.id : 0,
	// 	});

	const totalSalesRevenueThisMonth =
		api.overview.totalSalesRevenueThisMonth.useQuery({
			companyId: selectedCompany ? selectedCompany.id : 0,
		});

	// const totalSalesRevenueThisDay =
	// 	api.overview.totalSalesRevenueThisDay.useQuery({
	// 		companyId: selectedCompany ? selectedCompany.id : 0,
	// 	});

	const totalSalesRevenueThisWeek =
		api.overview.totalSalesRevenueThisWeek.useQuery({
			companyId: selectedCompany ? selectedCompany.id : 0,
		});

	const averageSaleRevenuePerSale =
		api.overview.averageSaleRevenuePerSale.useQuery({
			companyId: selectedCompany ? selectedCompany.id : 0,
		});

	// const totalCustomers = api.overview.totalCustomers.useQuery({
	// 	companyId: selectedCompany ? selectedCompany.id : 0,
	// });

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
		<main className='flex w-full flex-1 flex-col items-start justify-between gap-2 p-4 sm:px-6 sm:py-0'>
			<div className='grid w-full gap-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
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
						<div>
							Error: {totalSalesRevenueThisMonth.error.message}
						</div>
					) : totalSalesRevenueThisMonth.data ? (
						<StatCard
							title='Total Sales Revenue This Month'
							value={totalSalesRevenueThisMonth.data.amount}
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
							value={averageSaleRevenuePerSale.data.amount}
						/>
					) : null}
				</div>
				<div className='flex flex-col items-center justify-between gap-4'>
					{totalSalesRevenueThisWeek.isLoading ? (
						<div>Loading...</div>
					) : totalSalesRevenueThisWeek.isError ? (
						<div>
							Error: {totalSalesRevenueThisWeek.error.message}
						</div>
					) : totalSalesRevenueThisWeek.data ? (
						<StatCard
							title='Total Sales Revenue This Week'
							value={totalSalesRevenueThisWeek.data.amount}
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
			<div className='grid w-full gap-2 lg:grid-cols-7'>
				{totalSalesRevenueByTrimester.isLoading ? (
					<div>Loading...</div>
				) : totalSalesRevenueByTrimester.isError ? (
					<div>
						Error: {totalSalesRevenueByTrimester.error.message}
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
				<div className='grid lg:col-span-2 gap-3'>
					{totalSalesRevenueByCustomer.isLoading ? (
						<div>Loading...</div>
					) : totalSalesRevenueByCustomer.isError ? (
						<div>
							Error: {totalSalesRevenueByCustomer.error.message}
						</div>
					) : totalSalesRevenueByCustomer.data ? (
						<Card>
							<CardHeader>
								<CardTitle>Sales By Product</CardTitle>
							</CardHeader>
							<CardContent>
								<TotalSalesRevenueByCustomer
									data={totalSalesRevenueByCustomer.data}
								/>{' '}
							</CardContent>
						</Card>
					) : null}
					{totalSalesRevenueByCustomer.isLoading ? (
						<div>Loading...</div>
					) : totalSalesRevenueByCustomer.isError ? (
						<div>
							Error: {totalSalesRevenueByCustomer.error.message}
						</div>
					) : totalSalesRevenueByCustomer.data ? (
						<Card>
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
					{totalSalesRevenueByCustomer.isLoading ? (
						<div>Loading...</div>
					) : totalSalesRevenueByCustomer.isError ? (
						<div>
							Error: {totalSalesRevenueByCustomer.error.message}
						</div>
					) : totalSalesRevenueByCustomer.data ? (
						<Card>
							<CardHeader>
								<CardTitle>Sales By City</CardTitle>
							</CardHeader>
							<CardContent>
								<TotalSalesRevenueByCustomer
									data={totalSalesRevenueByCustomer.data}
								/>{' '}
							</CardContent>
						</Card>
					) : null}
				</div>
			</div>
		</main>
	);
}
