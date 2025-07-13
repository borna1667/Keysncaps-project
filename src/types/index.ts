export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  images: string[];
  inStock: boolean;
  featured?: boolean;
  specifications: Record<string, string>;
}

export type Category = 'Keyboard' | 'Wireless' | 'Gaming' | 'Compact' | 'Accessories' | 'Switches' | 'Keycaps' | 'Barebones';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface NavLink {
  name: string;
  path: string;
}