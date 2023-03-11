import { Navigation } from 'app/core/navigation/navigation.types';


export class Warehouse_App_Navigation
{
    // main navigation
    public static navigation: Navigation = {
		default: [
			{
				type: 'basic',
				icon: 'people',
				link: 'users',
				title: 'Warehouse Personnel',
				id: 'warehouse_personnel',
			}
		],
		horizontal: [
			{
				type: 'basic',
				icon: 'people',
				link: 'users',
				title: 'Warehouse Personnel',
				id: 'warehouse_personnel',
			}
		]
	};
}
