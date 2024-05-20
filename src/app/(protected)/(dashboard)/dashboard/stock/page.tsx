import { BadgeDelta, type DeltaType } from '@tremor/react';

import { formatCurrency, formatNumber } from '@/lib/utils';
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export default async function Stock() {
	const getDeltaType = (trend: number): DeltaType => {
		if (trend < -35) return 'decrease';
		if (trend < 0) return 'moderateDecrease';
		if (trend === 0) return 'unchanged';
		if (trend < 30) return 'moderateIncrease';
		return 'increase';
	};

	return (
		<main className='flex w-full flex-1 flex-col items-start justify-between gap-4 p-4 sm:px-6 sm:py-0'>
			<h1>Stock</h1>
			<div className='grid w-full grid-cols-4 gap-4'>
				<Card>
					<CardHeader className='pb-2'>
						<div className='flex items-center justify-between'>
							<CardDescription>Inventory Value</CardDescription>
						</div>
						<CardTitle className='text-4xl'>
							{formatCurrency(500000.0, true, false)}
						</CardTitle>
					</CardHeader>
					<CardContent className='flex items-center gap-2'>
						<BadgeDelta size='xs' deltaType={getDeltaType(100)}>
							{`${100}%`}
						</BadgeDelta>
						<span className='text-muted-foreground'>
							from previous year
						</span>
					</CardContent>
				</Card>
				<Card>
					<CardHeader className='pb-2'>
						<div className='flex items-center justify-between'>
							<CardDescription>Stock Available</CardDescription>
						</div>
						<CardTitle className='text-4xl'>
							{formatNumber(100000, false, false)}
						</CardTitle>
					</CardHeader>
					<CardContent className='flex items-center gap-2'>
						<BadgeDelta size='xs' deltaType={getDeltaType(100)}>
							{`${100}%`}
						</BadgeDelta>
						<span className='text-muted-foreground'>
							from previous year
						</span>
					</CardContent>
				</Card>
				<div className='border border-red-500'>KPI 3</div>
				<div className='border border-red-500'>KPI 4</div>
			</div>
			<div className='grid w-full grid-cols-2 gap-4'>
				<div className='grid w-full grid-cols-2 gap-4'>
					<div className='border border-red-500'>
						Inventory Value Over Time (Year)
					</div>
					<div className='border border-red-500'>
						Inventory Value By Category
					</div>
					<div className='border border-red-500'>
						Inventory Movement
					</div>
					<div className='border border-red-500'>Chart 4</div>
				</div>
				<div className='border border-red-500'>
					Top 10 Most Sold Products
				</div>
			</div>
		</main>
	);
}
