import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { orderService } from '../utils/orderServicePrisma.js';
import { useNavigate } from 'react-router-dom';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

// Country grouping for shipping calculations
const countryGroups = {
  domestic: ['Germany'],
  eu1: ['Austria', 'France', 'Netherlands', 'Belgium', 'Luxembourg', 'Denmark'],
  eu2: [
    'Italy', 'Spain', 'Portugal', 'Sweden', 'Finland', 'Ireland', 'Poland', 'Czech Republic', 'Greece', 'Croatia', 'Hungary', 'Slovakia', 'Slovenia', 'Estonia', 'Latvia', 'Lithuania', 'Bulgaria', 'Romania', 'Cyprus', 'Malta'
  ],
  europe: [
    'United Kingdom', 'Switzerland', 'Norway', 'Iceland', 'Liechtenstein', 'Monaco', 'San Marino', 'Andorra', 'Vatican City', 'Serbia', 'Montenegro', 'Albania', 'Bosnia and Herzegovina', 'Moldova', 'North Macedonia', 'Ukraine', 'Belarus', 'Kosovo'
  ],
  zone1: ['United States', 'Canada', 'Mexico'],
  zone2: [
    'Australia', 'Japan', 'China', 'South Korea', 'New Zealand', 'Singapore', 'Hong Kong', 'Taiwan', 'Malaysia', 'Thailand', 'Vietnam', 'Indonesia', 'Philippines', 'India', 'Israel', 'United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Kuwait', 'Turkey', 'Georgia', 'Armenia', 'Azerbaijan', 'Kazakhstan'
  ],
  zone3: [
    // All other countries not listed above
    'Afghanistan', 'Algeria', 'Angola', 'Argentina', 'Bahamas', 'Bahrain', 'Bangladesh', 'Barbados', 'Belize', 'Benin', 'Bhutan', 'Bolivia', 'Botswana', 'Brazil', 'Brunei', 'Burkina Faso', 'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad', 'Chile', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Cuba', 'Djibouti', 'Dominica', 'Dominican Republic', 'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Eswatini', 'Ethiopia', 'Fiji', 'Gabon', 'Gambia', 'Ghana', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti', 'Honduras', 'Iran', 'Iraq', 'Jamaica', 'Jordan', 'Kenya', 'Kiribati', 'Kyrgyzstan', 'Laos', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi', 'Maldives', 'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Myanmar', 'Namibia', 'Nepal', 'Nicaragua', 'Niger', 'Nigeria', 'Oman', 'Pakistan', 'Palau', 'Panama', 'Papua New Guinea', 'Paraguay', 'Peru', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines', 'Samoa', 'Sao Tome and Principe', 'Senegal', 'Seychelles', 'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sri Lanka', 'Sudan', 'Suriname', 'Syria', 'Tajikistan', 'Tanzania', 'Timor-Leste', 'Togo', 'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkmenistan', 'Uganda', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Venezuela', 'Yemen', 'Zambia', 'Zimbabwe', 'Other'
  ]
};

// Shipping methods with their base costs and delivery times
const shippingMethods = {
  standard: { 
    name: 'Standard', 
    deliveryTime: {
      domestic: '2-3 business days',
      eu1: '3-5 business days',
      eu2: '5-7 business days',
      europe: '5-7 business days',
      zone1: '7-14 business days',
      zone2: '10-21 business days',
      zone3: '14-30 business days'
    }
  },
  express: { 
    name: 'Express', 
    deliveryTime: {
      domestic: '1-2 business days',
      eu1: '2-3 business days',
      eu2: '3-4 business days',
      europe: '3-4 business days',
      zone1: '3-5 business days',
      zone2: '4-7 business days',
      zone3: '5-10 business days'
    }
  },
  overnight: { 
    name: 'Overnight/Priority', 
    deliveryTime: {
      domestic: 'Next business day',
      eu1: '1-2 business days',
      eu2: '2-3 business days',
      europe: '2-3 business days',
      zone1: '2-3 business days',
      zone2: '3-4 business days',
      zone3: '3-5 business days'
    }
  }
};

// Calculate the country group for a given country
const getCountryGroup = (country: string): keyof typeof countryGroups => {
  for (const [group, countries] of Object.entries(countryGroups)) {
    if (countries.includes(country)) {
      return group as keyof typeof countryGroups;
    }
  }
  return 'zone3'; // Default to most expensive zone if country not found
};

