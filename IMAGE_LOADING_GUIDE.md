# Image Loading Troubleshooting Guide

This guide helps diagnose and fix image loading issues in the MERN Home Rentals app.

## Quick Setup

### 1. Start the Server
```bash
cd server
npm start
```
The server should run on **http://localhost:8000**

Verify:
- Terminal shows: `Database Connected Successfully`
- Terminal shows: `Server is running on port 8000`

### 2. Start the Client
In a new terminal:
```bash
cd client
npm run dev
```
Vite will start on **http://localhost:5173** or **http://localhost:5174** (if 5173 is busy)

## Image URLs Explained

### How Images Are Served

1. **Static Assets** (client/public/assets):
   - Location: `client/public/assets/`
   - URL: `http://localhost:8000/assets/filename.jpg`
   - Example: `http://localhost:8000/assets/logo.png`

2. **Uploaded User Images** (server/public/uploads):
   - Location: `server/public/uploads/`
   - Stored in DB as: `uploads/filename.jpg` or `public/uploads/filename.jpg`
   - Normalized to: `http://localhost:8000/uploads/filename.jpg`
   - The helper handles Windows backslashes and `public\` prefix stripping

3. **Profile Pictures** (from user uploads):
   - Stored in DB as varying formats (may include `public/` or backslashes)
   - Normalized by `getImageUrl()` in `client/src/utils/image.js`

## Testing Image Loading

### Test 1: Static Assets
1. Open browser DevTools (F12)
2. Go to http://localhost:8000/assets/logo.png
3. Should display the Airbnb-style logo

### Test 2: Uploaded Images
1. Go to http://localhost:8000/uploads/windmills_1.jpg
2. Should display the windmill image (if it exists from previous uploads)

### Test 3: Category Images
1. Open the app homepage
2. Scroll to categories section
3. Check DevTools Network tab for category image requests
4. Should see requests like: `http://localhost:8000/assets/beach_cat.jpg`

### Test 4: Listing Card Images
1. Browse listings on the homepage
2. Check Network tab for listing images
3. Images should load from `http://localhost:8000/uploads/...`

### Test 5: Profile Picture
1. Login to the app
2. Profile picture in navbar (top right) should load
3. Check Network tab in DevTools

## Debugging Failed Images

### If an image fails to load:

1. **Open DevTools (F12) → Network tab**
2. **Reload the page (Ctrl+R)**
3. **Look for failed/red image requests**
4. **Right-click the failed request → Copy as cURL**
5. **Share the URL from that request**

Example failed request URL:
```
http://localhost:8000/uploads/myPhoto_12345.jpg
```

### Check if File Exists

If you have a failed URL like `http://localhost:8000/uploads/myPhoto_12345.jpg`:

```bash
# On Windows PowerShell
Test-Path "server\public\uploads\myPhoto_12345.jpg"

# Should return True if file exists
```

## Image URL Helper (`getImageUrl`)

### Location
`client/src/utils/image.js`

### What It Does
```javascript
getImageUrl(pathOrUrl)
```

- Input: DB-stored path like `uploads/file.jpg` or `public\uploads\file.jpg`
- Removes `public/` or `public\` prefix
- Converts Windows backslashes to forward slashes
- Returns: `http://localhost:8000/uploads/file.jpg`

### Used In
- `ListingCard.jsx` - Images in listing cards
- `ListingDetails.jsx` - Full listing images and creator profile
- `Navbar.jsx` - User profile picture in navbar
- `ProfilePage.jsx` - User profile picture on profile page
- `EditListing.jsx` - Existing listing images during edit

## Common Issues & Fixes

### Issue 1: Profile Pictures Load but Listing Images Don't
**Cause**: Different path storage format in database

**Fix**: Clear browser cache (Ctrl+Shift+Delete) and reload

### Issue 2: Images Return 404 Errors
**Cause**: File doesn't exist in `server/public/uploads/` or path mismatch

**Solution**:
1. Verify server is running on port 8000
2. Check file exists: `server/public/uploads/filename.jpg`
3. Check browser DevTools → Network tab for exact URL
4. Share the URL that fails so we can debug

### Issue 3: CORS Errors
**Cause**: Server not accessible from client

**Fix**:
1. Ensure server is running on port 8000
2. Verify no firewall blocking port 8000
3. Try accessing http://localhost:8000 directly in browser
4. Check server terminal for error messages

### Issue 4: Windows Backslash Paths
**Cause**: Database has paths like `uploads\file.jpg` (Windows style)

**Fix**: Automatic - `getImageUrl()` handles this conversion

## Manual Testing Screenshots

### What to Check
1. Category images on homepage - should be colorful category icons
2. Listing cards - should show property photos
3. Listing details page - should show full-size photos
4. Navbar profile picture - should show user avatar
5. Profile page - should show profile picture

## Port Checking

If server won't start with "EADDRINUSE" error:

### Windows PowerShell:
```powershell
# Find what's using port 8000
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -Property ProcessId

# Kill the process (if ID is, say, 1234)
Stop-Process -Id 1234 -Force

# Restart server
npm start
```

## Final Verification Checklist

- [ ] Server running on port 8000
- [ ] Client running on port 5173 or 5174
- [ ] Logo appears in navbar
- [ ] Category images appear on homepage
- [ ] Listing cards show property photos
- [ ] Profile picture shows in navbar dropdown
- [ ] Clicking a listing opens full details with images
- [ ] No console errors (F12 → Console tab)
- [ ] No network 404s (F12 → Network tab)

## Need Help?

Provide:
1. Failed image URL from DevTools Network tab
2. Server terminal logs (paste the full output)
3. Browser console errors (F12 → Console)
4. Which page/component the image is on

