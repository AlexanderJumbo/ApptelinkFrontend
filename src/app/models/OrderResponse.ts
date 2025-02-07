export interface Order {
    orderId: number;
    dateInvoice: string;
    amount: number;
    subtotal: number | null;
    clientId: number;
    client: string;
    orderDetails: any | null;  // Puede ser cualquier tipo, lo he puesto como `any` o `null` en caso de que no esté presente
}

export interface Sort {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
}

export interface Pageable {
    pageNumber: number;
    pageSize: number;
    sort: Sort;
    offset: number;
    paged: boolean;
    unpaged: boolean;
}

export interface OrderResponse {
    content: Order[];
    pageable: Pageable;
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: Sort;
    numberOfElements: number;
    first: boolean;
    empty: boolean;
}
