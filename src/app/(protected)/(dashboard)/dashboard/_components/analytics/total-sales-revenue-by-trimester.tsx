'use client';

import { BarChart } from '@tremor/react';

import { formatCurrency } from '@/lib/utils';

const chartdata = [
	{
		trimester: 'Q1',
		amount: 100,
	},
	{
		trimester: 'Q2',
		amount: 1000,
	},
	{
		trimester: 'Q3',
		amount: 10000,
	},
	{
		trimester: 'Q4',
		amount: 100000,
	},
];
type OverviewProps = {
	data: {
		trimester: number;
		amount: number;
	}[];
};

const TotalSalesRevenueByTrimester: React.FunctionComponent<
	OverviewProps
> = ({}): React.ReactNode => {
	return (
		<BarChart
			data={chartdata}
			index='trimester'
			categories={['amount']}
			colors={['cyan']}
			valueFormatter={(v: number) => formatCurrency(v, false, false)}
			yAxisWidth={48}
			showAnimation={true}
			stack={true}
			className='h-[384px] flex-1'
		/>
	);
};

export default TotalSalesRevenueByTrimester;
