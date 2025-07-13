// Product service for business logic
import { Product } from '../models/index.js';

class ProductService {
  // Create a new product
  async createProduct(productData) {
    try {
      console.log('ProductService: Creating product with data:', productData);
      
      // Validate required fields
      if (!productData.name || !productData.price || !productData.category) {
        throw new Error('Missing required fields: name, price, and category are required');
      }

      // Create the product
      const product = await Product.createProduct(productData);
      
      console.log('ProductService: Product created successfully:', product._id);
      return product;
    } catch (error) {
      console.error('ProductService: Error creating product:', error);
      throw error;
    }
  }

  // Get all products with filtering
  async getProducts(filters = {}) {
    try {
      const { 
        page = 1, 
        limit = 50, 
        category, 
        search, 
        featured, 
        newArrival, 
        minPrice, 
        maxPrice 
      } = filters;

      let query = { isActive: true };

      // Add category filter
      if (category) {
        query.category = category;
      }

      // Add featured filter
      if (featured === true) {
        query.featured = true;
      }

      // Add new arrival filter
      if (newArrival === true) {
        query.newArrival = true;
      }

      // Add price range filter
      if (minPrice !== null || maxPrice !== null) {
        query.price = {};
        if (minPrice !== null) query.price.$gte = minPrice;
        if (maxPrice !== null) query.price.$lte = maxPrice;
      }

      // Search functionality
      if (search) {
        return await Product.search(search);
      }

      // Calculate pagination
      const skip = (page - 1) * limit;
      const options = {
        skip,
        limit: parseInt(limit),
        sort: { createdAt: -1 }
      };

      const products = await Product.find(query, options);
      const total = await Product.count(query);

      return {
        products,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('ProductService: Error fetching products:', error);
      throw error;
    }
  }

  // Get single product by ID
  async getProductById(id) {
    try {
      const product = await Product.findById(id);
      
      if (!product) {
        throw new Error('Product not found');
      }

      // Increment view count
      await Product.incrementViews(id);

      return product;
    } catch (error) {
      console.error('ProductService: Error fetching product by ID:', error);
      throw error;
    }
  }

  // Get featured products
  async getFeaturedProducts() {
    try {
      return await Product.findFeatured();
    } catch (error) {
      console.error('ProductService: Error fetching featured products:', error);
      throw error;
    }
  }

  // Get new arrivals
  async getNewArrivals(limit = 10) {
    try {
      return await Product.findNewArrivals(limit);
    } catch (error) {
      console.error('ProductService: Error fetching new arrivals:', error);
      throw error;
    }
  }

  // Update product
  async updateProduct(id, updateData) {
    try {
      const product = await Product.updateById(id, updateData);
      
      if (!product) {
        throw new Error('Product not found');
      }

      return product;
    } catch (error) {
      console.error('ProductService: Error updating product:', error);
      throw error;
    }
  }

  // Delete product (soft delete)
  async deleteProduct(id) {
    try {
      const product = await Product.updateById(id, { isActive: false });
      
      if (!product) {
        throw new Error('Product not found');
      }

      return { success: true, message: 'Product deleted successfully' };
    } catch (error) {
      console.error('ProductService: Error deleting product:', error);
      throw error;
    }
  }

  // Update product stock
  async updateStock(id, quantity) {
    try {
      return await Product.updateStock(id, quantity);
    } catch (error) {
      console.error('ProductService: Error updating stock:', error);
      throw error;
    }
  }
}

export default new ProductService();
