import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Cart: React.FC = () => {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const total = getCartTotal();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-kloud-dark to-light">
        <Navbar />
        <main className="flex-grow flex flex-col items-center justify-center pt-32 pb-24 animate-fade-in">
          <div className="bg-light/90 rounded-2xl shadow-2xl border-4 border-primary/10 p-10 md:p-16 max-w-xl w-full text-center animate-fade-in backdrop-blur-xl">
            <ShoppingBag className="mx-auto mb-6 text-primary" size={48} />
            <h1 className="text-3xl font-heading font-bold text-primary mb-4 drop-shadow">Your Cart is Empty</h1>
            <p className="text-dark mb-8">Looks like you haven't added anything yet. Start shopping and fill your cart with awesome gear!</p>
            <Link to="/products" className="bg-gradient-to-r from-primary to-secondary text-background px-8 py-3 rounded-lg font-bold text-lg shadow-lg hover:scale-105 transition-transform inline-block">Shop Now</Link>
          </div>
        </main>
        <Footer />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl z-0 animate-pulse-light" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl z-0 animate-pulse-light" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-kloud-dark to-light relative">
      <Navbar />
      <main className="flex-grow pt-32 pb-24 animate-fade-in">
        <div className="container-custom mx-auto px-2 md:px-6 lg:px-12">
          <h1 className="text-4xl font-heading font-bold text-primary mb-12 text-center drop-shadow">Your Cart</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Cart Items */}
            <div className="lg:col-span-2 bg-light/90 rounded-2xl shadow-xl border-4 border-primary/10 p-6 md:p-10 animate-fade-in backdrop-blur-xl">
              <h2 className="text-2xl font-semibold text-dark mb-6 flex items-center gap-2"><ShoppingBag className="text-primary" size={28}/> Cart Items ({cartItems.length})</h2>
              <div className="divide-y divide-accent/30">
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex flex-col md:flex-row items-center md:items-start gap-6 py-6">
                    <img 
                      src={item.product.images && Array.isArray(item.product.images) && item.product.images.length > 0 
                        ? item.product.images[0] 
                        : 'https://via.placeholder.com/128x128?text=No+Image'
                      } 
                      alt={item.product.name} 
                      className="w-32 h-32 object-cover rounded-xl border-2 border-accent shadow-md" 
                    />
                    <div className="flex-1 w-full md:w-auto">
                      <h3 className="text-xl font-bold text-primary mb-1">{item.product.name}</h3>
                      <div className="text-gray-500 text-sm mb-2">{item.product.category}</div>
                      <div className="text-dark font-semibold text-lg mb-2">${item.product.price.toFixed(2)}</div>
                      <div className="flex items-center gap-3 mt-2">
                        <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} disabled={item.quantity <= 1} className="bg-accent text-white rounded-full p-2 disabled:opacity-50"><Minus size={16}/></button>
                        <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="bg-accent text-white rounded-full p-2"><Plus size={16}/></button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <button onClick={() => removeFromCart(item.product.id)} className="text-error hover:text-error/80 transition-colors"><Trash2 size={22}/></button>
                      <div className="text-gray-400 text-xs">Remove</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center gap-4 mt-10">
                <Link to="/products" className="text-primary hover:underline font-medium">Continue Shopping</Link>
                <div className="flex items-center gap-4">
                  <Link to="/order-history" className="text-gray-600 hover:text-primary transition-colors font-medium text-sm">View Past Orders</Link>
                  <button onClick={() => clearCart()} className="text-error hover:text-error/80 font-medium">Clear Cart</button>
                </div>
              </div>
            </div>
            {/* Order Summary */}
            <div className="bg-light/90 rounded-2xl shadow-xl border-4 border-primary/10 p-8 flex flex-col items-center animate-fade-in backdrop-blur-xl">
              <h2 className="text-xl font-bold text-dark mb-6">Order Summary</h2>
              <div className="w-full space-y-4 mb-8">
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-400">Calculated at checkout</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-400">Calculated at checkout</span>
                </div>
                <div className="border-t border-accent/30 pt-4 flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => navigate('/payment')} className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:scale-105 transition-transform flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight size={20}/>
              </button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {/* Decorative Blobs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary opacity-10 rounded-full blur-3xl z-0 animate-pulse-light" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-secondary opacity-20 rounded-full blur-3xl z-0 animate-pulse-light" />
    </div>
  );
};

export default Cart;