# Netlify Deployment Guide for Grove Web Application

## Overview
This application consists of **3 parts** that need to be deployed separately:
1. **User Frontend** (React/Vite)
2. **Admin Frontend** (React/Vite)
3. **Backend API** (Node.js/Express)

---

## Part 1: Deploy Backend (Choose One Platform)

### Option A: Deploy to Render.com (Recommended - Free Tier Available)

1. **Create account** at [render.com](https://render.com)

2. **Create New Web Service**
   - Connect your GitHub repository
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment**: Node

3. **Add Environment Variables**:
   ```
   PORT=3000
   NODE_ENV=production
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_KEY=<your-supabase-anon-key>
   SUPABASE_SERVICE_KEY=<your-supabase-service-key>
   JWT_SECRET=<your-jwt-secret>
   JWT_EXPIRES_IN=24h
   ADMIN_EMAIL=admin@augustinegrove.com
   ADMIN_PASSWORD=admin123
   GALLERY_BUCKET=gallery
   MAX_UPLOAD_BYTES=5242880
   PAYMONGO_MODE=test
   PAYMONGO_SECRET_KEY=<your-paymongo-secret>
   PAYMONGO_PUBLIC_KEY=<your-paymongo-public>
   PAYMONGO_SUCCESS_URL=<your-user-site-url>/payment/success
   PAYMONGO_FAILED_URL=<your-user-site-url>/payment/failed
   ```

4. **Deploy** and copy your backend URL (e.g., `https://grove-backend.onrender.com`)

### Option B: Deploy to Railway

1. Create account at [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub repo**
3. Select your repository
4. Add environment variables (same as above)
5. Set **Root Directory**: `backend`
6. Set **Start Command**: `npm start`

### Option C: Deploy to Heroku

1. Install Heroku CLI: `npm install -g heroku`
2. Login: `heroku login`
3. Create app: `heroku create grove-backend`
4. Set buildpack: `heroku buildpacks:set heroku/nodejs`
5. Configure environment variables:
   ```bash
   heroku config:set SUPABASE_URL=<url>
   heroku config:set SUPABASE_KEY=<key>
   # ... add all other env vars
   ```
6. Create `Procfile` in backend folder:
   ```
   web: node hotdog.js
   ```
7. Deploy:
   ```bash
   git subtree push --prefix backend heroku main
   ```

---

## Part 2: Deploy User Frontend to Netlify

1. **Login to Netlify** at [netlify.com](https://netlify.com)

2. **Click "Add new site" → "Import an existing project"**

3. **Connect to GitHub** and select your repository

4. **Configure Build Settings**:
   - **Branch to deploy**: `main`
   - **Base directory**: `frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `frontend/dist`

5. **Add Environment Variable**:
   - Go to **Site settings → Environment variables**
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com` (without trailing slash)

6. **Deploy Site**

7. **Custom Domain (Optional)**:
   - Go to **Domain settings**
   - Add your custom domain (e.g., `grove.yourdomain.com`)

---

## Part 3: Deploy Admin Frontend to Netlify

1. **Click "Add new site"** again (create a second site)

2. **Connect to the same GitHub repository**

3. **Configure Build Settings**:
   - **Branch to deploy**: `main`
   - **Base directory**: `admin/frontend`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `admin/frontend/dist`

4. **Add Environment Variable**:
   - Go to **Site settings → Environment variables**
   - Add: `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com` (without trailing slash)

5. **Deploy Site**

6. **Custom Domain (Optional)**:
   - Add subdomain (e.g., `admin.grove.yourdomain.com`)

---

## Part 4: Update Backend CORS Settings

After deploying frontends, update backend CORS to allow your Netlify URLs:

Edit `backend/hotdog.js`:
```javascript
// Update CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'https://your-user-site.netlify.app',
    'https://your-admin-site.netlify.app',
    'https://grove.yourdomain.com',
    'https://admin.grove.yourdomain.com'
  ],
  credentials: true
};
```

Redeploy the backend after this change.

---

## Part 5: Update PayMongo URLs (If Using Payments)

Update these environment variables in your backend:
```
PAYMONGO_SUCCESS_URL=https://your-user-site.netlify.app/payment/success
PAYMONGO_FAILED_URL=https://your-user-site.netlify.app/payment/failed
```

---

## Netlify Build Settings Summary

### User Frontend Site
```
Base directory: frontend
Build command: npm install && npm run build
Publish directory: frontend/dist
Environment variables:
  VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

### Admin Frontend Site
```
Base directory: admin/frontend
Build command: npm install && npm run build
Publish directory: admin/frontend/dist
Environment variables:
  VITE_API_BASE_URL=https://your-backend-url.onrender.com
```

---

## Troubleshooting

### Issue: 404 on page refresh
**Solution**: Add `_redirects` file to handle SPA routing

For both frontends, create `public/_redirects`:
```
/*    /index.html   200
```

### Issue: API calls failing
- Check that `VITE_API_BASE_URL` is set correctly (no trailing slash)
- Verify backend CORS allows your frontend URLs
- Check browser console for specific errors

### Issue: Environment variables not working
- Environment variables in Vite must start with `VITE_`
- Rebuild site after adding/changing env vars
- Clear build cache: Site settings → Build & deploy → Clear cache and retry

---

## Testing Deployment

1. **Test User Site**:
   - Visit your user site URL
   - Try login/registration
   - Test booking a facility
   - Check gallery loads

2. **Test Admin Site**:
   - Visit admin site URL
   - Login with admin credentials
   - Upload image to gallery
   - Check bookings management

3. **Test API Connection**:
   - Open browser console
   - Check Network tab for API calls
   - Verify requests go to correct backend URL

---

## Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] User frontend deployed
- [ ] Admin frontend deployed
- [ ] Environment variables set on all sites
- [ ] CORS configured correctly
- [ ] PayMongo URLs updated (if applicable)
- [ ] Custom domains configured (optional)
- [ ] Test user registration and login
- [ ] Test admin login and gallery upload
- [ ] Test booking creation
- [ ] Verify Supabase connection works

---

## Continuous Deployment

Netlify automatically redeploys when you push to the `main` branch on GitHub. To disable:
- Go to **Site settings → Build & deploy → Continuous deployment**
- Toggle off "Auto publishing"

---

## Cost Considerations

- **Netlify**: Free tier includes 100GB bandwidth, 300 build minutes/month
- **Render.com**: Free tier available (sleeps after 15 min inactivity)
- **Railway**: $5/month for 500 hours
- **Heroku**: Eco dynos $5/month

**Recommended**: Start with Netlify (frontends) + Render free tier (backend)
