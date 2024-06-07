import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type CustomerStore = {
	selectedCustomer: string | null;
	setSelectedCustomer: (selectedCustomer: string) => void;
};

export const useCustomerStore = create<CustomerStore>()(
	persist(
		(set) => ({
			selectedCustomer: null,
			setSelectedCustomer: (customer) =>
				set({ selectedCustomer: customer }),
		}),
		{
			name: 'customer-storage',
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
