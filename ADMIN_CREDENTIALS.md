# Admin Login Credentials

## 🔐 Admin Dashboard Access

### Login Information
- **Email:** `admin@keysncaps.com`
- **Password:** `admin123`

### Access URLs
- **Frontend Admin Dashboard:** http://localhost:5173/admin
- **Backend Admin API:** http://localhost:4242/api/admin
- **Login API Endpoint:** http://localhost:4242/api/users/login

### Important Notes
- The admin user was created with full administrative privileges
- The password is case-sensitive
- Make sure both frontend (port 5173) and backend (port 4242) servers are running
- CORS is configured to allow requests from the frontend

### Testing the API
You can test the login API directly using PowerShell:

```powershell
$headers = @{"Origin"="http://localhost:5173"; "Content-Type"="application/json"}
$body = '{"email":"admin@keysncaps.com","password":"admin123"}'
Invoke-WebRequest -Uri "http://localhost:4242/api/users/login" -Method POST -Headers $headers -Body $body
```

### Resetting Admin User
If you need to reset the admin user, run:
```bash
node reset-users-and-create-admin.js
```
