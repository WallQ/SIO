import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type YearStore = {
    selectedYear: string | null;
    setSelectedYear: (selectedYear: string) => void;
};

export const useSelectedYearStore = create<YearStore>()(
    persist(
        (set) => ({
            selectedYear: null,
            setSelectedYear: (year) => set({ selectedYear: year }),
        }),
        {
            name: "year-storage",
            storage: createJSONStorage(() => sessionStorage),
        },
    ),
);