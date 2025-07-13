import emailjs from '@emailjs/browser';
import { Order } from './orderService';

// Track initialization status
let isInitialized = false;

// Initialize EmailJS with your user ID
export const initEmailService = () => {
  // Avoid re-initialization if already done
  if (isInitialized) return;
  
  try {
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'your_emailjs_public_key_here';
    
    if (!publicKey || publicKey === 'your_public_key_here') {
      throw new Error('EmailJS public key is missing or invalid. Please check your .env configuration.');
    }
    
    emailjs.init({
      publicKey,
      // Don't worry about the limited scope - this public key is meant to be exposed to the browser
    });
    
    isInitialized = true;
    // console.log('EmailJS initialized successfully with public key:', publicKey.substring(0, 5) + '...');
  } catch (error) {
    // console.error('Failed to initialize EmailJS:', error);
    throw new Error(`Email service initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Send email function for contact form submissions
export const sendContactEmail = async (formData: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => {
  try {
    // Make sure EmailJS is initialized first
    if (!isInitialized) {
      initEmailService();
    }
    
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_emailjs_service_id_here';
    const templateId = import.meta.env.VITE_EMAILJS_CONTACT_TEMPLATE_ID || 'your_emailjs_contact_template_id_here';
    const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'support@keysncaps.com';
    
    // Detailed logging to identify configuration issues
    // console.log('EmailJS Configuration:');
    // console.log('- Service ID:', serviceId);
    // console.log('- Template ID:', templateId);
    // console.log('- Support Email:', supportEmail);
    // console.log('- Public Key (partial):', import.meta.env.VITE_EMAILJS_PUBLIC_KEY ? 
    //   import.meta.env.VITE_EMAILJS_PUBLIC_KEY.substring(0, 5) + '...' : 'Not set in env');
      // Prepare template parameters - match these EXACTLY to your EmailJS template parameters
    const templateParams = {
      from_name: formData.name,
      from_email: formData.email,
      subject: formData.subject,
      message: formData.message,
      to_email: supportEmail,
      reply_to: formData.email,
      // Add any other parameters your template might expect
      // For debugging, include a timestamp to differentiate between attempts
      timestamp: new Date().toISOString()
    };
    
    // console.log('Sending contact email with parameters:', templateParams);
    
    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams
    );
      // Check if the response has expected properties to indicate real success
    if (response && response.status === 200) {
      // console.log('Contact email sent successfully, response:', response);
      return { success: true, response };
    } else {
      // console.warn('EmailJS returned an unexpected response:', response);
      return { 
        success: false, 
        error: new Error('EmailJS returned an unexpected response status: ' + (response?.status || 'unknown'))
      };
    }
  } catch (error) {
    // console.error('Failed to send contact form:', error);
    return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

// Function to send order confirmation emails
export const sendOrderConfirmationEmail = async (order: Order, userEmail: string) => {
  try {
    // Make sure EmailJS is initialized
    if (!isInitialized) {
      initEmailService();
    }
    
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_emailjs_service_id_here';
    const templateId = import.meta.env.VITE_EMAILJS_ORDER_TEMPLATE_ID || 'your_emailjs_order_template_id_here';
    
    const templateParams = {
      to_email: userEmail,
      order_id: order._id?.substring(0, 8) || 'Unknown',
      order_date: new Date(order.createdAt || new Date()).toLocaleString(),
      order_total: `$${(order.totalAmount || 0).toFixed(2)}`,
      order_items: formatOrderItems(order),
      customer_name: order.shippingAddress?.name || 'Customer'
    };

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams
    );
    
    // console.log('Order confirmation email sent successfully');
    return { success: true, response };
  } catch (error) {
    // console.error('Failed to send order confirmation email:', error);
    return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

// Function to send order status update emails
export const sendOrderStatusEmail = async (order: Order, userEmail: string) => {
  try {
    // Make sure EmailJS is initialized
    if (!isInitialized) {
      initEmailService();
    }
    
    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'your_emailjs_service_id_here';
    const templateId = import.meta.env.VITE_EMAILJS_ORDER_STATUS_TEMPLATE_ID || 'your_emailjs_order_status_template_id_here';
    
    // Create appropriate subject and message based on status
    let subject = '';
    let statusMessage = '';
    
    switch(order.status) {
      case 'processing':
        subject = 'Your Order is Being Processed';
        statusMessage = 'We\'re preparing your items for shipment.';
        break;
      case 'shipped':
        subject = 'Your Order Has Been Shipped';
        statusMessage = order.trackingNumber 
          ? `Your items are on the way! You can track your package with tracking number: ${order.trackingNumber}`
          : 'Your items are on the way!';
        break;
      case 'delivered':
        subject = 'Your Order Has Been Delivered';
        statusMessage = 'Your order has been delivered. Enjoy your products!';
        break;
      case 'cancelled':
        subject = 'Your Order Has Been Cancelled';
        statusMessage = 'Your order has been cancelled. If you have questions, please contact customer support.';
        break;
      default:
        subject = 'Order Status Update';
        statusMessage = `Your order status has been updated to ${order.status}.`;
    }

    const templateParams = {
      to_email: userEmail,
      subject,
      status_message: statusMessage,
      order_id: order._id?.substring(0, 8) || 'Unknown',
      order_status: order.status,
      order_date: new Date(order.createdAt || new Date()).toLocaleString(),
      customer_name: order.shippingAddress?.name || 'Customer'
    };

    const response = await emailjs.send(
      serviceId,
      templateId,
      templateParams
    );

    // console.log(`Order ${order.status} email sent successfully`);
    return { success: true, response };
  } catch (error) {
    // console.error(`Failed to send order ${order.status} email:`, error);
    return { success: false, error: error instanceof Error ? error : new Error('Unknown error') };
  }
};

// Helper function to format order items for email
const formatOrderItems = (order: Order): string => {
  return order.items.map(item => 
    `${item.name || 'Product'} - $${item.price.toFixed(2)} x ${item.quantity}`
  ).join('\n');
};

// Export the email service
const emailService = {
  sendContactEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  initEmailService
};

export default emailService;
