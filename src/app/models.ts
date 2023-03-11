export type QuoteStatus = 'Draft' | 'Approved' | 'Released' | 'Finished';
export interface GenericApiResponse {
	status: 'success' | 'failed';
	data: any;
	totalRecords?: number;
};

export interface User {
	id: number;
	name: string;
	email: string;
	password: string;
	company: boolean;
}

export interface Quote {
	quoteId: number;
	name: string;
	startDate: Date;
	endDate: Date;
	status: QuoteStatus;
	quote_items: QuoteItem[];
}

export interface QuoteItem {
	itemId?: number;
	name: string;
	quantity: number;
	price: number;
	quoteId: number | null;
	group?: SupplierGroup;
	groupId?: number;
	editable?: boolean;
	biddings?: Bid[];
}

export interface Bid {
	biddingId: number;
	price: number;
	amount: number;
	deliveryTime: Date;
	deliveryTimeUnit: 'Days' | 'Weeks';
	comments: string;
	isIgnoredBid: boolean;
	supplierId: number;
	itemId: number;
}

export interface SupplierGroup {
	groupId: number;
	name: string;
	suppliers: Supplier[];
}

export interface Supplier {
	groupId: number;
	supplierId: number;
	supplier: {
		firstName: string;
		lastName: string;
		email: string;
		status: 'New'
	}
}