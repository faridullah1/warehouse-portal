import { Navigation } from 'app/core/navigation/navigation.types';


export class QuoteManagementAppNavigation
{
    // main navigation
    public static navigation: Navigation = {
		default: [
			{
				type: 'basic',
				icon: 'dashboard',
				link: 'quotes',
				title: 'Dashboard',
				id: 'dashboard',
			},
			{
				type: 'basic',
				icon: 'people',
				link: 'suppliers',
				title: 'Suppliers',
				id: 'suppliers',
				company: true
			},
			{
				type: 'basic',
				icon: 'people',
				link: 'supplier_groups',
				title: 'Supplier Groups',
				id: 'supplier_groups',
				company: true
			}
		],
		horizontal: [
			{
				type: 'basic',
				icon: 'dashboard',
				link: 'quotes',
				title: 'Dashboard',
				id: 'dashboard',
			},
			{
				type: 'basic',
				icon: 'people',
				link: 'suppliers',
				title: 'Suppliers',
				id: 'suppliers',
				company: true
			},
			{
				type: 'basic',
				icon: 'people',
				link: 'supplier_groups',
				title: 'Supplier Groups',
				id: 'supplier_groups',
				company: true
			}
		]
	};
}
