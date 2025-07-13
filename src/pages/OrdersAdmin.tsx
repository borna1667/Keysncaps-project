import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Package, Search, Filter, Download } from 'lucide-react';

// Order interfaces
interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
}

interface Order {
  _id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  shippingMethod: {
    method: string;
    cost: number;
  };
  paymentInfo: {
    paymentId: string;
    paymentMethod: string;
    paymentStatus: string;
  };
  subtotal: number;
  tax: number;
  total: number;
  status: string;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

const OrdersAdmin: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderStatus, setOrderStatus] = useState('');
  
  // Filter states
  const [activeView, setActiveView] = useState<'current' | 'past'>('current');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ordersPerPage] = useState<number>(10);
  const [paginatedOrders, setPaginatedOrders] = useState<Order[]>([]);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  const navigate = useNavigate();

  // Fetch orders when component mounts
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin');
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL || 'http://localhost:4242'}/api/admin/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        setOrders(response.data);
        setFilteredOrders(response.data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [navigate]);
    // Filter orders based on current filters
  useEffect(() => {
    let result = [...orders];
    
    // First, filter to show only paid orders
    result = result.filter(order => 
      order.paymentInfo && order.paymentInfo.paymentStatus === 'paid'
    );
    
    // Filter by active view (current vs past)
    if (activeView === 'current') {
      result = result.filter(order => 
        order.status === 'pending' || 
        order.status === 'processing' || 
        order.status === 'shipped'
      );
    } else {
      result = result.filter(order => 
        order.status === 'delivered' || 
        order.status === 'cancelled'
      );
    }
    
    // Filter by status if not "all"
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    // Filter by date range
    if (startDate) {
      const startDateObj = new Date(startDate);
      result = result.filter(order => new Date(order.createdAt) >= startDateObj);
    }
    
    if (endDate) {
      // Set end date to end of day
      const endDateObj = new Date(endDate);
      endDateObj.setHours(23, 59, 59, 999);
      result = result.filter(order => new Date(order.createdAt) <= endDateObj);
    }
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(order => 
        order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.shippingAddress.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
  // Sort by date, newest first
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    setFilteredOrders(result);
    // Reset to first page when filters change
    setCurrentPage(1);
  }, [orders, activeView, statusFilter, startDate, endDate, searchTerm]);
  
  // Calculate paginated orders based on filtered orders and current page
  useEffect(() => {
    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    setPaginatedOrders(filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder));
  }, [filteredOrders, currentPage, ordersPerPage]);
  
  // Calculate total pages for pagination
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
    // Change page handler
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      // Scroll to top of table on page change
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    setTrackingNumber(order.trackingNumber || '');
    setOrderStatus(order.status);
  };
    const handleUpdateOrder = async () => {
    if (!selectedOrder) return;
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL || 'http://localhost:4242'}/api/admin/orders/${selectedOrder._id}`,
        {
          status: orderStatus,
          trackingNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      setOrders(orders.map(order => 
        order._id === response.data._id ? response.data : order
      ));
      
      if (selectedOrder._id === response.data._id) {
        setSelectedOrder(response.data);
      }
      
      // Send notification about the status change
      if (response.data.userId) {
        try {
          // Send in-app notification
          await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:4242'}/api/admin/orders/notification`,
            {
              orderId: response.data._id,
              userId: response.data.userId,
              status: response.data.status
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
          
          // Send email notification
          await axios.post(
            `${import.meta.env.VITE_API_URL || 'http://localhost:4242'}/api/admin/orders/email-notification`,
            {
              orderId: response.data._id,
              userId: response.data.userId,
              status: response.data.status,
              userEmail: response.data.shippingAddress?.email // Include email for direct notification
            },
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          );
        } catch (notificationError) {
          console.error('Failed to send notification:', notificationError);
          // Continue with the order update even if notification fails
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update order');
    }
  };
  
  const handleClearFilters = () => {    setStatusFilter('all');
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
  };
  
  // Export past orders to CSV
  const exportPastOrders = () => {
    if (filteredOrders.length === 0) return;
    
    // Create CSV content
    const headers = ['Order ID', 'Customer', 'Email', 'Date', 'Status', 'Total'];
    let csvContent = headers.join(',') + '\n';
    
    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt).toLocaleDateString();
      const row = [
        order._id,
        `"${order.shippingAddress.fullName}"`,
        `"${order.shippingAddress.email}"`,
        `"${date}"`,
        order.status,
        order.total.toFixed(2)
      ];
      csvContent += row.join(',') + '\n';
    });
    
    // Create and click download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `orders_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Calculate summary statistics for past orders
  const calculatePastOrderStats = () => {
    if (activeView !== 'past' || filteredOrders.length === 0) return null;
    
    const total = filteredOrders.reduce((sum, order) => sum + order.total, 0);
    const avgOrderValue = total / filteredOrders.length;
    const deliveredCount = filteredOrders.filter(o => o.status === 'delivered').length;
    const cancelledCount = filteredOrders.filter(o => o.status === 'cancelled').length;
    
    return {
      totalOrders: filteredOrders.length,
      totalValue: total.toFixed(2),
      avgValue: avgOrderValue.toFixed(2),
      deliveredCount,
      cancelledCount,
      cancelRate: ((cancelledCount / filteredOrders.length) * 100).toFixed(1)
    };
  };
  
  const pastStats = calculatePastOrderStats();
  
  // Generate a printable receipt for an order
  const generateReceipt = (order: Order) => {
    // Create the content for the receipt
    const receiptWindow = window.open('', '_blank');
    if (!receiptWindow) {
      alert('Please allow popups to generate receipt');
      return;
    }
    
    // Format date
    const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
    
    // Generate receipt HTML
    const receiptHTML = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Receipt - Order ${order._id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          .receipt {
            border: 1px solid #ddd;
            padding: 20px;
          }
          .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #ddd;
            padding-bottom: 10px;
          }
          .company {
            font-size: 24px;
            font-weight: bold;
          }
          .order-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 20px;
          }
          .section h2 {
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
            margin-bottom: 10px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 10px;
            border-bottom: 1px solid #ddd;
            text-align: left;
          }
          th {
            background-color: #f5f5f5;
          }
          .total-row {
            font-weight: bold;
          }
          .print-button {
            text-align: center;
            margin-top: 20px;
          }
          .print-button button {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
          }
          @media print {
            .no-print {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="receipt">
          <div class="header">
            <div class="company">Keys'n'Caps</div>
            <div>Order Receipt</div>
          </div>
          
          <div class="order-info">
            <div>
              <strong>Order ID:</strong> ${order._id}<br>
              <strong>Date:</strong> ${orderDate}<br>
              <strong>Status:</strong> ${order.status.toUpperCase()}
            </div>
            <div>
              ${order.trackingNumber ? `<strong>Tracking:</strong> ${order.trackingNumber}<br>` : ''}
              <strong>Payment Method:</strong> ${order.paymentInfo.paymentMethod}<br>
              <strong>Payment ID:</strong> ${order.paymentInfo.paymentId.substring(0, 10)}...
            </div>
          </div>
          
          <div class="section">
            <h2>Customer Information</h2>
            <p>
              ${order.shippingAddress.fullName}<br>
              ${order.shippingAddress.email}<br>
              ${order.shippingAddress.phone}
            </p>
          </div>
          
          <div class="section">
            <h2>Shipping Address</h2>
            <p>
              ${order.shippingAddress.addressLine1}<br>
              ${order.shippingAddress.addressLine2 ? order.shippingAddress.addressLine2 + '<br>' : ''}
              ${order.shippingAddress.city}, ${order.shippingAddress.state || ''} ${order.shippingAddress.postalCode}<br>
              ${order.shippingAddress.country}
            </p>
            <p>
              <strong>Shipping Method:</strong> ${order.shippingMethod.method}
            </p>
          </div>
          
          <div class="section">
            <h2>Order Items</h2>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                ${order.items.map(item => `
                  <tr>
                    <td>${item.name || item.productId}</td>
                    <td>€${item.price.toFixed(2)}</td>
                    <td>${item.quantity}</td>
                    <td>€${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" style="text-align: right;"><strong>Subtotal:</strong></td>
                  <td>€${order.subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3" style="text-align: right;"><strong>Shipping:</strong></td>
                  <td>€${order.shippingMethod.cost.toFixed(2)}</td>
                </tr>
                ${order.tax > 0 ? `
                <tr>
                  <td colspan="3" style="text-align: right;"><strong>Tax:</strong></td>
                  <td>€${order.tax.toFixed(2)}</td>
                </tr>
                ` : ''}
                <tr class="total-row">
                  <td colspan="3" style="text-align: right;"><strong>Total:</strong></td>
                  <td>€${order.total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div class="print-button no-print">
            <button onclick="window.print()">Print Receipt</button>
          </div>
        </div>
      </body>
      </html>
    `;
    
    receiptWindow.document.write(receiptHTML);
    receiptWindow.document.close();
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading orders...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Management</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => (
                    <tr
                      key={order._id}
                      onClick={() => handleOrderSelect(order)}
                      className={`cursor-pointer hover:bg-gray-50 ${
                        selectedOrder?._id === order._id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order._id.substring(0, 8)}...
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.shippingAddress.fullName}</div>
                        <div className="text-sm text-gray-500">{order.shippingAddress.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                          ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${order.status === 'processing' ? 'bg-blue-100 text-blue-800' : ''}
                          ${order.status === 'shipped' ? 'bg-purple-100 text-purple-800' : ''}
                          ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : ''}
                          ${order.status === 'cancelled' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-right">
                        €{order.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-1">
            {selectedOrder ? (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Order Details</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Order ID</h3>
                    <p className="mt-1">{selectedOrder._id}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                    <p className="mt-1">{selectedOrder.shippingAddress.fullName}</p>
                    <p className="text-sm text-gray-500">{selectedOrder.shippingAddress.email}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Shipping Address</h3>
                    <p className="mt-1">
                      {selectedOrder.shippingAddress.addressLine1}
                      {selectedOrder.shippingAddress.addressLine2 && <br />}
                      {selectedOrder.shippingAddress.addressLine2}
                      <br />
                      {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.postalCode}
                      <br />
                      {selectedOrder.shippingAddress.country}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Items</h3>
                    <div className="mt-2 space-y-2">
                      {selectedOrder.items.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span>{item.name} x {item.quantity}</span>
                          <span>€{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between font-medium">
                          <span>Total</span>
                          <span>€{selectedOrder.total.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Status</h3>
                    <select
                      value={selectedOrder.status}
                      onChange={(e) => handleStatusUpdate(selectedOrder._id, e.target.value as Order['status'])}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tracking Number</h3>
                    <div className="mt-1 flex">
                      <input
                        type="text"
                        value={selectedOrder.trackingNumber || ''}
                        onChange={(e) => handleTrackingUpdate(selectedOrder._id, e.target.value)}
                        placeholder="Enter tracking number"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                Select an order to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersAdmin;
