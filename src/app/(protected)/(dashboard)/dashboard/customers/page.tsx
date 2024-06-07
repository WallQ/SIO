'use client';

import { useCustomerStore } from '@/stores/customers';

import { Input } from '@/components/ui/input';

export default function Customers() {
	const selectedCustomer = useCustomerStore(
		(state) => state.selectedCustomer,
	);
	const setSelectedCustomer = useCustomerStore(
		(state) => state.setSelectedCustomer,
	);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSelectedCustomer(e.target.value);
	};

	return (
		<main className='flex w-full flex-1 flex-col items-start justify-between gap-4 p-4 sm:px-6 sm:py-0'>
			<h1>Customers</h1>
			<Input
				type='text'
				placeholder='Customer name'
				value={selectedCustomer ? selectedCustomer : ''}
				onChange={handleInputChange}
			/>
		</main>
	);
}
