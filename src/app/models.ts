export type UserLanguage = 'en' | 'dutch';
export type UserType = 'Admin' | 'User';

export interface GenericApiResponse {
	status: 'success' | 'failed';
	data: any;
	totalRecords?: number;
};

export interface Department {
	departmentId: number;
	name: string;
}

export interface User {
	userId: number;
	name: string;
	email: string;
	department: Department;
	language: UserLanguage;
	type: UserType;
}

export interface WarehouseFile {
	fileId: number;
	reference: string;
	containerNumber: string;
	pictures: string[];
	noOfDamagedGoods: number;
	maxImagesToShow: number;
	createdAt: string;
	file_images: FilePicture[];
	user: User;
}

export interface FilePicture {
	fileImageId: number;
	url: string;
	createdAt: string;
	file: WarehouseFile;
}
