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
