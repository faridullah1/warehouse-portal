export interface User
{
    id: number;
    name: string;
    email: string;
    language?: 'en' | 'nl';
	type?: 'Super_Admin' | 'Admin';

	avatar?: string;
	status?: string;
}
