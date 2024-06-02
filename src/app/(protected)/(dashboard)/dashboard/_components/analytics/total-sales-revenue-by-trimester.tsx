'use client';

import { BarChart } from '@tremor/react';

import { formatCurrency } from '@/lib/utils';

type TotalSalesRevenueByTrimesterProps = {
	data: {
		sales_by_trimester: {
			trimester: string;
			amount: number;
		}[];
	};
};

const TotalSalesRevenueByTrimester: React.FunctionComponent<
	TotalSalesRevenueByTrimesterProps
> = ({ data }): React.ReactNode => {
	return (
		<BarChart
			data={data.sales_by_trimester}
			index='trimester'
			categories={['amount']}
			colors={['blue']}
			valueFormatter={(v: number) => formatCurrency(v, false, false)}
			yAxisWidth={48}
			showAnimation={true}
			stack={true}
			className='h-[384px] flex-1'
		/>
	);
};

export default TotalSalesRevenueByTrimester;
