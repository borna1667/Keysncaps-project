import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Instagram, Music } from 'lucide-react';

const Footer: React.FC = () => {
  const [adminPassword, setAdminPassword] = useState('');
  const navigate = useNavigate();
  
  // Admin password handler - invisible to users
  const handleAdminPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setAdminPassword(newPassword);
    // When the correct password is entered, redirect to admin page
    const correctPassword = 'admin'; // Change this in production
    if (newPassword === correctPassword) { 
      navigate('/admin/add-product');
      setAdminPassword(''); // Clear the password field after successful login
    }
  };
  
  return (
    <footer className="bg-background/50 backdrop-blur-md pt-20 pb-12 border-t border-dark/10">
      <div className="container-custom">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 lg:gap-8">
          {/* Brand Section */}
          <div className="flex-1 max-w-md">
            <Link to="/" className="flex items-center mb-6">
              <img src="/logo.png" alt="Keys 'n' Caps Logo" className="h-10 w-10 object-contain" />
              <span className="ml-3 text-2xl font-heading font-bold text-primary">Keys 'n' Caps</span>
            </Link>
            <p className="text-dark/70 text-base leading-relaxed mb-8">
              Europe's premier destination for premium mechanical keyboards and accessories.
            </p>
            <div className="flex space-x-6">
              <a 
                href="https://www.instagram.com/keys_n_caps/" 
                className="text-dark/60 hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={24} />
              </a>
              <a 
                href="https://www.tiktok.com/@keys_n_caps" 
                className="text-dark/60 hover:text-primary transition-all duration-300 hover:scale-110"
                aria-label="Follow us on TikTok"
              >
                <Music size={24} />
              </a>
            </div>
            {/* Invisible admin password input */}
            <input
              type="password"
              value={adminPassword}
              onChange={handleAdminPasswordChange}
              className="absolute opacity-0 w-1 h-1 -z-10"
              aria-hidden="true"
            />
          </div>
          
          {/* Navigation Links */}
          <div className="flex flex-col sm:flex-row gap-12 sm:gap-16">
            <div>
              <h3 className="font-heading font-semibold text-lg mb-6 text-dark">Shop</h3>
              <nav className="space-y-3">
                <Link to="/products?category=keyboards" className="block text-dark/70 hover:text-primary transition-colors text-sm">Keyboards</Link>
                <Link to="/products?category=keycaps" className="block text-dark/70 hover:text-primary transition-colors text-sm">Keycaps</Link>
                <Link to="/products?category=switches" className="block text-dark/70 hover:text-primary transition-colors text-sm">Switches</Link>
                <Link to="/products?category=barebones" className="block text-dark/70 hover:text-primary transition-colors text-sm">Barebones</Link>
              </nav>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold text-lg mb-6 text-dark">Support</h3>
              <nav className="space-y-3">
                <Link to="/contact" className="block text-dark/70 hover:text-primary transition-colors text-sm">Help Center</Link>
                <Link to="/shipping-returns" className="block text-dark/70 hover:text-primary transition-colors text-sm">Shipping & Returns</Link>
                <a href="mailto:support@keysncaps.com" className="block text-dark/70 hover:text-primary transition-colors text-sm">Email Support</a>
                <Link to="/about" className="block text-dark/70 hover:text-primary transition-colors text-sm">About Us</Link>
              </nav>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-16 pt-8 border-t border-dark/10 text-center">
          <p className="text-sm text-dark/50">
            © {new Date().getFullYear()} Keys 'n' Caps. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;