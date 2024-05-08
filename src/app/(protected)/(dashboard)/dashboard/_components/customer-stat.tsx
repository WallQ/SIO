'use client';

import { DonutChart, List, ListItem } from '@tremor/react';

import { cn, formatCurrency } from '@/lib/utils';

const colors = ['cyan', 'blue', 'indigo', 'purple', 'fuchsia', 'rose'];

type CustomerStatProps = {
	data: { name: string; revenue: number }[];
};

const CustomerStat: React.FunctionComponent<CustomerStatProps> = ({
	data,
}): React.ReactNode => {
	return (
		<div className='flex flex-col items-center gap-4'>
			{data ? (
				<DonutChart
					data={data}
					index='name'
					category='revenue'
					variant='donut'
					colors={[
						'cyan',
						'blue',
						'indigo',
						'purple',
						'fuchsia',
						'rose',
					]}
					valueFormatter={(v: number) =>
						formatCurrency(v, false, false)
					}
					showAnimation={true}
					className='h-48'
				/>
			) : null}
			<p className='flex w-full items-center justify-between text-sm text-muted-foreground'>
				<span>Customer</span>
				<span>Amount</span>
			</p>
			<List>
				{data
					? data.map((customer, index) => (
							<ListItem key={`${index}-${customer.name}`}>
								<div className='flex items-center space-x-2.5 truncate'>
									<span
										className={cn(
											`bg-${colors[data.indexOf(customer)]}-500`,
											'size-2.5 shrink-0 rounded-sm',
										)}
										aria-hidden={true}
									/>
									<span className='truncate'>
										{customer.name}
									</span>
								</div>
								<span className='font-medium text-primary'>
									{formatCurrency(
										customer.revenue,
										false,
										false,
									)}
								</span>
							</ListItem>
						))
					: null}
			</List>
		</div>
	);
};

export default CustomerStat;