// Enhanced shipping price calculator
const getShippingPrice = (country: string, method: string, subtotal: number, itemCount: number) => {
  if (!country || !method) return 0;
  
  // Free shipping threshold for domestic orders
  if (country === 'Germany' && subtotal >= 100) return 0;
  
  const countryGroup = getCountryGroup(country);
  
  // Base price by country group (Standard shipping)
  const basePrices: Record<string, number> = {
    domestic: 4.90,
    eu1: 9.90,
    eu2: 14.90,
    europe: 19.90,
    zone1: 29.90,
    zone2: 39.90,
    zone3: 49.90
  };
  
  // Method multiplier
  const methodMultiplier: Record<string, number> = {
    standard: 1,
    express: 1.75,
    overnight: 2.5
  };
  
  // Calculate base price by country group and shipping method
  let price = basePrices[countryGroup] * (methodMultiplier[method] || 1);
  
  // Add a small amount per item for orders with many items (weight consideration)
  if (itemCount > 3) {
    price += (itemCount - 3) * 1.5;
  }
  
  // Round to two decimal places
  return Math.round(price * 100) / 100;
};

// Country options are now handled through the countryGroups object

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();  const { cartItems, getCartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'shipping' | 'payment' | 'done'>('shipping');
  // Shipping form state
  const [shipping, setShipping] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postal: '',
    country: '',
    shippingMethod: 'standard', // Default to standard shipping
  });
  const [shippingTouched, setShippingTouched] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const subtotal = getCartTotal();
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0); 
  const shippingPrice = getShippingPrice(shipping.country, shipping.shippingMethod, subtotal, totalItems);
  const total = subtotal + shippingPrice;
    // Get the country group for shipping calculations
  const countryGroup = shipping.country ? getCountryGroup(shipping.country) : null;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShipping({ ...shipping, [e.target.name]: e.target.value });
  };
  const validateShipping = () => {
    const errors: Record<string, string> = {};
    
    if (!shipping.name.trim()) errors.name = "Name is required";
    if (!shipping.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(shipping.email)) errors.email = "Email is invalid";
    if (!shipping.address.trim()) errors.address = "Address is required";
    if (!shipping.city.trim()) errors.city = "City is required";
    if (!shipping.postal.trim()) errors.postal = "Postal code is required";
    if (!shipping.country) errors.country = "Country is required";
    if (!shipping.shippingMethod) errors.shippingMethod = "Shipping method is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShippingTouched(true);
    if (validateShipping()) {
      setStep('payment');
      // Scroll to top for smooth transition
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Scroll to top to show loading state
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    try {
      const apiUrl = import.meta.env.VITE_PAYMENT_API_URL || '/create-payment-intent';
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(total * 100),
          cart: cartItems.map(item => ({
            id: item.product.id,
            price: item.product.price,
            quantity: item.quantity
          })),
          shipping: {
            ...shipping,
            shippingMethod: shipping.shippingMethod,
            deliveryEstimate: countryGroup 
              ? shippingMethods[shipping.shippingMethod as keyof typeof shippingMethods].deliveryTime[countryGroup] 
              : ''
          },
          shippingPrice,
          countryGroup
        }),
      });
      let data;
      try {
        // Check for empty response
        const text = await res.text();
        data = text ? JSON.parse(text) : {};
      } catch (jsonErr) {
        throw new Error('Invalid server response. Please try again.');
      }
      if (!res.ok) throw new Error(data.error || 'Server error');
      const { clientSecret } = data;
      const result = await stripe?.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements?.getElement(CardElement)!,
          billing_details: {
            name: shipping.name,
            email: shipping.email,
            address: {
              line1: shipping.address,
              city: shipping.city,
              postal_code: shipping.postal,
              country: shipping.country,
            },
            phone: shipping.phone,
          },
        },        shipping: {
          name: shipping.name,
          address: {
            line1: shipping.address,
            city: shipping.city,
            postal_code: shipping.postal,
            country: shipping.country,
          },
          phone: shipping.phone,
          carrier: shipping.shippingMethod, // Add shipping method info
        }
      });      if (result?.error) {
        setError(result.error.message || 'Payment failed');      } else if (result?.paymentIntent?.status === 'succeeded') {
        setStep('done');
        // Create order in the system
        try {
          // Robust error handling for order creation
          const orderRes = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              items: cartItems.map(item => ({
                productId: item.product.id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                image: item.product.images && Array.isArray(item.product.images) && item.product.images.length > 0 
                  ? item.product.images[0] 
                  : 'https://via.placeholder.com/200x200?text=No+Image'
              })),
              shippingAddress: {
                fullName: shipping.name,
                addressLine1: shipping.address,
                city: shipping.city,
                postalCode: shipping.postal,
                country: shipping.country,
                phone: shipping.phone,
                email: shipping.email
              },
              paymentInfo: {
                paymentId: result.paymentIntent.id,
                paymentMethod: 'stripe',
                paymentStatus: 'paid'
              },
              shippingMethod: {
                method: shipping.shippingMethod,
                cost: shippingPrice
              },
              subtotal: subtotal,
              tax: 0, // Calculate tax if needed
              total: total,
              status: 'processing'
            })
          });
          // Try to parse order response, but don't throw if empty
          try {
            await orderRes.text(); // ignore content, just ensure no crash
          } catch {}
        } catch (error) {
          console.error('Failed to save order:', error);
          // Don't show error to user since payment succeeded
        }
        clearCart();
      }
    } catch (err: any) {
      setError(err.message || 'Server error');
    }
    setLoading(false);
  };

  if (cartItems.length === 0) {
    return <div className="text-center text-lg text-gray-600 py-12">Your cart is empty.</div>;
  }

  return (    <div className="w-full max-w-3xl mx-auto bg-white/95 rounded-2xl shadow-2xl border-4 border-primary/10 p-8 md:p-12 animate-fade-in backdrop-blur-xl">
      <h2 className="text-3xl font-heading font-bold text-primary mb-2 text-center drop-shadow">Checkout</h2>
      
      {/* Checkout Progress Indicator */}
      <div className="flex items-center justify-center mb-8">
        <div className={`flex flex-col items-center mx-4 ${step === 'shipping' ? 'text-primary font-bold' : 'text-gray-500'}`}>
          <div className={`rounded-full w-10 h-10 flex items-center justify-center ${step === 'shipping' ? 'bg-primary text-white' : 'bg-gray-200'} mb-1`}>1</div>
          <span>Shipping</span>
        </div>
        <div className="h-0.5 w-16 bg-gray-300 mt-0.5"></div>
        <div className={`flex flex-col items-center mx-4 ${step === 'payment' ? 'text-primary font-bold' : 'text-gray-500'}`}>
          <div className={`rounded-full w-10 h-10 flex items-center justify-center ${step === 'payment' ? 'bg-primary text-white' : 'bg-gray-200'} mb-1`}>2</div>
          <span>Payment</span>
        </div>
        <div className="h-0.5 w-16 bg-gray-300 mt-0.5"></div>
        <div className={`flex flex-col items-center mx-4 ${step === 'done' ? 'text-primary font-bold' : 'text-gray-500'}`}>
          <div className={`rounded-full w-10 h-10 flex items-center justify-center ${step === 'done' ? 'bg-primary text-white' : 'bg-gray-200'} mb-1`}>3</div>
          <span>Done</span>
        </div>
      </div>

      {step === 'shipping' && (
        <form onSubmit={handleShippingSubmit} className="space-y-6">
          <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
            <h3 className="font-bold text-lg text-primary mb-4">Contact & Shipping Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name*</label>
                <input 
                  id="name"
                  name="name" 
                  value={shipping.name} 
                  onChange={handleShippingChange} 
                  placeholder="Your full name" 
                  className={`w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 ${formErrors.name ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/30'}`} 
                />
                {formErrors.name && <p className="text-red-500 text-xs">{formErrors.name}</p>}
              </div>
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">Email*</label>
                <input 
                  id="email"
                  name="email" 
                  value={shipping.email} 
                  onChange={handleShippingChange} 
                  placeholder="your@email.com" 
                  type="email"
                  className={`w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 ${formErrors.email ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/30'}`} 
                />
                {formErrors.email && <p className="text-red-500 text-xs">{formErrors.email}</p>}
              </div>
              <div className="space-y-1">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</label>
                <input 
                  id="phone"
                  name="phone" 
                  value={shipping.phone} 
                  onChange={handleShippingChange} 
                  placeholder="+1 123 456 7890" 
                  className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary/30" 
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label htmlFor="address" className="text-sm font-medium text-gray-700">Address*</label>
                <input 
                  id="address"
                  name="address" 
                  value={shipping.address} 
                  onChange={handleShippingChange} 
                  placeholder="Street address" 
                  className={`w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 ${formErrors.address ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/30'}`} 
                />
                {formErrors.address && <p className="text-red-500 text-xs">{formErrors.address}</p>}
              </div>
              <div className="space-y-1">
                <label htmlFor="city" className="text-sm font-medium text-gray-700">City*</label>
                <input 
                  id="city"
                  name="city" 
                  value={shipping.city} 
                  onChange={handleShippingChange} 
                  placeholder="City" 
                  className={`w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 ${formErrors.city ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/30'}`} 
                />
                {formErrors.city && <p className="text-red-500 text-xs">{formErrors.city}</p>}
              </div>
              <div className="space-y-1">
                <label htmlFor="postal" className="text-sm font-medium text-gray-700">Postal Code*</label>
                <input 
                  id="postal"
                  name="postal" 
                  value={shipping.postal} 
                  onChange={handleShippingChange} 
                  placeholder="Postal code" 
                  className={`w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 ${formErrors.postal ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/30'}`} 
                />
                {formErrors.postal && <p className="text-red-500 text-xs">{formErrors.postal}</p>}
              </div>
              <div className="space-y-1 md:col-span-2">
                <label htmlFor="country" className="text-sm font-medium text-gray-700">Country*</label>
                <select 
                  id="country"
                  name="country" 
                  value={shipping.country} 
                  onChange={handleShippingChange} 
                  className={`w-full rounded-md border py-2 px-3 focus:outline-none focus:ring-2 ${formErrors.country ? 'border-red-500 focus:ring-red-200' : 'border-gray-300 focus:ring-primary/30'}`}
                >
                  <option value="">Select your country</option>
                  <optgroup label="Domestic">
                    {countryGroups.domestic.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                  <optgroup label="European Union - Zone 1">
                    {countryGroups.eu1.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                  <optgroup label="European Union - Zone 2">
                    {countryGroups.eu2.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                  <optgroup label="Non-EU Europe">
                    {countryGroups.europe.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                  <optgroup label="North America">
                    {countryGroups.zone1.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                  <optgroup label="Asia/Pacific">
                    {countryGroups.zone2.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                  <optgroup label="Other">
                    {countryGroups.zone3.map(c => <option key={c} value={c}>{c}</option>)}
                  </optgroup>
                </select>
                {formErrors.country && <p className="text-red-500 text-xs">{formErrors.country}</p>}
              </div>
            </div>
          </div>
          
          {/* Shipping Method Selection */}
          <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
            <h3 className="font-bold text-lg text-primary mb-4">Shipping Method</h3>
            <div className="space-y-3">
              {Object.entries(shippingMethods).map(([method, details]) => {
                const methodPrice = shipping.country ? 
                  getShippingPrice(shipping.country, method, subtotal, totalItems) : 0;
                const deliveryTime = countryGroup ? details.deliveryTime[countryGroup] : '';
                
                return (
                  <div 
                    key={method}
                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                      shipping.shippingMethod === method 
                        ? 'border-primary bg-primary/5 shadow-md' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setShipping({ ...shipping, shippingMethod: method })}
                  >
                    <div className="flex items-center">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-3 ${
                        shipping.shippingMethod === method ? 'border-primary' : 'border-gray-300'
                      }`}>
                        {shipping.shippingMethod === method && (
                          <div className="w-3 h-3 rounded-full bg-primary"></div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between">
                          <span className="font-medium">{details.name}</span>
                          <span className="font-bold text-primary">
                            {shipping.country ? 
                              (methodPrice === 0 ? 'FREE' : `€${methodPrice.toFixed(2)}`) : 
                              'Select country'}
                          </span>
                        </div>
                        {deliveryTime && (
                          <p className="text-sm text-gray-600">Estimated delivery: {deliveryTime}</p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {formErrors.shippingMethod && <p className="text-red-500 text-sm mt-2">{formErrors.shippingMethod}</p>}
          </div>
          
          {shippingTouched && Object.keys(formErrors).length > 0 && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg border border-red-200 text-sm">
              Please fix the errors above to continue.
            </div>
          )}
          
          {/* Order Summary */}
          <div className="bg-gray-50 p-5 rounded-xl shadow-inner">
            <h3 className="font-bold text-lg text-primary mb-4">Order Summary</h3>
            <div className="space-y-2 divide-y divide-gray-200">
              <div className="flex justify-between py-1">
                <span>Items ({totalItems})</span>
                <span>€{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between py-1">
                <div>
                  <span>Shipping</span>
                  {shipping.country && countryGroup && shipping.shippingMethod && (
                    <span className="block text-xs text-gray-500">
                      {shippingMethods[shipping.shippingMethod as keyof typeof shippingMethods].name} • 
                      {shippingMethods[shipping.shippingMethod as keyof typeof shippingMethods].deliveryTime[countryGroup]}
                    </span>
                  )}
                </div>
                <span>{shipping.country ? (shippingPrice === 0 ? 'FREE' : `€${shippingPrice.toFixed(2)}`) : 'Select country'}</span>
              </div>
              <div className="flex justify-between pt-2 text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">€{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:scale-105 transition-transform"
          >
            Continue to Payment
          </button>
        </form>
      )}      {step === 'payment' && (
        <div>
          {/* Order Summary for Payment Step */}
          <div className="bg-gray-50 p-5 rounded-xl mb-6">
            <h3 className="font-bold text-xl text-primary mb-4">Order Summary</h3>
            <div className="grid grid-cols-1 divide-y divide-gray-200">
              <div className="py-3">
                <h4 className="font-medium mb-2">Shipping Address</h4>
                <p className="text-gray-700">
                  {shipping.name}<br />
                  {shipping.address}<br />
                  {shipping.postal} {shipping.city}<br />
                  {shipping.country}
                </p>
                <p className="text-gray-700 mt-1">
                  {shipping.email}<br />
                  {shipping.phone}
                </p>
              </div>
              <div className="py-3">
                <h4 className="font-medium mb-2">Shipping Method</h4>
                <p className="text-gray-700">
                  {shippingMethods[shipping.shippingMethod as keyof typeof shippingMethods].name} • 
                  {countryGroup ? shippingMethods[shipping.shippingMethod as keyof typeof shippingMethods].deliveryTime[countryGroup] : ''}
                </p>
              </div>
              <div className="py-3">
                <h4 className="font-medium mb-2">Order Details</h4>
                {cartItems.map(item => (
                  <div key={item.product.id} className="flex items-center justify-between py-1 text-sm">
                    <span>{item.product.name} × {item.quantity}</span>
                    <span>€{(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between">
                  <span>Subtotal</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{shippingPrice === 0 ? 'FREE' : `€${shippingPrice.toFixed(2)}`}</span>
                </div>
                <div className="pt-2 mt-2 border-t border-gray-200 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">€{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-gray-50 p-5 rounded-xl mb-6">
              <h3 className="font-bold text-xl text-primary mb-4">Payment Information</h3>
              <div className="mb-4">
                <CardElement 
                  className="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-inner focus:ring-2 focus:ring-primary transition" 
                  options={{ 
                    style: { 
                      base: { 
                        fontSize: '16px', 
                        color: '#333', 
                        '::placeholder': { color: '#aaa' },
                        iconColor: '#5469d4'
                      } 
                    },
                    hidePostalCode: true
                  }} 
                />
              </div>
              <p className="text-sm text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                </svg>
                Your payment information is secure and encrypted
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <button 
                type="button" 
                onClick={() => setStep('shipping')} 
                className="text-primary underline text-sm"
              >
                ← Back to shipping
              </button>
              
              <button 
                type="submit" 
                disabled={!stripe || loading} 
                className="w-full bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:scale-105 transition-transform disabled:opacity-70"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : `Pay €${total.toFixed(2)}`}
              </button>
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mt-4 animate-pulse">
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"></path>
                  </svg>
                  {error}
                </div>
              </div>
            )}
          </form>
        </div>
      )}
      {step === 'done' && (
        <div className="bg-green-50 p-8 rounded-xl text-center">
          <div className="w-16 h-16 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-green-700 mb-3">Payment Successful!</h3>
          <p className="text-lg text-green-600 mb-6">Thank you for your order. A confirmation email has been sent to {shipping.email}.</p>
          <div className="border-t border-green-200 pt-6 mt-6">
            <p className="text-green-700 mb-3">Your order will be shipped via:</p>
            <p className="font-medium text-xl">
              {shippingMethods[shipping.shippingMethod as keyof typeof shippingMethods].name}
            </p>
            <p className="text-green-600 mb-6">
              Estimated delivery: {countryGroup ? shippingMethods[shipping.shippingMethod as keyof typeof shippingMethods].deliveryTime[countryGroup] : ''}
            </p>
          </div>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-bold text-lg shadow-lg hover:scale-105 transition-transform mt-4"
          >
            Continue Shopping
          </button>
        </div>
      )}
    </div>
  );
};

const PaymentPage: React.FC = () => (
  <div className="relative min-h-screen bg-gradient-to-br from-background via-white to-secondary flex flex-col">
    <Navbar />
    <main className="flex-grow flex items-center justify-center pt-32 pb-24 animate-fade-in px-4 mt-8">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </main>
  </div>
);

export default PaymentPage;
