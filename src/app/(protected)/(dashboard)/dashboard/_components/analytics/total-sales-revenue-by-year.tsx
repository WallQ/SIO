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

type TotalSalesRevenueProps = {
	data: {
		total_sales: number;
		sales_by_month: {
			month: string;
			amount: number;
		}[];
	};
};

const TotalSalesRevenueByYear: React.FunctionComponent<
	TotalSalesRevenueProps
> = ({ data }): React.ReactNode => {
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
					<CardDescription>
						Total Sales Revenue By Year
					</CardDescription>
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<BadgeDelta
									size='xs'
									deltaType={getDeltaType(
										100,
									)}>{`${100}%`}</BadgeDelta>
							</TooltipTrigger>
							<TooltipContent>From last year</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
				<CardTitle className='text-4xl'>
					{formatCurrency(data.total_sales, true, false)}
				</CardTitle>
			</CardHeader>
			<CardContent className='flex flex-col gap-4'>
				<AreaChart
					data={data.sales_by_month}
					index='month'
					categories={['amount']}
					colors={['purple']}
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

export default TotalSalesRevenueByYear;
