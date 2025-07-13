import { Product } from '../types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Nordic Pro 60%',
    price: 169.99,
    images: [
      'https://images.pexels.com/photos/4383928/pexels-photo-4383928.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4383928/pexels-photo-4383928.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    category: 'Keyboard',
    description: 'Compact 60% mechanical keyboard with Nordic layout, Cherry MX Brown switches and PBT keycaps.',
    specifications: {
      'Switch Type': 'Cherry MX Brown',
      'Keycaps': 'PBT Double-shot',
      'Layout': 'ANSI (60%)',
      'Connectivity': 'USB-C Detachable',
      'Backlighting': 'RGB',
      'Dimensions': '295mm x 105mm x 40mm',
    },
    inStock: true,
    featured: true,
  },
  {
    id: '2',
    name: 'Stealth TKL',
    price: 149.99,
    images: [
      'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1772123/pexels-photo-1772123.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    category: 'Gaming',
    description: 'Tenkeyless gaming keyboard with silent tactile switches for late-night gaming sessions.',
    specifications: {
      'Switch Type': 'Gateron Silent Brown',
      'Keycaps': 'ABS Double-shot',
      'Layout': 'TKL (87 keys)',
      'Connectivity': 'USB-C Detachable',
      'Backlighting': 'RGB',
      'Dimensions': '360mm x 140mm x 35mm',
    },
    inStock: true,
    newArrival: true,
  },
  {
    id: '3',
    name: 'Freedom Wireless',
    price: 199.99,
    images: [
      'https://images.pexels.com/photos/4792729/pexels-photo-4792729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4792729/pexels-photo-4792729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    category: 'Wireless',
    description: 'Multi-device Bluetooth keyboard with hot-swappable switches and up to 3 months battery life.',
    specifications: {
      'Switch Type': 'Hot-swappable',
      'Keycaps': 'PBT Double-shot',
      'Layout': 'Full-size (104 keys)',
      'Connectivity': 'Bluetooth 5.1, USB-C',
      'Battery': '4000mAh',
      'Dimensions': '440mm x 130mm x 40mm',
    },
    inStock: true,
    featured: true,
  },
  {
    id: '4',
    name: 'Minimalist 40%',
    price: 129.99,
    images: [
      'https://images.pexels.com/photos/4383298/pexels-photo-4383298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4383298/pexels-photo-4383298.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    category: 'Compact',
    description: 'Ultra-compact 40% keyboard for minimalists and programming enthusiasts.',
    specifications: {
      'Switch Type': 'Kailh Box White',
      'Keycaps': 'DSA Profile PBT',
      'Layout': '40% (47 keys)',
      'Connectivity': 'USB-C Detachable',
      'Programmable': 'QMK Firmware',
      'Dimensions': '250mm x 100mm x 30mm',
    },
    inStock: false,
  },
  {
    id: '5',
    name: 'Copenhagen Split',
    price: 249.99,
    images: [
      'https://images.pexels.com/photos/1742760/pexels-photo-1742760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1742760/pexels-photo-1742760.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    category: 'Keyboard',
    description: 'Ergonomic split keyboard designed for maximum comfort during long typing sessions.',
    specifications: {
      'Switch Type': 'Zealios V2 67g',
      'Keycaps': 'MT3 Profile PBT',
      'Layout': 'Split (60-65 keys)',
      'Connectivity': 'USB-C with TRRS',
      'Tenting': 'Adjustable 0-20°',
      'Dimensions': '295mm x 220mm x 30mm',
    },
    inStock: true,
    newArrival: true,
  },
  {
    id: '6',
    name: 'PBT Keycap Set - Nordic',
    price: 59.99,
    images: [
      'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    ],
    category: 'Accessories',
    description: 'High-quality PBT keycap set with Nordic legends, compatible with most mechanical keyboards.',
    specifications: {
      'Material': 'PBT Double-shot',
      'Profile': 'Cherry',
      'Compatibility': 'Most MX-style switches',
      'Legends': 'Nordic / ISO',
      'Keycap Count': '126',
      'Thickness': '1.5mm',
    },
    inStock: true,
  },
  {
    id: 'nt7cdecz',
    name: 'Keychron Q1',
    price: 120,
    images: [
      'https://cdn.shopify.com/s/files/1/0059/0630/1017/files/Q1_Pro_1_2048x2048.jpg',
      'https://cdn.shopify.com/s/files/1/0059/0630/1017/files/Q1_Pro_2_2048x2048.jpg',
      'https://cdn.shopify.com/s/files/1/0059/0630/1017/files/Q1_Pro_3_2048x2048.jpg'
    ],
    category: 'Keyboard',
    description: 'The Keychron Q1 is a premium 75% mechanical keyboard featuring a gasket mount design, hot-swappable switches, and a sleek aluminum frame. Perfect for both work and gaming.',
    specifications: {
      'Layout': '75%',
      'Standard': 'ANSI',
      'Switch Type': 'Cherry MX Red',
      'Connectivity': 'Wired',
      'Keycap Material': 'PBT',
      'Case Material': 'Aluminum',
      'PCB Type': 'Hotswap',
      'Plate Material': 'Steel',
      'Backlighting': 'RGB',
      'Dimensions': '325mm x 140mm x 40mm'
    },
    inStock: true,
    featured: true,
    newArrival: false,
  },
];

import { productApi } from '../services/api';

// Transform database product to frontend product interface
function transformDbProduct(dbProduct: any): Product {
  // Safety check for null/undefined product
  if (!dbProduct) {
    throw new Error('Product data is null or undefined');
  }
  
  // Ensure images is always an array
  let images: string[] = [];
  if (Array.isArray(dbProduct.images)) {
    images = dbProduct.images.filter((img: any) => typeof img === 'string' && img.trim() !== '');
  } else if (typeof dbProduct.images === 'string' && dbProduct.images.trim() !== '') {
    images = [dbProduct.images];
  } else if (dbProduct.image && typeof dbProduct.image === 'string' && dbProduct.image.trim() !== '') {
    images = [dbProduct.image];
  }
  
  // If no valid images found, use placeholder
  if (images.length === 0) {
    images = ['https://via.placeholder.com/600x400?text=No+Image+Available'];
  }
  
  return {
    id: dbProduct._id || dbProduct.id || 'unknown',
    name: dbProduct.name || 'Unknown Product',
    price: typeof dbProduct.price === 'number' ? dbProduct.price : 0,
    images: images,
    category: dbProduct.category || 'Uncategorized',
    description: dbProduct.description || '',
    specifications: (typeof dbProduct.specifications === 'object' && dbProduct.specifications !== null) ? dbProduct.specifications : {},
    inStock: (dbProduct.inventory?.quantity || dbProduct.stock || 0) > 0,
    featured: Boolean(dbProduct.featured),
    newArrival: Boolean(dbProduct.newArrival),
  };
}

// Load any products added via the admin interface from localStorage (fallback)
function loadDynamicProducts(): Product[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = JSON.parse(localStorage.getItem('newProducts') || '[]');
    if (!Array.isArray(data)) return [];
    
    // Ensure each product has the required properties and valid images
    return data.map((product: any) => {
      // Ensure images is always an array with at least one item
      let images: string[] = [];
      if (Array.isArray(product.images)) {
        images = product.images.filter((img: any) => typeof img === 'string' && img.trim() !== '');
      } else if (typeof product.images === 'string' && product.images.trim() !== '') {
        images = [product.images];
      }
      
      if (images.length === 0) {
        images = ['https://via.placeholder.com/600x400?text=No+Image+Available'];
      }
      
      return {
        ...product,
        images: images,
        specifications: product.specifications || {},
        inStock: Boolean(product.inStock),
        featured: Boolean(product.featured),
        newArrival: Boolean(product.newArrival),
      };
    });
  } catch {
    return [];
  }
}

/**
 * Get all products - first try API, fallback to static + localStorage
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const response = await productApi.getProducts();
    // Handle different response structures
    let dbProducts = [];
    if (response && response.products && Array.isArray(response.products)) {
      dbProducts = response.products;
    } else if (response && Array.isArray(response)) {
      dbProducts = response;
    } else if (response && response.data && Array.isArray(response.data)) {
      dbProducts = response.data;
    } else {
      console.warn('Unexpected API response structure:', response);
      dbProducts = [];
    }
    
    // Transform database products
    const transformedDbProducts = dbProducts.map(transformDbProduct);
    
    // Also include localStorage products for immediate visibility of newly added products
    const localProducts = loadDynamicProducts();
    
    // Combine and deduplicate (prefer API products over localStorage ones)
    const apiProductIds = new Set(transformedDbProducts.map((p: Product) => p.id));
    const uniqueLocalProducts = localProducts.filter((p: Product) => !apiProductIds.has(p.id));
    
    return [...transformedDbProducts, ...uniqueLocalProducts];
  } catch (error) {
    console.warn('Failed to fetch products from API, using static data:', error);
    // Fallback to static products + localStorage
    return [...products, ...loadDynamicProducts()];
  }
}

/**
 * Synchronous version for backward compatibility
 */
export function getAllProductsSync(): Product[] {
  return [...products, ...loadDynamicProducts()];
}

// API-based product queries with fallbacks
export const getFeaturedProducts = async (): Promise<Product[]> => {
  try {
    const response = await productApi.getFeaturedProducts();
    // Handle different response structures
    let dbProducts = [];
    if (response && response.products && Array.isArray(response.products)) {
      dbProducts = response.products;
    } else if (response && Array.isArray(response)) {
      dbProducts = response;
    } else if (response && response.data && Array.isArray(response.data)) {
      dbProducts = response.data;
    } else {
      console.warn('Unexpected featured products API response structure:', response);
      dbProducts = [];
    }
    return dbProducts.map(transformDbProduct);
  } catch (error) {
    console.warn('Failed to fetch featured products from API, using static data:', error);
    return getAllProductsSync().filter(product => product.featured);
  }
};

export const getNewArrivals = async (): Promise<Product[]> => {
  try {
    const response = await productApi.getNewArrivals();
    // Handle different response structures
    let dbProducts = [];
    if (response && response.products && Array.isArray(response.products)) {
      dbProducts = response.products;
    } else if (response && Array.isArray(response)) {
      dbProducts = response;
    } else if (response && response.data && Array.isArray(response.data)) {
      dbProducts = response.data;
    } else {
      console.warn('Unexpected new arrivals API response structure:', response);
      dbProducts = [];
    }
    return dbProducts.map(transformDbProduct);
  } catch (error) {
    console.warn('Failed to fetch new arrivals from API, using static data:', error);
    return getAllProductsSync().filter(product => product.newArrival);
  }
};

export const getProductById = async (id: string): Promise<Product | undefined> => {
  try {
    const dbProduct = await productApi.getProductById(id);
    
    // Handle different response structures from API
    let productData = null;
    if (dbProduct && dbProduct.product) {
      productData = dbProduct.product;
    } else if (dbProduct && dbProduct.data) {
      productData = dbProduct.data;
    } else if (dbProduct) {
      productData = dbProduct;
    }
    
    if (!productData) {
      console.warn(`Product with ID ${id} not found in API response`);
      return getAllProductsSync().find(product => product.id === id);
    }
    
    return transformDbProduct(productData);
  } catch (error) {
    console.warn('Failed to fetch product from API, using static data:', error);
    return getAllProductsSync().find(product => product.id === id);
  }
};

export const getProductsByCategory = async (category: string): Promise<Product[]> => {
  try {
    const response = await productApi.getProducts({ category });
    // Handle different response structures
    let dbProducts = [];
    if (response && response.products && Array.isArray(response.products)) {
      dbProducts = response.products;
    } else if (response && Array.isArray(response)) {
      dbProducts = response;
    } else if (response && response.data && Array.isArray(response.data)) {
      dbProducts = response.data;
    } else {
      console.warn('Unexpected products by category API response structure:', response);
      dbProducts = [];
    }
    return dbProducts.map(transformDbProduct);
  } catch (error) {
    console.warn('Failed to fetch products by category from API, using static data:', error);
    return getAllProductsSync().filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
};

/**
 * Search products by query string
 * Searches in product name, description, and category
 */
export const searchProducts = async (query: string): Promise<Product[]> => {
  if (!query || query.trim() === '') {
    return getAllProducts();
  }
  
  const searchTerm = query.toLowerCase().trim();
  const allProducts = await getAllProducts();
  
  return allProducts.filter(product => {
    const nameMatch = product.name.toLowerCase().includes(searchTerm);
    const descriptionMatch = product.description.toLowerCase().includes(searchTerm);
    const categoryMatch = product.category.toLowerCase().includes(searchTerm);
    
    // Also search in specifications values
    const specMatch = Object.values(product.specifications).some(
      value => value.toLowerCase().includes(searchTerm)
    );
    
    return nameMatch || descriptionMatch || categoryMatch || specMatch;
  });
};