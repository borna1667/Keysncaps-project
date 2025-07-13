import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, Globe, Mail, Undo2 } from 'lucide-react';

const carriers = [
  {
    name: 'DHL Express',
    logo: <Truck className="text-primary mb-2" size={36} />,
    description: 'Fast and reliable shipping across Europe. Track your package in real-time and enjoy flexible delivery options. Typical delivery: 1-3 business days.'
  },
  {
    name: 'DPD',
    logo: <Truck className="text-secondary mb-2" size={36} />,
    description: 'Affordable and efficient service for most European countries. Predictable delivery windows and convenient pickup points. Typical delivery: 2-5 business days.'
  },
  {
    name: 'GLS',
    logo: <Truck className="text-accent mb-2" size={36} />,
    description: 'Trusted for pan-European coverage and careful handling. Real-time tracking and signature on delivery. Typical delivery: 2-4 business days.'
  },
  {
    name: 'FedEx International',
    logo: <Globe className="text-primary mb-2" size={36} />,
    description: 'Worldwide express shipping for customers outside Europe. Fast customs clearance and global reach. Typical delivery: 2-7 business days.'
  }
];

const ShippingReturns: React.FC = () => {
  return (
    <div className="relative pt-32 pb-24 bg-gradient-to-br from-background via-white to-secondary min-h-screen overflow-hidden">
      <div className="container-custom relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-heading font-bold text-primary mb-4">Shipping & Returns</h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">Everything you need to know about how we deliver your order and how to return it if needed.</p>
        </div>

        {/* Shipping Section */}
        <div className="relative bg-white bg-opacity-90 rounded-3xl shadow-xl px-6 md:px-16 py-14 mb-20 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-center mb-10 text-primary">Shipping Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {carriers.map((carrier, idx) => (
              <div key={carrier.name} className="bg-white bg-opacity-80 rounded-2xl shadow-md p-8 flex flex-col items-center text-center hover:shadow-xl transition-shadow">
                {carrier.logo}
                <h3 className="font-semibold text-lg mb-2">{carrier.name}</h3>
                <p className="text-gray-600">{carrier.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center text-gray-700">
            <p>All orders are processed within 1-2 business days. Shipping costs and delivery times are calculated at checkout based on your location and selected carrier. You will receive a tracking link as soon as your order ships.</p>
          </div>
        </div>

        {/* Returns Section */}
        <div className="relative bg-white bg-opacity-90 rounded-3xl shadow-xl px-6 md:px-16 py-14 mb-20 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-center mb-8 text-primary flex items-center justify-center gap-2"><Undo2 className="inline-block text-primary" size={28}/> Returns & Exchanges</h2>
          <div className="max-w-2xl mx-auto text-center text-gray-700 text-lg">
            <p className="mb-6">Changed your mind? No worries! You can return any unused product within 30 days of delivery for a full refund or exchange. Items must be in original condition and packaging.</p>
            <p className="mb-6">To start a return, simply <Link to="/contact" className="text-primary underline hover:text-accent">contact us</Link> or email us at <a href="mailto:support@keysncaps.com" className="text-primary underline hover:text-accent">support@keysncaps.com</a>. Our team will guide you through the process and provide a return label if eligible.</p>
            <p className="mb-6">Refunds are processed within 3-5 business days after we receive and inspect your return. For more details, please see our <Link to="/contact" className="text-primary underline hover:text-accent">Contact Us</Link> page.</p>
            <div className="flex justify-center gap-4 mt-8">
              <a href="mailto:support@keysncaps.com" className="btn-primary flex items-center gap-2"><Mail size={20}/> Email Support</a>
              <Link to="/contact" className="btn-secondary flex items-center gap-2"><Undo2 size={20}/> Contact Us</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturns;
