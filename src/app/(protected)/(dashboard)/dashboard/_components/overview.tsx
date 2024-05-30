'use client';

import { BarChart } from '@tremor/react';

import { formatCurrency } from '@/lib/utils';

const chartdata = [
	{
		date: 'Jan',
		'2022': 100,
		'2023': 200,
		'2024': 300,
	},
	{
		date: 'Feb',
		'2022': 200,
		'2023': 300,
		'2024': 400,
	},
	{
		date: 'Mar',
		'2022': 300,
		'2023': 400,
		'2024': 500,
	},
	{
		date: 'Apr',
		'2022': 400,
		'2023': 500,
		'2024': 600,
	},
	{
		date: 'May',
		'2022': 500,
		'2023': 600,
		'2024': 700,
	},
	{
		date: 'Jun',
		'2022': 600,
		'2023': 700,
		'2024': 800,
	},
	{
		date: 'Jul',
		'2022': 700,
		'2023': 800,
		'2024': 900,
	},
	{
		date: 'Aug',
		'2022': 800,
		'2023': 900,
		'2024': 1000,
	},
	{
		date: 'Sep',
		'2022': 900,
		'2023': 1000,
		'2024': 1100,
	},
	{
		date: 'Oct',
		'2022': 1000,
		'2023': 1100,
		'2024': 1200,
	},
	{
		date: 'Nov',
		'2022': 1100,
		'2023': 1200,
		'2024': 1300,
	},
	{
		date: 'Dec',
		'2022': 1200,
		'2023': 1300,
		'2024': 1400,
	},
];
type OverviewProps = {
	//
};

const Overview: React.FunctionComponent<
	OverviewProps
> = ({}): React.ReactNode => {
	return (
		<BarChart
			data={chartdata}
			index='date'
			categories={['2022', '2023', '2024']}
			colors={['teal', 'fuchsia', 'blue']}
			valueFormatter={(v: number) => formatCurrency(v, false, false)}
			yAxisWidth={48}
			showAnimation={true}
			stack={true}
			className='h-[384px] flex-1'
		/>
	);
};

export default Overview;
