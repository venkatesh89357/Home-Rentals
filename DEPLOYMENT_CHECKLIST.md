# Quick Deployment Checklist

## Before Deploying

### Backend (Render)
- [ ] Push all code to GitHub
- [ ] Verify MongoDB Atlas connection string is correct in `.env`
- [ ] Test API locally with `npm start`
- [ ] Generate a strong JWT_SECRET_KEY
- [ ] Have Render account ready
- [ ] Have GitHub account with repo access

### Frontend (Vercel)  
- [ ] Verify `.env.production` has correct backend URL
- [ ] Test build locally: `npm run build`
- [ ] Verify `vercel.json` is in client directory
- [ ] Have Vercel account ready
- [ ] Connect GitHub repository to Vercel

## Deployment Steps

### Step 1: Deploy Backend to Render
1. Go to https://dashboard.render.com
2. Click "New Web Service"
3. Select your GitHub repository
4. Configure:
   - Build Command: `npm install`
   - Start Command: `npm run prod`
   - Environment: Node
5. Add environment variables:
   ```
   MONGO_URI=<your_mongodb_uri>
   PORT=8000
   JWT_SECRET_KEY=<strong_secret_key>
   NODE_ENV=production
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
6. Deploy and wait for completion
7. Note the Render `.onrender.com` URL

### Step 2: Update Frontend Environment
1. Edit `client/.env.production`
2. Update with your Render URL:
   ```
   VITE_API_URL=https://mern-home-rentals.onrender.com
   ```

### Step 3: Deploy Frontend to Vercel
1. Go to https://vercel.com
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure:
   - Framework: Vite
   - Root Directory: client
   - Build Command: npm run build
   - Output Directory: dist
5. Add environment variable:
   ```
   VITE_API_URL=https://mern-home-rentals.onrender.com
   ```
6. Deploy and wait for completion

### Step 4: Test Complete Application
1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Test user registration
3. Test user login
4. Test creating a listing
5. Test browsing listings
6. Test booking a property

## Important URLs to Update

- **Backend (Render):** `https://mern-home-rentals.onrender.com`
- **Frontend (Vercel):** `https://your-project-name.vercel.app`
- **API Configuration:** `client/.env.production`

## Troubleshooting

### Issue: CORS Errors
- **Solution:** Verify `FRONTEND_URL` in Render environment variables
- Redeploy backend after updating

### Issue: API Not Found (404)
- **Solution:** Check `VITE_API_URL` in Vercel environment
- Verify Render backend is running

### Issue: Slow First Load
- **Solution:** Normal for first request on free tier (cold start)
- Backend may be sleeping after inactivity

### Issue: Build Failures
- **Solution:** Check build logs in Vercel/Render dashboard
- Verify all dependencies are in package.json

## Environment Variables Needed

### Render (Backend)
```
MONGO_URI=mongodb+srv://rentaluser:Test123@cluster0.t4n4zdo.mongodb.net/?appName=Cluster0
PORT=8000
JWT_SECRET_KEY=<generate-strong-key>
NODE_ENV=production
FRONTEND_URL=https://your-vercel-url.vercel.app
```

### Vercel (Frontend)
```
VITE_API_URL=https://mern-home-rentals.onrender.com
```

## Support

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- GitHub: Check deployment logs

## Status

- [ ] Backend deployed to Render
- [ ] Frontend deployed to Vercel
- [ ] Environment variables configured
- [ ] Full app tested in production
- [ ] Custom domains configured (optional)
