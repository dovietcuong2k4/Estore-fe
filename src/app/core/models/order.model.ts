import { Product } from './product.model';
import { User } from './user.model';

/** Synced with BE order status flow */
export type OrderStatus =
  | 'CREATED'
  | 'PROCESSING'
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

export interface CartItemRequest {
  productId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  note?: string;
  items?: CartItemRequest[];
}

// --- BE Response Types ---

export interface OrderItemResponse {
  id: number;
  product: ProductInOrderResponse;
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
  totalPrice?: number;
  orderItems: OrderItemResponse[];
}

interface ProductImageResponse {
  id?: number;
  imageUrl: string;
  isThumbnail: boolean;
  sortOrder: number;
  publicId?: string;
}

interface ProductInOrderResponse {
  id: number;
  name: string;
  price: number;
  cpu?: string;
  ram?: string;
  screen?: string;
  operatingSystem?: string;
  batteryCapacity?: string;
  design?: string;
  warrantyInfo?: string;
  description?: string;
  soldQuantity?: number;
  stockQuantity?: number;
  categoryId?: number;
  categoryName?: string;
  brandId?: number;
  brandName?: string;
  images?: ProductImageResponse[];
}

/** Maps BE OrderResponse to FE Order */
export function mapOrderResponseToOrder(res: OrderResponse): Order {
  const items: OrderItem[] = (res.orderItems ?? []).map(item => ({
    id: item.id,
    orderId: res.id,
    productId: item.product?.id ?? 0,
    quantity: item.quantity,
    price: item.price,
    product: mapProductInOrder(item.product as ProductInOrderResponse | undefined)
  }));

  const totalPrice = res.totalPrice ?? items.reduce((sum, item) => sum + item.price * item.quantity, 0);

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
    totalPrice,
    user: res.user ? mapUserInOrder(res.user) : undefined,
    shipper: res.shipper ? mapUserInOrder(res.shipper) : undefined
  };
}

function mapUserInOrder(user: UserInOrderResponse): User {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    address: user.address,
    roles: (user.roles ?? []).map((role, index) => ({ id: index + 1, name: role as any }))
  };
}

function mapProductInOrder(product?: ProductInOrderResponse): Product | undefined {
  if (!product) return undefined;

  const images = product.images ?? [];
  const thumbnail = images.find(image => image.isThumbnail)?.imageUrl;
  const image = thumbnail || images[0]?.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image';

  return {
    id: product.id,
    name: product.name,
    price: product.price,
    categoryId: product.categoryId ?? 0,
    categoryName: product.categoryName ?? '',
    brandId: product.brandId ?? 0,
    brandName: product.brandName ?? '',
    image,
    images,
    cpu: product.cpu ?? 'N/A',
    ram: product.ram ?? 'N/A',
    screen: product.screen ?? 'N/A',
    operatingSystem: product.operatingSystem ?? 'N/A',
    batteryCapacity: product.batteryCapacity ?? 'N/A',
    design: product.design ?? 'N/A',
    warrantyInfo: product.warrantyInfo ?? 'N/A',
    description: product.description ?? '',
    soldQuantity: product.soldQuantity ?? 0,
    stockQuantity: product.stockQuantity ?? 0
  };
}
