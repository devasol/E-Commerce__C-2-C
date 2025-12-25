export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'seller' | 'admin';
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  avatar?: string;
}

export interface Category {
  _id: string;
  name: string;
  description?: string;
  image?: string;
  parent?: string;
  isActive: boolean;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string | Category;
  subcategory?: string;
  brand?: string;
  images: string[];
  stock: number;
  sold: number;
  ratings: {
    average: number;
    count: number;
  };
  discount?: number;
  seller: string | User;
  isActive: boolean;
  tags?: string[];
}

export interface CartItem {
  product: string | Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id?: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface OrderItem {
  product: string | Product;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface ShippingAddress {
  fullName: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

export interface Order {
  _id: string;
  user: string | User;
  orderItems: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: 'card' | 'mobile banking' | 'cash on delivery';
  paymentResult?: {
    id?: string;
    status?: string;
    updateTime?: string;
    email_address?: string;
  };
  itemsPrice: number;
  taxPrice: number;
  shippingPrice: number;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  loading: boolean;
}