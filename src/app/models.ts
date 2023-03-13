export interface GenericApiResponse {
	status: 'success' | 'failed';
	data: any;
	totalRecords?: number;
};

export interface User {
	userId: number;
	name: string;
	email: string;
	password: string;
}

export interface WarehouseFile {
	fileId: number;
	reference: string;
	pictures: string[];
	isDamaged: boolean;
}