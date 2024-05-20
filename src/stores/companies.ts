import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { type Company } from '@/types/company';

type CompanyStore = {
	selectedCompany: Company | null;
	setSelectedCompany: (selectedCompany: Company) => void;
};

export const useCompanyStore = create<CompanyStore>()(
	persist(
		(set) => ({
			selectedCompany: null,
			setSelectedCompany: (company) => set({ selectedCompany: company }),
		}),
		{
			name: 'company-storage',
			storage: createJSONStorage(() => sessionStorage),
		},
	),
);
