# Keys'n'Caps Deployment Script for Windows to Ubuntu
# Run this from PowerShell as Administrator

# Configuration
$SSH_KEY = "C:\path\to\your\private-key.pem"
$SERVER_IP = "YOUR_SERVER_IP"
$USER = "ubuntu"
$REMOTE_APP_DIR = "/var/www/react-app"
$REMOTE_BUILD_DIR = "/home/ubuntu/dist"
$LOCAL_PROJECT_DIR = Get-Location

Write-Host "=== Keys'n'Caps Deployment to Ubuntu Server ===" -ForegroundColor Green
Write-Host ""

# Step 1: Build the frontend locally
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Frontend built successfully" -ForegroundColor Green
Write-Host ""

# Step 2: Create deployment directory structure on server
Write-Host "📁 Creating deployment directories on server..." -ForegroundColor Yellow
ssh -i $SSH_KEY "$USER@$SERVER_IP" @"
    mkdir -p $REMOTE_BUILD_DIR
    mkdir -p $REMOTE_APP_DIR
    mkdir -p $REMOTE_APP_DIR/logs
"@
Write-Host "✅ Directories created" -ForegroundColor Green
Write-Host ""

# Step 3: Copy the frontend build
Write-Host "📤 Copying frontend build to server..." -ForegroundColor Yellow
scp -i $SSH_KEY -r dist/* "$USER@$SERVER_IP`:$REMOTE_BUILD_DIR/"
Write-Host "✅ Frontend copied" -ForegroundColor Green
Write-Host ""

# Step 4: Copy backend files
Write-Host "📤 Copying backend files..." -ForegroundColor Yellow
# Copy essential backend files
scp -i $SSH_KEY server.js "$USER@$SERVER_IP`:$REMOTE_APP_DIR/"
scp -i $SSH_KEY package.json "$USER@$SERVER_IP`:$REMOTE_APP_DIR/"
scp -i $SSH_KEY package-lock.json "$USER@$SERVER_IP`:$REMOTE_APP_DIR/"
scp -i $SSH_KEY ecosystem.config.js "$USER@$SERVER_IP`:$REMOTE_APP_DIR/"
scp -i $SSH_KEY .env "$USER@$SERVER_IP`:$REMOTE_APP_DIR/"
scp -i $SSH_KEY tsconfig.json "$USER@$SERVER_IP`:$REMOTE_APP_DIR/"

# Copy necessary directories
Write-Host "📤 Copying source directories..." -ForegroundColor Yellow
scp -i $SSH_KEY -r src "$USER@$SERVER_IP`:$REMOTE_APP_DIR/"
scp -i $SSH_KEY -r models "$USER@$SERVER_IP`:$REMOTE_APP_DIR/"
scp -i $SSH_KEY -r services "$USER@$SERVER_IP`:$REMOTE_APP_DIR/"
scp -i $SSH_KEY -r config "$USER@$SERVER_IP`:$REMOTE_APP_DIR/"
scp -i $SSH_KEY -r prisma "$USER@$SERVER_IP`:$REMOTE_APP_DIR/"

Write-Host "✅ Backend files copied" -ForegroundColor Green
Write-Host ""

# Step 5: Install dependencies and restart services on server
Write-Host "🚀 Installing dependencies and restarting services..." -ForegroundColor Yellow
ssh -i $SSH_KEY "$USER@$SERVER_IP" @"
    cd $REMOTE_APP_DIR
    
    # Install dependencies
    echo '📦 Installing Node.js dependencies...'
    npm ci --production
    
    # Copy frontend build to appropriate location
    echo '📁 Moving frontend build to web directory...'
    sudo rm -rf $REMOTE_APP_DIR/dist/*
    sudo cp -r $REMOTE_BUILD_DIR/* $REMOTE_APP_DIR/dist/
    
    # Stop existing PM2 processes
    echo '🛑 Stopping existing PM2 processes...'
    pm2 stop all || true
    
    # Create admin user
    echo '👤 Creating admin user...'
    node create-admin-working.js || echo 'Admin user already exists or creation failed'
    
    # Start the application with PM2
    echo '🚀 Starting application with PM2...'
    pm2 start ecosystem.config.js --env production
    
    # Save PM2 configuration
    pm2 save
    
    # Update Nginx configuration
    echo '🌐 Updating Nginx configuration...'
    sudo tee /etc/nginx/sites-available/keysncaps > /dev/null << 'EOF'
server {
    listen 80;
    server_name keysncaps.com www.keysncaps.com $SERVER_IP;
    
    # Serve frontend files
    location / {
        root $REMOTE_APP_DIR/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Add caching headers for static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Proxy API requests to Node.js backend
    location /api/ {
        proxy_pass http://localhost:4242;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Proxy Stripe payment endpoint
    location /create-payment-intent {
        proxy_pass http://localhost:4242;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF
    
    # Test and reload Nginx
    sudo nginx -t && sudo systemctl reload nginx
    
    # Show status
    echo ''
    echo '📊 Deployment Status:'
    pm2 status
    echo ''
    echo '✅ Deployment complete!'
    echo ''
    echo '🔍 You can check logs with:'
    echo '   pm2 logs keysncaps-server'
    echo ''
    echo '🌐 Your application should be available at:'
    echo "   http://$SERVER_IP"
    echo '   http://keysncaps.com (if DNS is configured)'
"@

Write-Host ""
Write-Host "=== Deployment Complete! ===" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Next Steps:" -ForegroundColor Yellow
Write-Host "1. Visit http://$SERVER_IP to verify the deployment" -ForegroundColor White
Write-Host "2. Check application logs: ssh -i `"$SSH_KEY`" $USER@$SERVER_IP 'pm2 logs'" -ForegroundColor White
Write-Host "3. Monitor status: ssh -i `"$SSH_KEY`" $USER@$SERVER_IP 'pm2 status'" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Useful Commands:" -ForegroundColor Yellow
Write-Host "   Restart app: ssh -i `"$SSH_KEY`" $USER@$SERVER_IP 'pm2 restart all'" -ForegroundColor White
Write-Host "   View logs: ssh -i `"$SSH_KEY`" $USER@$SERVER_IP 'pm2 logs --lines 50'" -ForegroundColor White
Write-Host "   SSH to server: ssh -i `"$SSH_KEY`" $USER@$SERVER_IP" -ForegroundColor White