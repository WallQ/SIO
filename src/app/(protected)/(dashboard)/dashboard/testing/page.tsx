import { api } from '@/trpc/server';
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

import CustomerStat from '../_components/customer-stat';
import Overview from '../_components/overview';
import StatCard from '../_components/stat-card';

const Testing: React.FunctionComponent = async () => {
	const customersRevenue = await api.analytics.customersByRevenue();

	return (
		<div className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2'>
			<div className='grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2'>
				<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5'>
					<StatCard
						label='Yearly Testing 1'
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
				<Tabs defaultValue='month'>
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
									<DropdownMenuLabel>
										Filter by
									</DropdownMenuLabel>
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
									<CustomerStat data={customersRevenue} />
								</CardContent>
							</Card>
						</div>
					</TabsContent>
				</Tabs>
			</div>
		</div>
	);
};

export default Testing;
