import { companies } from '@/server/db/relational-schema';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type CompanyStore = {
	selectedCompany: typeof companies | null;
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
