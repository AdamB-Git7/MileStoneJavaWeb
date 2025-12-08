export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface OrderSummary {
  id: number;
  customerName?: string;
  products?: string[];
  totalAmount?: number;
  dateCreated?: string;
}

export interface CustomerSummary extends Customer {
  orders: OrderSummary[];
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  stockQuantity: number;
  concentration?: string | null;
  description?: string | null;
}

export interface OrderPayload {
  customerId: number;
  productIds: number[];
}
