import { type Invoice } from '@/types/invoice';
import { create } from 'zustand';

type InvoiceStore = {
	selectedInvoice: Invoice | null;
	setSelectedInvoice: (invoice: Invoice) => void;
};

const useInvoiceDetailsStore = create<InvoiceStore>((set) => ({
	selectedInvoice: null,
	setSelectedInvoice: (invoice) => set({ selectedInvoice: invoice }),
}));

export default useInvoiceDetailsStore;
