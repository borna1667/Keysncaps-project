# Authentication Debug Guide

## Problem: "Not authorized, token failed"

This error indicates that the JWT token authentication is failing. Here's how to debug and fix it:

## Quick Fix Steps

### 1. **Check Server Status**
First, make sure your server is running:
```bash
node server.js
```
You should see:
```
Database connection has been established successfully.
Server is running on port 4242
```

### 2. **Test Authentication Manually**
Run the authentication test script:
```bash
node test-authentication.js
```

This will show you exactly where the authentication is failing.

### 3. **Check Admin Credentials**
Make sure you're using the correct admin credentials:
- **Email**: `admin@keysncaps.com`
- **Password**: `admin`

### 4. **Clear Browser Storage**
Clear your browser's localStorage and cookies:
```javascript
// In browser console:
localStorage.clear();
```
Then refresh the page and log in again.

### 5. **Check Token Expiration**
The new implementation gives admin users 4-hour tokens instead of 15-minute ones. If you were logged in before this change, your old token might be expired.

## Debugging Steps

### Step 1: Check Login Response
When you log in, check the browser's Network tab in Developer Tools. You should see:

**Login Request** (`POST /api/users/login`):
```json
{
  "email": "admin@keysncaps.com", 
  "password": "admin"
}
```

**Login Response**:
```json
{
  "_id": "...",
  "name": "Admin User",
  "email": "admin@keysncaps.com",
  "isAdmin": true,
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Step 2: Check Token Validation
After login, the app should validate your token. Check for:

**Validation Request** (`GET /api/auth/validate`):
```
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Validation Response**:
```json
{
  "valid": true,
  "user": {
    "id": "...",
    "email": "admin@keysncaps.com",
    "isAdmin": true,
    "name": "Admin User"
  }
}
```

### Step 3: Check Product Creation Request
When creating a product, verify:

**Product Creation Request** (`POST /api/products`):
```
Headers:
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json
```

### Common Issues and Solutions

#### Issue 1: "Not authorized, no token"
**Cause**: Token not being sent
**Solution**: Make sure you're logged in and the token is stored in localStorage

#### Issue 2: "Not authorized, token failed"
**Cause**: Token is invalid, expired, or malformed
**Solutions**:
1. Log out and log back in
2. Clear localStorage: `localStorage.clear()`
3. Check server logs for JWT verification errors

#### Issue 3: "Not authorized as an admin"
**Cause**: User exists but is not an admin
**Solution**: Make sure you're using the admin account credentials

#### Issue 4: "User not found for token"
**Cause**: Token is valid but user doesn't exist in database
**Solution**: Re-create admin user with: `node scripts/createAdminUser.js`

## Server Log Analysis

When you try to create a product, check the server console for these messages:

### Successful Flow:
```
🔐 Login attempt: { email: 'admin@keysncaps.com', passwordLength: 5 }
👤 User found: Yes
✅ Password match successful
🎫 Generated admin token with 4h expiry
Token received: eyJhbGciOiJIUzI1NiIs...
Token decoded successfully: { id: '...' }
User found: { id: '...', email: 'admin@keysncaps.com', isAdmin: true }
Creating new product: { name: '...', price: 99.99, ... }
Product created successfully: ...
```

### Failed Flow:
```
Token verification failed: [Error details]
```

## Manual Testing Commands

### Test Login:
```bash
curl -X POST http://localhost:4242/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@keysncaps.com","password":"admin"}'
```

### Test Token Validation:
```bash
curl -X GET http://localhost:4242/api/auth/validate \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Test Product Creation:
```bash
curl -X POST http://localhost:4242/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Product","price":99.99,"description":"Test","category":"keyboard","stock":10}'
```

## Environment Check

Make sure these environment variables are set:
- `JWT_SECRET` (or it will use a fallback)
- `MONGODB_URI` (for database connection)

## Final Steps

1. Run `node test-authentication.js` to verify everything works
2. If the test passes, try the admin interface again
3. If the test fails, check the error messages and server logs

The changes I made include:
- ✅ Extended admin token expiration to 4 hours
- ✅ Better error handling in authentication middleware
- ✅ Token validation before product creation
- ✅ Improved error messages in the frontend
- ✅ Automatic logout on authentication failures
