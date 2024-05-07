'use client';

import { DonutChart, List, ListItem } from '@tremor/react';

import { cn, formatCurrency } from '@/lib/utils';

type CustomerStatProps = {
	//
};

type ChartData = {
	name: string;
	amount: number;
	color: string;
};

const chartdata = [
	{
		name: 'Carlos Leite',
		amount: 100,
		color: 'cyan',
	},
	{
		name: 'João Vieira',
		amount: 200,
		color: 'blue',
	},
	{
		name: 'Pedro Tiago',
		amount: 300,
		color: 'indigo',
	},
	{
		name: 'Rafael Ferraz',
		amount: 400,
		color: 'purple',
	},
	{
		name: 'Rui Brandão',
		amount: 500,
		color: 'fuchsia',
	},
	{
		name: 'Sérgio Félix',
		amount: 600,
		color: 'rose',
	},
] as ChartData[];

const CustomerStat: React.FunctionComponent<
	CustomerStatProps
> = ({}): React.ReactNode => {
	return (
		<div className='flex flex-col items-center gap-4'>
			<DonutChart
				data={chartdata}
				index='name'
				category='amount'
				colors={['cyan', 'blue', 'indigo', 'purple', 'fuchsia', 'rose']}
				valueFormatter={(v: number) => formatCurrency(v, false, false)}
				showAnimation={true}
				className='h-48'
			/>
			<p className='flex w-full items-center justify-between text-sm text-muted-foreground'>
				<span>Customer</span>
				<span>Amount</span>
			</p>
			<List>
				{chartdata.map((item, index) => (
					<ListItem key={index}>
						<div className='flex items-center space-x-2.5 truncate'>
							<span
								className={cn(
									`bg-${item.color}-500`,
									'size-2.5 shrink-0 rounded-sm',
								)}
								aria-hidden={true}
							/>
							<span className='truncate'>{item.name}</span>
						</div>
						<span className='font-medium text-primary'>
							{formatCurrency(item.amount, false, false)}
						</span>
					</ListItem>
				))}
			</List>
		</div>
	);
};

export default CustomerStat;
