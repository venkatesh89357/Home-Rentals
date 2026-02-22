# Step-by-Step Deployment Instructions

## Phase 1: Preparation (5 minutes)

### 1.1 Create GitHub Repository (if not already done)
```bash
# Navigate to your project root
cd d:\MERN-Home-Rentals

# Initialize git (if needed)
git init

# Add all files
git add .

# Commit
git commit -m "MERN Home Rentals - Ready for deployment"

# Add remote (replace with your GitHub repo URL)
git remote add origin https://github.com/YOUR-USERNAME/MERN-Home-Rentals.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 1.2 Create Required Accounts (if not already done)
- [ ] Render Account: https://render.com (sign up)
- [ ] Vercel Account: https://vercel.com (sign up with GitHub)
- [ ] MongoDB Atlas: Already configured ✅

---

## Phase 2: Deploy Backend to Render (10 minutes)

### 2.1 Create Render Web Service

1. **Go to Render Dashboard:** https://dashboard.render.com
2. **Click "New +" → "Web Service"**
3. **Connect GitHub:**
   - Select "GitHub" as repository source
   - Look for `MERN-Home-Rentals` repository
   - Click "Connect"

4. **Configure Web Service:**
   - **Name:** `mern-home-rentals-api`
   - **Environment:** Node
   - **Region:** Choose closest to you
   - **Branch:** main
   - **Build Command:** `npm install`
   - **Start Command:** `npm run prod`
   - **Plan:** Free (or Starter for production)

### 2.2 Add Environment Variables

Once service is created:
1. Click on your service
2. Go to "Environment" tab
3. Add these variables:

```
MONGO_URI = mongodb+srv://rentaluser:Test123@cluster0.t4n4zdo.mongodb.net/?appName=Cluster0
PORT = 8000
JWT_SECRET_KEY = (Generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
NODE_ENV = production
FRONTEND_URL = https://will-update-after-vercel-deployment
```

### 2.3 Deploy Backend

1. Click "Deploy" button
2. Wait for deployment (2-3 minutes)
3. Check logs for any errors
4. Once complete, note your Render URL: `https://mern-home-rentals.onrender.com`

### 2.4 Test Backend

Open in browser:
```
https://mern-home-rentals.onrender.com/
```

You should see:
```json
{"message": "MERN Home Rentals API is running"}
```

✅ **Backend Deployed Successfully!**

---

## Phase 3: Deploy Frontend to Vercel (10 minutes)

### 3.1 Update Frontend Environment Variable

Edit `client/.env.production`:
```
VITE_API_URL=https://mern-home-rentals.onrender.com
```

Commit this change:
```bash
git add client/.env.production
git commit -m "Update API URL for production"
git push origin main
```

### 3.2 Import Project to Vercel

1. **Go to Vercel Dashboard:** https://vercel.com/dashboard
2. **Click "Add New" → "Project"**
3. **Import GitHub Repository:**
   - Search for `MERN-Home-Rentals`
   - Click "Import"

### 3.3 Configure Project Settings

1. **Project Name:** mern-home-rentals (or your choice)
2. **Framework Preset:** Vite
3. **Root Directory:** client
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Install Command:** `npm install`

### 3.4 Add Environment Variables

1. Click "Environment Variables"
2. Add:
   - **Name:** `VITE_API_URL`
   - **Value:** `https://mern-home-rentals.onrender.com`
3. Click "Save"

### 3.5 Deploy Frontend

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Once complete, you'll get a URL like: `https://your-project.vercel.app`
4. Copy this URL

✅ **Frontend Deployed Successfully!**

---

## Phase 4: Final Configuration (5 minutes)

### 4.1 Update Backend with Frontend URL

1. Go back to Render dashboard
2. Click on `mern-home-rentals-api` service
3. Go to "Environment" tab
4. Update `FRONTEND_URL`:
   ```
   FRONTEND_URL=https://your-project.vercel.app
   ```
5. Click "Save"
6. Redeploy backend:
   - Click on the service
   - Manual deploy → Push to GitHub or click "Redeploy"

### 4.2 Verify Both Services

**Backend Health Check:**
```bash
curl https://mern-home-rentals.onrender.com/
```

**Frontend Access:**
Open browser → `https://your-project.vercel.app`

---

## Phase 5: Complete Application Testing (10 minutes)

### 5.1 Test User Registration
1. Navigate to Vercel URL
2. Click "Register"
3. Fill in details:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: TestPassword123
   - Upload profile image
4. Click "Register"
5. Should redirect to Login page

### 5.2 Test User Login
1. Enter your email and password
2. Click "Login"
3. Should see homepage with listings
4. Should see user profile icon in navbar

### 5.3 Test Creating a Listing
1. Click on profile icon → "My Properties"
2. Click "Create Listing"
3. Fill in property details:
   - Category: (select one)
   - Type: (select one)
   - Location details
   - Description
   - Price
   - Upload photos
4. Click "Create"
5. Should appear in your property list

### 5.4 Test Browse & Search
1. Go back to homepage
2. Click categories to filter
3. Use search bar to find properties
4. Click on a listing to view details

### 5.5 Test Booking
1. View a listing (created by someone else)
2. Select dates with calendar
3. Click "Book Now"
4. Should see booking confirmation
5. Check "My Trips" in profile

✅ **All Tests Passed!**

---

## Troubleshooting

### Issue: CORS Error in Browser Console
**Error:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution:**
1. Check backend `FRONTEND_URL` environment variable
2. Make sure it matches your Vercel URL exactly
3. Redeploy backend

### Issue: 404 Not Found Errors
**Symptoms:** API calls returning 404

**Solution:**
1. Verify `VITE_API_URL` in Vercel environment variables
2. Make sure Render backend is running
3. Check Render logs for backend errors

### Issue: Slow Initial Load
**Symptoms:** First request takes 30+ seconds

**Normal for free tier Render.** Backend goes to sleep after 15 minutes inactivity.
- Solution: Upgrade to paid tier or accept the delay

### Issue: 500 Errors from Backend
**Symptoms:** Server errors when making requests

**Solution:**
1. Check Render logs
2. Verify MongoDB connection string
3. Verify all environment variables are set
4. Check for typos in secrets

### Issue: Image Not Loading
**Symptoms:** Images show broken icon

**Solution:**
1. Verify image paths in database
2. Check `VITE_API_URL` is correct
3. Images should be at: `https://mern-home-rentals.onrender.com/` + image path

---

## Important Configuration Summary

### Frontend (Vercel)
```
VITE_API_URL=https://mern-home-rentals.onrender.com
```

### Backend (Render Environment Variables)
```
MONGO_URI=mongodb+srv://rentaluser:Test123@cluster0.t4n4zdo.mongodb.net/?appName=Cluster0
PORT=8000
JWT_SECRET_KEY=<strong-random-key>
NODE_ENV=production
FRONTEND_URL=<your-vercel-url>
```

### MongoDB Atlas
- Connection already configured ✅
- Just ensure IP whitelist includes Render server

---

## URLs After Deployment

| Service | URL |
|---------|-----|
| **Backend API** | `https://mern-home-rentals.onrender.com` |
| **Frontend App** | `https://your-project.vercel.app` |
| **Render Dashboard** | `https://dashboard.render.com` |
| **Vercel Dashboard** | `https://vercel.com/dashboard` |
| **MongoDB Atlas** | `https://cloud.mongodb.com` |

---

## Final Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Vercel account created
- [ ] Backend deployed to Render
- [ ] Backend URL working (test in browser)
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variables set
- [ ] Backend environment variables updated with Frontend URL
- [ ] Backend redeployed with Frontend URL
- [ ] Complete user flow tested (Register → Login → Create → Browse → Book)
- [ ] All API calls working
- [ ] Images loading correctly
- [ ] No CORS errors in console
- [ ] No 404 errors for API calls

---

## Deployment Complete! 🎉

Your MERN Home Rentals application is now live!

📱 **Share your app:** `https://your-project.vercel.app`

---

**Need Help?**
- Render Support: https://render.com/docs
- Vercel Support: https://vercel.com/support
- GitHub Issues: Check your repository

**Last Updated:** February 22, 2026
