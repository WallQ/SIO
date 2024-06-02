import { BarList } from '@tremor/react';

type TotalSalesRevenueByProductProps = {
	data: {
		sales_by_product: {
			name: string;
			value: number;
		}[];
	};
};

const TotalSalesRevenueByProduct: React.FunctionComponent<
	TotalSalesRevenueByProductProps
> = ({ data }): React.ReactNode => {
	return (
		<div className='flex flex-col gap-4'>
			<p className='flex w-full items-center justify-between text-sm text-muted-foreground'>
				<span>Product</span>
				<span>Amount</span>
			</p>
			<BarList
				data={data.sales_by_product}
				color='indigo'
				showAnimation={true}
			/>
		</div>
	);
};

export default TotalSalesRevenueByProduct;
