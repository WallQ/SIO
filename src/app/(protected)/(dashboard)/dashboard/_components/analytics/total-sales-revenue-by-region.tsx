import { Chart } from 'react-google-charts';

export const data = [
	['Country', 'Total Sales Revenue'],
	['Germany', 200],
	['United States', 300],
	['Brazil', 400],
	['Canada', 500],
	['France', 600],
	['RU', 700],
];

export const options = {
	region: '039',
	backgroundColor: '#09090b',
	colorAxis: {
		colors: ['#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#d946ef'],
	},
	datalessRegionColor: '#ffffff',
	defaultColor: '#ffffff',
};

type TotalSalesRevenueByRegionProps = {
	data: {
		sales_by_city: (string | number)[][];
	};
};

const TotalSalesRevenueByRegion: React.FunctionComponent<
	TotalSalesRevenueByRegionProps
> = ({ data }): React.ReactNode => {
	console.log(data.sales_by_city);
	return (
		<Chart
			chartType='GeoChart'
			className='absolute bottom-[-45%] left-0 h-auto w-full p-6 pt-0'
			data={data.sales_by_city}
			options={options}
		/>
	);
};

export default TotalSalesRevenueByRegion;
