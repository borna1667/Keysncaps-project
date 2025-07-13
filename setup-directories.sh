#!/bin/bash
# Create necessary directories for production

echo "Creating production directories..."

# Create logs directory
mkdir -p logs

# Create backup directory
mkdir -p backups

# Set appropriate permissions
chmod 755 logs
chmod 755 backups

echo "✅ Directories created successfully"
