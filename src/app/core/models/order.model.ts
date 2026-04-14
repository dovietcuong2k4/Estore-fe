import { Product } from './product.model';
import { User } from './user.model';

/** Synced with BE order status flow */
export type OrderStatus =
  | 'CREATED'
  | 'CONFIRMED'
  | 'PREPARING'
  | 'READY_FOR_SHIPPING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'DELIVERY_FAILED'
  | 'CANCELLED';

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  price: number;
  product?: Product;
}

/** FE internal Order model */
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
  user?: User;
  shipper?: User;
}

export interface CreateOrderRequest {
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  note?: string;
}

// --- BE Response Types ---

export interface OrderItemResponse {
  id: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface UserInOrderResponse {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  roles: string[];
}

/** Matches BE Order response exactly */
export interface OrderResponse {
  id: number;
  user: UserInOrderResponse;
  shipper: UserInOrderResponse | null;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  note: string;
  orderDate: string;
  shippingDate: string | null;
  receivedDate: string | null;
  status: string;
  orderItems: OrderItemResponse[];
}

/** Maps BE OrderResponse to FE Order */
export function mapOrderResponseToOrder(res: OrderResponse): Order {
  const items: OrderItem[] = (res.orderItems ?? []).map(item => ({
    id: item.id,
    orderId: res.id,
    productId: item.product?.id ?? 0,
    quantity: item.quantity,
    price: item.price,
    product: item.product
  }));

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    id: res.id,
    userId: res.user?.id ?? 0,
    shipperId: res.shipper?.id,
    receiverName: res.receiverName,
    receiverPhone: res.receiverPhone,
    receiverAddress: res.receiverAddress,
    note: res.note,
    orderDate: res.orderDate,
    shippingDate: res.shippingDate ?? undefined,
    receivedDate: res.receivedDate ?? undefined,
    status: res.status as OrderStatus,
    items,
    totalPrice
  };
}
