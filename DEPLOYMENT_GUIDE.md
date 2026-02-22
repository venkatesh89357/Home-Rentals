# MERN Home Rentals - Deployment Guide

## Overview
This guide covers deploying your MERN application:
- **Frontend:** Vercel (React with Vite)
- **Backend:** Render (Express.js with MongoDB)

---

## Backend Deployment (Render)

### Prerequisites
- GitHub account with your code pushed
- Render account (sign up at https://render.com)
- MongoDB Atlas account (already set up with connection string)

### Step-by-Step Backend Deployment

#### 1. Push Code to GitHub
```bash
git add .
git commit -m "Prepare for Render deployment"
git push origin main
```

#### 2. Create a Render Web Service
1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository and branch (main)

#### 3. Configure the Web Service on Render
- **Name:** `mern-home-rentals-api` (or your preferred name)
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `npm run prod`
- **Region:** Choose closest to your location

#### 4. Add Environment Variables
In Render dashboard, go to your service's "Environment" tab and add:

```
MONGO_URI=mongodb+srv://rentaluser:Test123@cluster0.t4n4zdo.mongodb.net/?appName=Cluster0
PORT=8000
JWT_SECRET_KEY=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=production
FRONTEND_URL=https://your-vercel-app.vercel.app
```

> ⚠️ **Important:** Generate a strong JWT_SECRET_KEY in production:
> ```
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

#### 5. Deploy
- Click "Deploy" button
- Wait for deployment to complete
- Your API will be available at: `https://mern-home-rentals.onrender.com`

#### 6. Test the Backend
```bash
# Open in browser or Postman
https://mern-home-rentals.onrender.com/
```

---

## Frontend Deployment (Vercel)

### Prerequisites
- GitHub account with your code pushed
- Vercel account (https://vercel.com)
- Backend URL from Render deployment

### Step-by-Step Frontend Deployment

#### 1. Update Environment Variables
The `.env.production` file already contains:
```
VITE_API_URL=https://mern-home-rentals.onrender.com
```

> **Note:** Update this URL if your Render service has a different name.

#### 2. Deploy to Vercel - Option A: Using Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to client directory
cd client

# Deploy
vercel --prod
```

#### 3. Deploy to Vercel - Option B: Using GitHub Integration (Recommended)

1. Go to https://vercel.com and sign in
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Environment Variables:**
   - Go to "Settings" → "Environment Variables"
   - Add: `VITE_API_URL=https://mern-home-rentals.onrender.com`

6. Click "Deploy"

#### 4. Verify Frontend
- Your app will be available at a URL like: `https://your-project-name.vercel.app`
- Test login/register/listings to ensure Backend connection works

---

## Connecting Frontend to Backend

### If Frontend and Backend URLs are Configured Properly:

1. **Backend Render URL:** Used in frontend's `.env.production`
2. **Frontend Vercel URL:** Add to backend's `FRONTEND_URL` environment variable

The application will automatically use:
- `http://localhost:8000` in development
- `https://mern-home-rentals.onrender.com` in production

---

## File Structure Reference

### Updated Client Configuration:
- `client/.env.development` - Development environment
- `client/.env.production` - Production environment (Vercel)
- `client/src/config/api.js` - API configuration file

### Updated Backend Configuration:
- `server/.env` - Development environment
- `server/.env.production` - Production environment (Render)
- `server/server.js` - Updated CORS handling
- `server/package.json` - Updated scripts

---

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console:

1. **Verify Backend CORS Configuration:**
   - Check `server/server.js` has correct frontend URL
   - Add your Vercel URL to `allowedOrigins`

2. **Update Environment Variable:**
   - In Render dashboard, update `FRONTEND_URL`
   - Redeploy backend

3. **Test Backend Health:**
   ```bash
   curl https://mern-home-rentals.onrender.com/
   ```

### API Connection Issues
1. Check network tab in browser console for failed requests
2. Verify `VITE_API_URL` is set correctly in Vercel
3. Use absolute URLs in browser devtools Network tab
4. Check Render logs for backend errors

### Cold Start Issues
- Render free tier apps may sleep after 15 minutes of inactivity
- First request may take 30 seconds
- Consider upgrading to Pro tier for faster performance

---

## Domain Setup (Optional)

### Vercel Custom Domain:
1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration steps

### Render Custom Domain:
1. Go to Render service → Settings
2. Add custom domain
3. Update DNS records

---

## Environment Variables Summary

### Client (`.env.production`):
```
VITE_API_URL=https://mern-home-rentals.onrender.com
```

### Server (Render Dashboard):
```
MONGO_URI=<your-mongodb-atlas-url>
PORT=8000
JWT_SECRET_KEY=<strong-secret-key>
NODE_ENV=production
FRONTEND_URL=<vercel-app-url>
```

---

## Next Steps

1. ✅ Deploy backend to Render
2. ✅ Deploy frontend to Vercel
3. ✅ Get both URLs
4. ✅ Update environment variables
5. ✅ Test complete flow (Register → Login → Create Listing → Browse)
6. 🔄 Monitor logs for any issues
7. 📊 Set up monitoring/alerts (optional)

---

## Support & Resources

- Render Documentation: https://render.com/docs
- Vercel Documentation: https://vercel.com/docs
- Vite Documentation: https://vitejs.dev/guide/
- Express.js Documentation: https://expressjs.com/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas

---

**Deployment Date:** February 22, 2026
**Last Updated:** As per current guide
