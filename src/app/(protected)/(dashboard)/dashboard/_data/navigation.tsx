import { APP_ROUTES } from '@/routes/app';
import {
	BarChart3,
	LayoutDashboard,
	PackageIcon,
	ReceiptText,
	Truck,
	Users2Icon,
} from 'lucide-react';

export const navigationItems = [
	{
		title: 'Overview',
		icon: LayoutDashboard,
		href: APP_ROUTES.DASHBOARD.ROOT,
	},
	{
		title: 'Transactions',
		icon: ReceiptText,
		href: APP_ROUTES.DASHBOARD.TRANSACTIONS,
	},
	{
		title: 'Stock',
		icon: PackageIcon,
		href: APP_ROUTES.DASHBOARD.STOCK,
	},
	{
		title: 'Customers',
		icon: Users2Icon,
		href: APP_ROUTES.DASHBOARD.CUSTOMERS,
	},
	{
		title: 'Suppliers',
		icon: Truck,
		href: APP_ROUTES.DASHBOARD.SUPPLIERS,
	},
	{
		title: 'Analytics',
		icon: BarChart3,
		href: APP_ROUTES.DASHBOARD.ANALYTICS,
	},
];
