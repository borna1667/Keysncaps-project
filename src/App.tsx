import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductListing from './pages/ProductListing';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import ShippingReturns from './pages/ShippingReturns';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import { CartProvider } from './context/CartContext';
import { NotificationProvider, NotificationContainer } from './context/NotificationContext';
import ErrorBoundary from './components/ErrorBoundary';
import FilterDigging from './pages/FilterDigging';
import ScrollToTop from './components/ScrollToTop';
import AdminDashboard from './pages/AdminDashboard';
import AdminAddProduct from './pages/AdminAddProduct';
import PaymentPage from './pages/Payment';
import NewArrivals from './pages/NewArrivals';
import OrdersAdmin from './pages/OrdersAdmin';

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <ScrollToTop />
        <NotificationProvider>
          <CartProvider>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/products" element={<ProductListing />} />
                  <Route path="/products/:category" element={<ProductListing />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/shipping-returns" element={<ShippingReturns />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/filter-digging/:category" element={<FilterDigging />} />
                  <Route path="/new-arrivals" element={<NewArrivals />} />
                  <Route path="/payment" element={<PaymentPage />} />
                  <Route path="/admin" element={
                    <AdminDashboard />
                  } />
                  <Route path="/admin/add-product" element={
                    <AdminAddProduct />
                  } />
                  <Route path="/admin/orders" element={
                    <OrdersAdmin />
                  } />
                </Routes>
              </main>
              <Footer />
              <NotificationContainer />
            </div>
          </CartProvider>
        </NotificationProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;