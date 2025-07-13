# Quick Deployment Script for Keys'n'Caps
# This assumes initial setup has been done

$SSH_KEY = "C:\path\to\your\private-key.pem"
$SERVER = "ubuntu@YOUR_SERVER_IP"
$APP_DIR = "/var/www/react-app"

Write-Host "🚀 Quick Deploy Started..." -ForegroundColor Cyan

# Build frontend
Write-Host "📦 Building frontend..." -ForegroundColor Yellow
npm run build

# Create deployment package
Write-Host "📤 Deploying to server..." -ForegroundColor Yellow

# Copy build and essential files in one go
scp -i $SSH_KEY -r dist/* "${SERVER}:/home/ubuntu/dist/"
scp -i $SSH_KEY server.js package*.json ecosystem.config.js .env "${SERVER}:${APP_DIR}/"
scp -i $SSH_KEY -r src models services config prisma "${SERVER}:${APP_DIR}/"

# Deploy on server
ssh -i $SSH_KEY $SERVER @"
    cd $APP_DIR
    sudo cp -r /home/ubuntu/dist/* ./dist/
    npm ci --production
    pm2 restart all
    sudo systemctl reload nginx
    pm2 status
"@

Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "🌐 Check your site at: http://YOUR_SERVER_IP" -ForegroundColor Cyan 