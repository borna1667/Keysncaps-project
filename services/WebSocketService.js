// WebSocket service for real-time updates
import { WebSocketServer } from 'ws';

class WebSocketService {
  constructor() {
    this.wss = null;
    this.clients = new Set();
  }

  initialize(server) {
    this.wss = new WebSocketServer({ server });
    
    this.wss.on('connection', (ws, req) => {
      console.log('👥 New WebSocket client connected');
      this.clients.add(ws);

      // Send welcome message
      ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to Keys\'n\'Caps real-time updates',
        timestamp: new Date().toISOString()
      }));

      // Handle client messages
      ws.on('message', (data) => {
        try {
          const message = JSON.parse(data);
          console.log('📨 Received message from client:', message);
          
          // Handle different message types
          switch (message.type) {
            case 'subscribe':
              ws.subscriptions = message.channels || ['products', 'orders'];
              console.log(`Client subscribed to: ${ws.subscriptions.join(', ')}`);
              break;
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      });

      // Handle client disconnect
      ws.on('close', () => {
        console.log('👋 WebSocket client disconnected');
        this.clients.delete(ws);
      });

      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });

    console.log('🔌 WebSocket server initialized');
  }

  // Broadcast message to all clients
  broadcast(data) {
    const message = JSON.stringify({
      ...data,
      timestamp: new Date().toISOString()
    });

    this.clients.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        try {
          client.send(message);
        } catch (error) {
          console.error('Error sending WebSocket message:', error);
          this.clients.delete(client);
        }
      }
    });
  }

  // Broadcast to specific channel subscribers
  broadcastToChannel(channel, data) {
    const message = JSON.stringify({
      ...data,
      channel,
      timestamp: new Date().toISOString()
    });

    this.clients.forEach(client => {
      if (client.readyState === 1 && 
          (!client.subscriptions || client.subscriptions.includes(channel))) {
        try {
          client.send(message);
        } catch (error) {
          console.error('Error sending WebSocket message:', error);
          this.clients.delete(client);
        }
      }
    });
  }

  // Product-specific notifications
  notifyProductCreated(product) {
    this.broadcastToChannel('products', {
      type: 'product_created',
      data: product,
      message: `New product "${product.name}" has been added to the catalog`
    });
  }

  notifyProductUpdated(product) {
    this.broadcastToChannel('products', {
      type: 'product_updated',
      data: product,
      message: `Product "${product.name}" has been updated`
    });
  }

  notifyProductDeleted(productId, productName) {
    this.broadcastToChannel('products', {
      type: 'product_deleted',
      data: { id: productId, name: productName },
      message: `Product "${productName}" has been removed`
    });
  }

  // Order-specific notifications
  notifyOrderCreated(order) {
    this.broadcastToChannel('orders', {
      type: 'order_created',
      data: order,
      message: `New order #${order.orderNumber} has been placed`
    });
  }

  notifyOrderUpdated(order) {
    this.broadcastToChannel('orders', {
      type: 'order_updated',
      data: order,
      message: `Order #${order.orderNumber} status updated to ${order.status}`
    });
  }

  // Inventory notifications
  notifyStockUpdate(productId, productName, newStock) {
    this.broadcastToChannel('inventory', {
      type: 'stock_updated',
      data: { productId, productName, stock: newStock },
      message: `Stock updated for "${productName}": ${newStock} units`
    });
  }

  // System notifications
  notifySystemMessage(message, level = 'info') {
    this.broadcast({
      type: 'system_message',
      level,
      message
    });
  }

  // Get connection stats
  getStats() {
    return {
      activeConnections: this.clients.size,
      isRunning: this.wss ? true : false
    };
  }
}

export default new WebSocketService();
