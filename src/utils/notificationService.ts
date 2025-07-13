// Notification service for handling order status updates and general notifications
import { Order } from './orderService';
import emailService from './emailService';

// Types for notifications
export interface Notification {
  id: string;
  type: 'order_update' | 'promotion' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  orderId?: string;
}

// Generate a notification for order status change and send email
export const createOrderStatusNotification = (order: Order, userEmail?: string): Notification => {
  const { _id, status } = order;
  let title = '';
  let message = '';
  
  switch(status) {
    case 'processing':
      title = 'Order Processing';
      message = `Your order #${_id?.substring(0, 8)} is now being processed.`;
      break;
    case 'shipped':
      title = 'Order Shipped';
      message = `Your order #${_id?.substring(0, 8)} has been shipped${order.trackingNumber ? ' with tracking number ' + order.trackingNumber : ''}.`;
      break;
    case 'delivered':
      title = 'Order Delivered';
      message = `Your order #${_id?.substring(0, 8)} has been delivered. Enjoy your purchase!`;
      break;
    case 'cancelled':
      title = 'Order Cancelled';
      message = `Your order #${_id?.substring(0, 8)} has been cancelled.`;
      break;
    default:
      title = 'Order Update';
      message = `Your order #${_id?.substring(0, 8)} status has been updated to ${status}.`;
  }
  
  // Create notification object
  const notification: Notification = {
    id: generateId(),
    type: 'order_update',
    title,
    message,
    timestamp: new Date(),
    read: false,
    link: `/order-history`, // Link to the order details
    orderId: _id
  };
  
  // Send email notification if we have a user email
  if (userEmail) {
    emailService.sendOrderStatusEmail(order, userEmail)
      .catch(error => console.error('Failed to send order status email:', error));
  }
  
  return notification;
};

// Helper to generate a random ID (in real app, use UUID)
const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Store notifications in localStorage (in real app, use a database)
export const saveNotification = (notification: Notification): void => {
  const notifications = getNotifications();
  notifications.push(notification);
  localStorage.setItem('notifications', JSON.stringify(notifications));
  
  // If we have support for web notifications, show one
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(notification.title, {
      body: notification.message,
      icon: '/logo.png'
    });
  }
};

export const getNotifications = (): Notification[] => {
  const stored = localStorage.getItem('notifications');
  return stored ? JSON.parse(stored) : [];
};

// In a real app, this would be user-specific
export const getNotificationsForUser = (): Notification[] => {
  // In a real app, we would filter by user ID from a database
  // For now, we'll just return all notifications from localStorage
  return getNotifications();
};

export const markAsRead = (id: string): void => {
  const notifications = getNotifications();
  const updated = notifications.map(notification => 
    notification.id === id ? { ...notification, read: true } : notification
  );
  localStorage.setItem('notifications', JSON.stringify(updated));
};

export const clearNotifications = (): void => {
  localStorage.setItem('notifications', JSON.stringify([]));
};

export const getUnreadCount = (): number => {
  return getNotifications().filter(notification => !notification.read).length;
};

// Export the notification service
const notificationService = {
  createOrderStatusNotification,
  saveNotification,
  getNotifications,
  getNotificationsForUser,
  markAsRead,
  clearNotifications,
  getUnreadCount
};

export default notificationService;
