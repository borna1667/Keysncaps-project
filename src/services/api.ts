// API service for communicating with the backend
import axios from 'axios';
import { Product } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4242';

// Configure axios defaults
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Product API functions
export const productApi = {
  // Get all products with optional filtering
  async getProducts(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    featured?: boolean;
    newArrival?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }) {
    try {
      const response = await api.get('/api/products', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Get single product by ID
  async getProductById(id: string) {
    try {
      const response = await api.get(`/api/products/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Create new product (admin only)
  async createProduct(productData: any, token: string) {
    try {
      const response = await api.post('/api/products', productData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },

  // Get featured products
  async getFeaturedProducts() {
    try {
      const response = await api.get('/api/products', {
        params: { featured: true }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured products:', error);
      throw error;
    }
  },

  // Get new arrivals
  async getNewArrivals() {
    try {
      const response = await api.get('/api/products', {
        params: { newArrival: true }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching new arrivals:', error);
      throw error;
    }
  },

  // Search products
  async searchProducts(query: string) {
    try {
      const response = await api.get('/api/products', {
        params: { search: query }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  },
};

export default api;
