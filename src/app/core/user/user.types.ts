export interface User
{
    id: number;
    name: string;
    email: string;
	type?: 'Super_Admin' | 'Admin';

	avatar?: string;
	status?: string;
}
