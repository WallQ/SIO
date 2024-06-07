'use client';

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { api } from '@/trpc/react';
import { useSelectedYearStore } from '@/stores/years';

const YearSwitcher: React.FunctionComponent = (): React.ReactNode => {
	const selectedYear = useSelectedYearStore((state) => state.selectedYear);
	const setSelectedYear = useSelectedYearStore(
		(state) => state.setSelectedYear,
	);

	const { data: apiYears } = api.years.getYears.useQuery();

	const handleYearChange = (year: string) => {
		setSelectedYear(year);
	};

	return (
		<>
			<div className='relative'>
				<div className='flex items-start justify-end p-6 shadow-tremor-input dark:shadow-dark-tremor-input'>
					<Select defaultValue={selectedYear ? selectedYear : ""} onValueChange={handleYearChange}>
						<SelectTrigger className='dark:border-dark-tremor-border border-tremor-border sm:w-48'>
							<SelectValue placeholder={selectedYear ? selectedYear : "Select Year"} />
						</SelectTrigger>
						<SelectContent
							align='end'
							className='dark:border-dark-tremor-border border-tremor-border'>
							{apiYears ? (
								<SelectGroup>
									{ apiYears.map((year) => (
									<SelectItem
										key={year.year}
										value={year.year.toString()}>
										{year.year}
									</SelectItem>
									))}
								</SelectGroup>
							) : null}
						</SelectContent>
					</Select>
				</div>
			</div>
		</>
	);
};

export default YearSwitcher;
