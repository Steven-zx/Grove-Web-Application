# Netlify Environment Variables Setup

## Problem
The admin login is failing with "Failed to fetch" because the deployed admin frontend doesn't know where the backend API is located.

## Solution
Set the `VITE_API_BASE_URL` environment variable in Netlify for both frontend sites.

---

## Step-by-Step Instructions

### 1. Get Your Backend URL
First, find your deployed backend URL. It should look like:
- Render: `https://your-app-name.onrender.com`
- Railway: `https://your-app-name.up.railway.app`
- Heroku: `https://your-app-name.herokuapp.com`

**Note:** Do NOT include `/api` at the end. The services add this automatically.

---

### 2. Configure Admin Frontend (Primary)

1. Go to Netlify Dashboard: https://app.netlify.com
2. Click on your **admin frontend site**
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable**
5. Set:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** Your backend URL (e.g., `https://grove-backend.onrender.com`)
   - **Scopes:** Check "Same value for all deploy contexts" (or set separately for production/preview)
6. Click **Save**
7. Go to **Deploys** → Click **Trigger deploy** → **Deploy site**

---

### 3. Configure User Frontend (Optional but Recommended)

Repeat the same steps for your **user frontend site**:

1. Go to Netlify Dashboard
2. Click on your **user frontend site**
3. Go to **Site settings** → **Environment variables**
4. Add the same variable:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** Your backend URL
5. Save and trigger a new deploy

---

### 4. Verify the Configuration

After deployment completes:

1. Open your admin site in browser
2. Open browser DevTools (F12)
3. Go to **Console** tab
4. Look for this log message:
   ```
   🔗 Admin API configured: {
     baseUrl: "https://your-backend-url.com/api",
     envVar: "https://your-backend-url.com",
     mode: "production"
   }
   ```

5. Try logging in with admin credentials:
   - Email: `admin@augustinegrove.com`
   - Password: `admin123`

---

## Troubleshooting

### Still Getting "Failed to fetch"?

**Check 1: Backend CORS Configuration**
The backend must allow requests from your Netlify URLs. In your backend `.env`, add:
```
ALLOWED_ORIGINS=https://your-user-site.netlify.app,https://your-admin-site.netlify.app
```

**Check 2: Backend is Running**
Visit your backend URL directly (e.g., `https://your-backend.onrender.com/api/health`)
You should see:
```json
{
  "message": "🌳 Grove Enhanced Backend API is running!",
  "timestamp": "...",
  "version": "2.0.0"
}
```

**Check 3: Environment Variable Saved**
- Go back to Netlify site settings → Environment variables
- Verify `VITE_API_BASE_URL` is listed
- Make sure you triggered a new deploy AFTER adding it

**Check 4: No Typos**
- Variable name MUST be exactly: `VITE_API_BASE_URL`
- No trailing slashes in the URL
- Must start with `https://` (not `http://` in production)

---

### Getting 401 Unauthorized?

This means the connection works, but credentials are wrong. Check:
- Email: `admin@augustinegrove.com`
- Password: `admin123`
- Make sure these match your backend `.env` file:
  ```
  ADMIN_EMAIL=admin@augustinegrove.com
  ADMIN_PASSWORD=admin123
  ```

---

### Still Not Working?

Check browser console for the exact error:
1. Open DevTools (F12)
2. Go to Console tab
3. Look for red error messages
4. Share the error message for further help

Common errors:
- **"ERR_NAME_NOT_RESOLVED"** → Backend URL is wrong or backend is down
- **"CORS error"** → Backend needs to whitelist your Netlify URL
- **"404 Not Found"** → Check API endpoint path (should be `/api/admin/login`)
- **"401 Unauthorized"** → Wrong admin credentials

---

## Quick Reference

### Correct Environment Variable
```
Key: VITE_API_BASE_URL
Value: https://your-backend-url.com
```

### Test Commands (Local Development)
```powershell
# Test backend health
Invoke-WebRequest -Uri "http://localhost:3000/api/health"

# Test admin login
$body = @{ email = "admin@augustinegrove.com"; password = "admin123" } | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3000/api/admin/login" -Method POST -Body $body -ContentType "application/json"
```

---

## After Configuration

Once environment variables are set and deployed:
- Any code push to GitHub will auto-deploy with the correct API URL
- Environment variables persist across deployments
- You only need to update them if the backend URL changes
