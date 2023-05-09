export type UserLanguage = 'en' | 'nl';
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
	avatar: string;
	name: string;
	email: string;
	department?: Department;
	language: UserLanguage;
	type: UserType;
}

export interface KolliAppFile {
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
	file: KolliAppFile;
}
