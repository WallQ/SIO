'use client';

import { AreaChart, BadgeDelta, type DeltaType } from '@tremor/react';

import { formatCurrency } from '@/lib/utils';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip';

type StatCardProps = {
	label: string;
	amount: number;
	diffrence: number;
	time: 'year' | 'month' | 'week' | 'day';
};

const months = [
	'Jan',
	'Feb',
	'Mar',
	'Apr',
	'May',
	'Jun',
	'Jul',
	'Aug',
	'Sep',
	'Oct',
	'Nov',
	'Dec',
];

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const chartdata = [
	{
		date: 'Jan 01',
		SemiAnalysis: 2890,
		'The Pragmatic Engineer': 2338,
		Testing: 1350,
	},
	{
		date: 'Feb 22',
		SemiAnalysis: 2756,
		'The Pragmatic Engineer': 2103,
		Testing: 2000,
	},
	{
		date: 'Mar 22',
		SemiAnalysis: 3322,
		'The Pragmatic Engineer': 2194,
		Testing: 4000,
	},
	{
		date: 'Apr 22',
		SemiAnalysis: 3470,
		'The Pragmatic Engineer': 2108,
		Testing: 1000,
	},
	{
		date: 'May 22',
		SemiAnalysis: 3475,
		'The Pragmatic Engineer': 1812,
		Testing: 1050,
	},
	{
		date: 'Jun 22',
		SemiAnalysis: 3129,
		'The Pragmatic Engineer': 1726,
		Testing: 1500,
	},
	{
		date: 'Jul 22',
		SemiAnalysis: 3490,
		'The Pragmatic Engineer': 1982,
		Testing: 2000,
	},
	{
		date: 'Aug 22',
		SemiAnalysis: 2903,
		'The Pragmatic Engineer': 2012,
		Testing: 1000,
	},
	{
		date: 'Sep 22',
		SemiAnalysis: 2643,
		'The Pragmatic Engineer': 2342,
		Testing: 3000,
	},
	{
		date: 'Oct 22',
		SemiAnalysis: 2837,
		'The Pragmatic Engineer': 2473,
		Testing: 1000,
	},
	{
		date: 'Nov 22',
		SemiAnalysis: 2954,
		'The Pragmatic Engineer': 3848,
		Testing: 2000,
	},
	{
		date: 'Dec 31',
		SemiAnalysis: 3239,
		'The Pragmatic Engineer': 3736,
		Testing: 3000,
	},
];

const StatCard: React.FunctionComponent<StatCardProps> = ({
	label,
	amount,
	diffrence,
	time,
}): React.ReactNode => {
	const getDeltaType = (trend: number): DeltaType => {
		if (trend < -35) return 'decrease';
		if (trend < 0) return 'moderateDecrease';
		if (trend === 0) return 'unchanged';
		if (trend < 30) return 'moderateIncrease';
		return 'increase';
	};
	return (
		<Card x-chunk='dashboard-05-chunk-2'>
			<CardHeader className='pb-2'>
				<div className='flex items-center justify-between'>
					<CardDescription>{label}</CardDescription>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<BadgeDelta
									size='xs'
									deltaType={getDeltaType(
										diffrence,
									)}>{`${diffrence}%`}</BadgeDelta>
							</TooltipTrigger>
							<TooltipContent>From last {time}</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<CardTitle className='text-4xl'>
					{formatCurrency(amount, true, false)}
				</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-col gap-4'>
				<AreaChart
					data={chartdata}
					index='date'
					categories={[
						'SemiAnalysis',
						'The Pragmatic Engineer',
						'Testing',
					]}
					colors={['teal', 'fuchsia', 'blue']}
					valueFormatter={(v: number) =>
						formatCurrency(v, false, false)
					}
					showLegend={false}
					showYAxis={false}
					startEndOnly={true}
					showGridLines={false}
					showAnimation={true}
					className='mt-4 h-40'
				/>
			</CardContent>
		</Card>
	);
};

export default StatCard;
