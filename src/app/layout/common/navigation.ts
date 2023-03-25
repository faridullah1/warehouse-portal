import { Navigation } from 'app/core/navigation/navigation.types';


// eslint-disable-next-line @typescript-eslint/naming-convention
export class Warehouse_App_Navigation
{
    // main navigation
    public static navigation: Navigation = {
		default: [
			{
				type: 'basic',
				icon: 'people',
				link: 'users',
				title: 'Account Management',
				id: 'account_management',
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
				title: 'Account Management',
				id: 'account_management',
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
