import { BadgeDelta } from '@tremor/react';

import { formatCurrency, formatNumber, getDeltaType } from '@/lib/utils';

type StatCardProps = {
	title: string;
	value: number;
	currency?: boolean;
};

const StatCard: React.FunctionComponent<StatCardProps> = ({
	title,
	value,
	currency = true,
}): React.ReactNode => {
	return (
		<div className='flex w-full flex-1 flex-col justify-center gap-4 rounded-lg border bg-card p-6 text-card-foreground shadow-sm'>
			<div className='flex justify-between'>
				<p className='text-sm text-muted-foreground'>{title}</p>
				<BadgeDelta
					size='xs'
					deltaType={getDeltaType(100)}>{`${100}%`}</BadgeDelta>
			</div>
			<h3 className='pb-0 text-4xl font-semibold tracking-tight'>
				{currency
					? formatCurrency(value, false, true)
					: formatNumber(value, true, false)}
			</h3>
		</div>
	);
};

export default StatCard;
