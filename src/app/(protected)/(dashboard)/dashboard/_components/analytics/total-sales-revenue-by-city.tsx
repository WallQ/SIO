import { BarList } from '@tremor/react';

type TotalSalesRevenueByCityProps = {
    data: {
        city: string;
        amount: number;
    }[];
};

const TotalSalesRevenueByCity: React.FunctionComponent<TotalSalesRevenueByCityProps> = ({ data }) => {
    const formatAmount = (amount: number): string => {
        const formattedAmount = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        return formattedAmount + ' €';
    };

    return (
        <div className='flex flex-col gap-4'>
            <p className='flex w-full items-center justify-between text-sm text-muted-foreground'>
                <span>Name</span>
                <span>Amount (€)</span>
            </p>
            <BarList 
                data={data.map(item => ({ name: item.city, value: formatAmount(item.amount) }))} 
                color='indigo' 
                showAnimation={true} 
            />
        </div>
    );
};

export default TotalSalesRevenueByCity;
