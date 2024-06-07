import { BarList } from '@tremor/react';

const TotalSalesRevenueByProduct: React.FunctionComponent<{
    data: { sales_by_product: { name: string; value: number }[] }
}> = ({ data }) => {

    const formatAmount = (amount: number): string => {

        const roundedAmount = Math.round(amount);
        const formattedAmount = roundedAmount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        return formattedAmount + ' €';
    };

    return (
        <div className='flex flex-col gap-4'>
            <p className='flex w-full items-center justify-between text-sm text-muted-foreground'>
                <span>Product</span>
                <span>Amount (€)</span>
            </p>
            <BarList 
                data={data.sales_by_product.map(product => ({
                    name: product.name,
                    value: formatAmount(product.value)
                }))} 
                color='indigo' 
                showAnimation={true} 
            />
        </div>
    );
};

export default TotalSalesRevenueByProduct;