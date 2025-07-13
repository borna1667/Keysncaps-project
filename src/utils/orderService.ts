// Order service for interacting with the order API
import { CartItem } from '../types';

// Define interfaces for our order types
export interface ShippingAddress {
  fullName?: string;
  name?: string;
  addressLine1?: string;
  address?: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postal?: string;
  postalCode?: string;
  country: string;
  phone: string;
  email: string;
  shippingMethod?: string;
  deliveryEstimate?: string;
}

export interface OrderItem {
  productId: string;
  name?: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface PaymentInfo {
  paymentId?: string;
  paymentIntentId?: string;
  paymentMethod?: string;
  paymentStatus?: 'pending' | 'paid' | 'failed';
}

export interface ShippingMethod {
  method: string;
  cost: number;
}

export interface Order {
  _id?: string;
  userId?: string;
  items: OrderItem[];
  shippingAddress?: ShippingAddress;
  shipping?: ShippingAddress;
  paymentInfo?: PaymentInfo;
  shippingMethod?: ShippingMethod;
  subtotal?: number;
  tax?: number;
  total?: number;
  totalAmount?: number;
  currency?: string;
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const API_URL = import.meta.env.VITE_API_URL || '';

export const orderService = {
  // Create a new order
  createOrder: async (orderData: Order): Promise<Order> => {
    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create order');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },
  
  // Get order by ID
  getOrderById: async (orderId: string): Promise<Order> => {
    try {
      const response = await fetch(`${API_URL}/api/orders/${orderId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch order');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      throw error;
    }
  },
  
  // Get all orders for a user
  getUserOrders: async (userId: string): Promise<Order[]> => {
    try {
      const response = await fetch(`${API_URL}/api/orders/user/${userId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch orders');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  },
};

export default orderService;
