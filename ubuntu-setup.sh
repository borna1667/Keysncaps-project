#!/bin/bash
# This script helps set up your Node.js Stripe payment server on Ubuntu

# Exit on error
set -e

echo "=== Setting up Stripe Payment Server on Ubuntu ==="
echo 

# Install Node.js if not already installed
if ! command -v node &> /dev/null; then
  echo "Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install -y nodejs
  echo "Node.js $(node -v) installed successfully"
else
  echo "Node.js $(node -v) is already installed"
fi

# Install PM2 globally
echo "Installing PM2 process manager..."
sudo npm install -g pm2
echo "PM2 installed successfully"

# Install project dependencies
echo "Installing project dependencies..."
npm install
echo "Dependencies installed successfully"

# Set permissions for environment files
echo "Setting secure permissions for environment files..."
chmod 600 .env

# Start the server with PM2
echo "Starting server with PM2..."
pm2 start ecosystem.config.js

# Save PM2 process list
echo "Saving PM2 process list..."
pm2 save

# Set up PM2 to start on system boot
echo "Setting up PM2 to start on system boot..."
pm2_startup=$(pm2 startup | grep "sudo")
echo "Run the following command to enable startup on boot:"
echo "$pm2_startup"

echo
echo "=== Setup Complete ==="
echo "Your Stripe payment server should now be running with PM2"
echo "Check status with: pm2 status"
echo "View logs with: pm2 logs stripe-payment-server"
echo
echo "Don't forget to configure your firewall if needed:"
echo "sudo ufw allow 4242"
