/*export interface ProductResponse {
    productId: number,
    productName: string,
    productDesc: number,
    productPrice: number,
    quantity: number,
    status: boolean
}*/

export interface Product {
    productId: number;
    productName: string;
    productDesc: string;
    productPrice: number;
    quantity: number;
    status: boolean;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: {
        empty: boolean;
        sorted: boolean;
        unsorted: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface ProductResponse {
    content: Product[];
    pageable: Pageable
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    number: number;
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}
