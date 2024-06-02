import { type companyDimension } from '@/server/db/star-schema';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type CompanyStore = {
	selectedCompany: typeof companyDimension.$inferSelect | null;
	setSelectedCompany: (
		selectedCompany: typeof companyDimension.$inferSelect,
	) => void;
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
