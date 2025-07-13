import { ObjectId } from 'mongodb';
import { getDB } from '../config/database.js';
import bcrypt from 'bcryptjs';

// Base Model class with common MongoDB operations
class BaseModel {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  getCollection() {
    const db = getDB();
    return db.collection(this.collectionName);
  }

  async findById(id) {
    try {
      const collection = this.getCollection();
      return await collection.findOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new Error(`Error finding document by ID: ${error.message}`);
    }
  }

  async findOne(query) {
    try {
      const collection = this.getCollection();
      return await collection.findOne(query);
    } catch (error) {
      throw new Error(`Error finding document: ${error.message}`);
    }
  }

  async find(query = {}, options = {}) {
    try {
      const collection = this.getCollection();
      return await collection.find(query, options).toArray();
    } catch (error) {
      throw new Error(`Error finding documents: ${error.message}`);
    }
  }

  async create(data) {
    try {
      const collection = this.getCollection();
      const timestamp = new Date();
      const documentWithTimestamps = {
        ...data,
        createdAt: timestamp,
        updatedAt: timestamp
      };
      const result = await collection.insertOne(documentWithTimestamps);
      return { _id: result.insertedId, ...documentWithTimestamps };
    } catch (error) {
      throw new Error(`Error creating document: ${error.message}`);
    }
  }

  async updateById(id, updateData) {
    try {
      const collection = this.getCollection();
      const updateWithTimestamp = {
        ...updateData,
        updatedAt: new Date()
      };
      const result = await collection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateWithTimestamp }
      );
      return result;
    } catch (error) {
      throw new Error(`Error updating document: ${error.message}`);
    }
  }

  async deleteById(id) {
    try {
      const collection = this.getCollection();
      return await collection.deleteOne({ _id: new ObjectId(id) });
    } catch (error) {
      throw new Error(`Error deleting document: ${error.message}`);
    }
  }

  async count(query = {}) {
    try {
      const collection = this.getCollection();
      return await collection.countDocuments(query);
    } catch (error) {
      throw new Error(`Error counting documents: ${error.message}`);
    }
  }
}

// User Model
class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  async createUser(userData) {
    try {
      // Hash password before saving
      if (userData.password) {
        const salt = await bcrypt.genSalt(12);
        userData.password = await bcrypt.hash(userData.password, salt);
      }

      // Ensure unique email
      const existingUser = await this.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      const user = await this.create({
        ...userData,
        role: userData.role || 'user',
        isActive: userData.isActive !== undefined ? userData.isActive : true,
        lastLogin: null
      });

      // Remove password from returned user object
      delete user.password;
      return user;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  async findByEmail(email) {
    return await this.findOne({ email: email.toLowerCase() });
  }

  async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async updateLastLogin(userId) {
    return await this.updateById(userId, { lastLogin: new Date() });
  }
}

// Product Model
class ProductModel extends BaseModel {
  constructor() {
    super('products');
  }

  async createProduct(productData) {
    return await this.create({
      ...productData,
      isActive: productData.isActive !== undefined ? productData.isActive : true,
      stock: productData.stock || 0,
      sold: 0,
      views: 0
    });
  }

  async findByCategory(category) {
    return await this.find({ category, isActive: true });
  }

  async findFeatured() {
    return await this.find({ featured: true, isActive: true });
  }

  async findNewArrivals(limit = 10) {
    const options = {
      sort: { createdAt: -1 },
      limit: limit
    };
    return await this.find({ isActive: true }, options);
  }

  async search(searchTerm) {
    const query = {
      isActive: true,
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { category: { $regex: searchTerm, $options: 'i' } },
        { tags: { $in: [new RegExp(searchTerm, 'i')] } }
      ]
    };
    return await this.find(query);
  }

  async updateStock(productId, quantity) {
    return await this.updateById(productId, { stock: quantity });
  }

  async incrementViews(productId) {
    const collection = this.getCollection();
    return await collection.updateOne(
      { _id: new ObjectId(productId) },
      { $inc: { views: 1 }, $set: { updatedAt: new Date() } }
    );
  }
}

// Order Model
class OrderModel extends BaseModel {
  constructor() {
    super('orders');
  }

  async createOrder(orderData) {
    return await this.create({
      ...orderData,
      status: orderData.status || 'pending',
      paymentStatus: orderData.paymentStatus || 'pending',
      orderNumber: await this.generateOrderNumber()
    });
  }

  async generateOrderNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    const count = await this.count({
      createdAt: {
        $gte: new Date(year, date.getMonth(), date.getDate()),
        $lt: new Date(year, date.getMonth(), date.getDate() + 1)
      }
    });
    
    const orderNumber = `KNC-${year}${month}${day}-${String(count + 1).padStart(4, '0')}`;
    return orderNumber;
  }

  async findByUserId(userId) {
    return await this.find({ userId: new ObjectId(userId) }, { sort: { createdAt: -1 } });
  }

  async findByStatus(status) {
    return await this.find({ status }, { sort: { createdAt: -1 } });
  }

  async updateStatus(orderId, status) {
    return await this.updateById(orderId, { status, statusUpdatedAt: new Date() });
  }

  async updatePaymentStatus(orderId, paymentStatus, paymentId = null) {
    const updateData = { 
      paymentStatus, 
      paymentStatusUpdatedAt: new Date() 
    };
    if (paymentId) {
      updateData.paymentId = paymentId;
    }
    return await this.updateById(orderId, updateData);
  }
}

// OrderItem Model
class OrderItemModel extends BaseModel {
  constructor() {
    super('orderItems');
  }

  async createOrderItem(orderItemData) {
    return await this.create(orderItemData);
  }

  async findByOrderId(orderId) {
    return await this.find({ orderId: new ObjectId(orderId) });
  }
}

// Shipment Model
class ShipmentModel extends BaseModel {
  constructor() {
    super('shipments');
  }

  async createShipment(shipmentData) {
    return await this.create({
      ...shipmentData,
      status: shipmentData.status || 'preparing'
    });
  }

  async findByOrderId(orderId) {
    return await this.findOne({ orderId: new ObjectId(orderId) });
  }

  async updateTrackingInfo(shipmentId, trackingNumber, carrier) {
    return await this.updateById(shipmentId, {
      trackingNumber,
      carrier,
      status: 'shipped',
      shippedAt: new Date()
    });
  }
}

// Inventory Model
class InventoryModel extends BaseModel {
  constructor() {
    super('inventory');
  }

  async createInventoryRecord(inventoryData) {
    return await this.create(inventoryData);
  }

  async findByProductId(productId) {
    return await this.findOne({ productId: new ObjectId(productId) });
  }

  async updateStock(productId, quantity, operation = 'set') {
    const collection = this.getCollection();
    let updateQuery;
    
    if (operation === 'increment') {
      updateQuery = { $inc: { quantity: quantity }, $set: { updatedAt: new Date() } };
    } else if (operation === 'decrement') {
      updateQuery = { $inc: { quantity: -quantity }, $set: { updatedAt: new Date() } };
    } else {
      updateQuery = { $set: { quantity: quantity, updatedAt: new Date() } };
    }

    return await collection.updateOne(
      { productId: new ObjectId(productId) },
      updateQuery,
      { upsert: true }
    );
  }
}

// Create and export model instances
export const User = new UserModel();
export const Product = new ProductModel();
export const Order = new OrderModel();
export const OrderItem = new OrderItemModel();
export const Shipment = new ShipmentModel();
export const Inventory = new InventoryModel();
