'use client';

import { RiStackLine } from '@remixicon/react';

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Tooltip, TooltipProvider } from '@/components/ui/tooltip';

function classNames(...classes: string[]) {
	return classes.filter(Boolean).join(' ');
}

const data = [
	{
		value: 'free-workspace',
		label: 'Free workspace',
		icon: RiStackLine,
		description: 'Up to 1,000/req. per day,\n$0.45 per stored GB',
		disabled: false,
	},
];

const YearSwitcher: React.FunctionComponent = (): React.ReactNode => {
	return (
		<>
			<div className='relative'>
				<div className='flex items-start justify-end p-6 shadow-tremor-input dark:shadow-dark-tremor-input'>
					<Select defaultValue=''>
						<SelectTrigger className='dark:border-dark-tremor-border border-tremor-border sm:w-48'>
							<SelectValue placeholder='Select Year' />
						</SelectTrigger>
						<SelectContent
							align='end'
							className='dark:border-dark-tremor-border border-tremor-border'>
							{data.map((item) => (
								<SelectItem
									key={item.value}
									value={item.value}
									disabled={item.disabled}>
									<TooltipProvider>
										<Tooltip
											side='left'
											showArrow={true}
											className='z-50'
											content={item.description}
											triggerAsChild={true}
											sideOffset={15}>
											<div className='flex w-full items-center gap-x-2'>
												<item.icon
													className={classNames(
														item.disabled
															? 'text-tremor-content-subtle/50'
															: 'text-tremor-content',
														'size-4 shrink-0',
													)}
													aria-hidden={true}
												/>
												{item.label}
											</div>
										</Tooltip>
									</TooltipProvider>
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>
		</>
	);
};

export default YearSwitcher;
