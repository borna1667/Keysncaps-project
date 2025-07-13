#!/bin/bash
# Production Deployment Script for Ubuntu Server

set -e

echo "=== Keys'n'Caps Production Deployment ==="
echo

# Check if running as root (not recommended)
if [ "$EUID" -eq 0 ]; then
  echo "⚠️  Warning: Running as root is not recommended for security reasons"
  echo "Consider creating a dedicated user for your application"
fi

# Function to check if command exists
command_exists() {
  command -v "$1" >/dev/null 2>&1
}

# Install Node.js if not present
if ! command_exists node; then
  echo "📦 Installing Node.js..."
  curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
  sudo apt install -y nodejs
  echo "✅ Node.js $(node -v) installed"
else
  echo "✅ Node.js $(node -v) already installed"
fi

# Install PM2 if not present
if ! command_exists pm2; then
  echo "📦 Installing PM2..."
  sudo npm install -g pm2
  echo "✅ PM2 installed"
else
  echo "✅ PM2 already installed"
fi

# Install Nginx if not present (for reverse proxy)
if ! command_exists nginx; then
  echo "📦 Installing Nginx..."
  sudo apt update
  sudo apt install -y nginx
  sudo systemctl enable nginx
  echo "✅ Nginx installed"
else
  echo "✅ Nginx already installed"
fi

# Install dependencies
echo "📦 Installing project dependencies..."
npm install
echo "✅ Dependencies installed"

# Create production environment file
if [ ! -f .env ]; then
  echo "📝 Creating production environment file..."
  cp .env.production .env
  echo "⚠️  IMPORTANT: Edit .env file with your production values!"
  echo "   - Update ALLOWED_ORIGIN with your domain"
  echo "   - Update VITE_API_URL with your server URL" 
  echo "   - Update JWT_SECRET with a secure secret"
  echo "   - Update database credentials"
  echo "   - Update Stripe keys to live keys"
else
  echo "✅ Environment file already exists"
fi

# Set secure permissions
echo "🔒 Setting secure file permissions..."
chmod 600 .env
chmod +x ubuntu-setup.sh
chmod +x deploy-production.sh

# Build the frontend for production
echo "🔨 Building frontend for production..."
npm run build

# Stop existing PM2 processes
echo "🛑 Stopping existing processes..."
pm2 stop all || true
pm2 delete all || true

# Start the application with PM2
echo "🚀 Starting application with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
echo "💾 Saving PM2 configuration..."
pm2 save

# Set up PM2 to start on boot
echo "🔄 Setting up PM2 startup..."
pm2_startup_cmd=$(pm2 startup | grep "sudo env" | head -1)
if [ -n "$pm2_startup_cmd" ]; then
  echo "Run the following command to enable startup on boot:"
  echo "$pm2_startup_cmd"
fi

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22      # SSH
sudo ufw allow 80      # HTTP
sudo ufw allow 443     # HTTPS
sudo ufw allow 4242    # Your app port
sudo ufw --force enable

# Create Nginx configuration
echo "🌐 Creating Nginx configuration..."
sudo tee /etc/nginx/sites-available/keysncaps > /dev/null << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    # SSL certificates (replace with your actual certificate paths)
    # ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    
    # SSL security settings
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    
    # Security headers
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=63072000; includeSubDomains; preload";
    
    # Serve static files
    location / {
        root /path/to/your/frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy API requests to your Node.js server
    location /api/ {
        proxy_pass http://localhost:4242;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Proxy Stripe webhook
    location /create-payment-intent {
        proxy_pass http://localhost:4242;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/keysncaps /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

echo
echo "=== Deployment Complete! ==="
echo
echo "📋 Next Steps:"
echo "1. Edit .env file with your production values"
echo "2. Update Nginx config with your actual domain in /etc/nginx/sites-available/keysncaps"
echo "3. Set up SSL certificates with Let's Encrypt:"
echo "   sudo apt install certbot python3-certbot-nginx"
echo "   sudo certbot --nginx -d your-domain.com -d www.your-domain.com"
echo "4. Update your frontend build to point to the production API URL"
echo "5. Run the PM2 startup command shown above"
echo
echo "📊 Monitor your application:"
echo "   pm2 status        # Check process status"
echo "   pm2 logs          # View logs"
echo "   pm2 monit         # Real-time monitoring"
echo
echo "🔄 To update your application:"
echo "   git pull          # Pull latest changes"
echo "   npm install       # Install new dependencies"
echo "   npm run build     # Rebuild frontend"
echo "   pm2 restart all   # Restart services"
echo
