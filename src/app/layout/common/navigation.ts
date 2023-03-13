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
			},
			{
				type: 'basic',
				icon: 'timeline',
				link: 'timeline',
				title: 'Timeline',
				id: 'timeline',
			},
			{
				type: 'basic',
				icon: 'photo_library',
				link: 'files',
				title: 'Files',
				id: 'files',
			}
		],
		horizontal: [
			{
				type: 'basic',
				icon: 'people',
				link: 'users',
				title: 'Warehouse Personnel',
				id: 'warehouse_personnel',
			},
			{
				type: 'basic',
				icon: 'timeline',
				link: 'timeline',
				title: 'Timeline',
				id: 'timeline',
			},
			{
				type: 'basic',
				icon: 'photo_library',
				link: 'files',
				title: 'Files',
				id: 'files',
			}
		]
	};
}
