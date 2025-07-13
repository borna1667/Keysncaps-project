#!/bin/bash
# Health check script for production deployment

echo "=== Production Health Check ==="
echo

# Check if Node.js is installed
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js $(node -v) is installed"
else
    echo "❌ Node.js is not installed"
    exit 1
fi

# Check if PM2 is installed
if command -v pm2 >/dev/null 2>&1; then
    echo "✅ PM2 is installed"
else
    echo "❌ PM2 is not installed"
    exit 1
fi

# Check if .env file exists
if [ -f .env ]; then
    echo "✅ Environment file exists"
    
    # Check for required environment variables
    source .env
    
    if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-very-secure-secret-key" ]; then
        echo "⚠️  Warning: JWT_SECRET should be changed from default"
    else
        echo "✅ JWT_SECRET is configured"
    fi
    
    if [ -z "$MONGODB_URI" ]; then
        echo "❌ MONGODB_URI is not set"
    else
        echo "✅ MONGODB_URI is configured"
    fi
    
    if [ -z "$ALLOWED_ORIGIN" ]; then
        echo "⚠️  Warning: ALLOWED_ORIGIN is not set"
    else
        echo "✅ ALLOWED_ORIGIN is configured"
    fi
    
    if [ -z "$VITE_API_URL" ] || [ "$VITE_API_URL" = "http://localhost:4242" ]; then
        echo "⚠️  Warning: VITE_API_URL should be updated for production"
    else
        echo "✅ VITE_API_URL is configured for production"
    fi
    
else
    echo "❌ Environment file (.env) does not exist"
    echo "Copy .env.production to .env and configure it"
    exit 1
fi

# Check if logs directory exists
if [ -d logs ]; then
    echo "✅ Logs directory exists"
else
    echo "⚠️  Creating logs directory..."
    mkdir -p logs
fi

# Check disk space
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "⚠️  Warning: Disk usage is ${DISK_USAGE}%"
else
    echo "✅ Disk usage is acceptable (${DISK_USAGE}%)"
fi

# Check memory usage
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.2f", $3*100/$2}')
echo "📊 Memory usage: ${MEMORY_USAGE}%"

# Check if port 4242 is available
if netstat -ln | grep :4242 >/dev/null 2>&1; then
    echo "⚠️  Port 4242 is already in use"
    echo "📋 Process using port 4242:"
    lsof -i :4242 2>/dev/null || netstat -tlnp | grep :4242
else
    echo "✅ Port 4242 is available"
fi

# Check PM2 processes
echo
echo "📋 Current PM2 processes:"
pm2 list

echo
echo "=== Health Check Complete ==="
