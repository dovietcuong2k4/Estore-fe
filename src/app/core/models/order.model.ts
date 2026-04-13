import { Product } from './product.model';

export type OrderStatus = 'CREATED' | 'PENDING' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'DELIVERY_FAILED' | 'CANCELLED';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface Order {
  id: number;
  userId: number;
  shipperId?: number;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  note?: string;
  orderDate: string;
  shippingDate?: string;
  receivedDate?: string;
  status: OrderStatus;
  items: OrderItem[];
  totalPrice?: number;
}

export interface CreateOrderRequest {
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  note?: string;
}
