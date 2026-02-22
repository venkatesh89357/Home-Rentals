# Installation & Verification Checklist

Use this checklist to verify the app is set up correctly and all features are working.

---

## Pre-Setup Checklist

### System Requirements
- [ ] Node.js installed (v14+)
  ```bash
  node --version
  ```
- [ ] npm installed
  ```bash
  npm --version
  ```
- [ ] MongoDB installed or MongoDB Atlas account
  ```bash
  mongod --version  # for local MongoDB
  ```
- [ ] Git installed (optional)
  ```bash
  git --version
  ```

### Environment
- [ ] Windows PowerShell or Command Prompt available
- [ ] Network access to localhost ports 8000, 5173
- [ ] Port 8000 is free (not in use)
- [ ] Port 5173 or 5174 is free (Vite will fallback to 5174)

---

## Installation Checklist

### 1. Install Server Dependencies
```bash
cd /d:\MERN-Home-Rentals/server
npm install
```
- [ ] No errors during npm install
- [ ] `node_modules/` folder created
- [ ] `package-lock.json` generated

### 2. Install Client Dependencies
```bash
cd /d:\MERN-Home-Rentals/client
npm install
```
- [ ] No errors during npm install
- [ ] `node_modules/` folder created
- [ ] `package-lock.json` generated

### 3. Create Server Environment File
Create file: `server/.env`
```
MONGODB_URI=mongodb://localhost:27017/mern-home-rentals
JWT_SECRET=your_secret_key_12345
PORT=8000
```
- [ ] `.env` file created
- [ ] MONGODB_URI set correctly
- [ ] JWT_SECRET is non-empty
- [ ] PORT is 8000

### 4. Verify Database Connection
```bash
# For local MongoDB, ensure mongod is running
mongod
```
- [ ] MongoDB is running (local) or
- [ ] MongoDB Atlas connection string is valid

---

## Startup Checklist

### Terminal 1: Start Backend
```bash
cd server
npm start
```
- [ ] Terminal shows: `"Database Connected Successfully"`
- [ ] Terminal shows: `"Server is running on port 8000"`
- [ ] No error messages
- [ ] No "EADDRINUSE" errors

**If EADDRINUSE Error:**
```bash
# Kill process using port 8000
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue | Select-Object -Property ProcessId | Stop-Process -Force
npm start
```

### Terminal 2: Start Frontend
```bash
cd client
npm run dev
```
- [ ] Terminal shows: `"Local: http://localhost:5173"` (or 5174)
- [ ] No build errors
- [ ] "ready in XXXms" message shown
- [ ] VITE dev server is running

### Verification
- [ ] Open http://localhost:8000 in browser
  - [ ] Should show JSON: `{"message":"MERN Home Rentals API is running"}`
- [ ] Open http://localhost:5173 (or 5174) in browser
  - [ ] Should show the app homepage

---

## Application Features Checklist

### Navigation
- [ ] Logo appears in navbar (top-left)
- [ ] "Home" text/button visible next to logo
- [ ] Search bar functional in navbar
- [ ] Profile icon visible in navbar (top-right)

### Homepage
- [ ] Listings load without errors
- [ ] Category images display (beach_cat, mountain_cat, etc.)
- [ ] Listing cards show property photos
- [ ] "Become A Host" button visible for logged-out users

### Authentication
- [ ] Can navigate to Login page
  - [ ] Email and password fields present
  - [ ] "Sign Up" link at bottom
  - [ ] Login button works
- [ ] Can navigate to Register page
  - [ ] Name, email, password fields present
  - [ ] "Log In" link at bottom
  - [ ] Register button works
- [ ] Can register with test account
  - [ ] Email validation works
  - [ ] Password requirements clear
  - [ ] Account created successfully
- [ ] Can login with registered account
  - [ ] Redirects to homepage after login
  - [ ] Token stored in browser
  - [ ] Navbar shows logged-in state

### User Profile
- [ ] After login, profile icon in navbar shows user picture or placeholder
- [ ] Can click profile menu dropdown
  - [ ] "Profile" option visible
  - [ ] "Trip List" option visible
  - [ ] "Wish List" option visible
  - [ ] "Property List" option visible
  - [ ] "Reservation List" option visible
  - [ ] "Log Out" option visible
- [ ] Can navigate to Profile page
  - [ ] First name field shown
  - [ ] Last name field shown
  - [ ] Email field shown
  - [ ] Profile picture displayed (or placeholder)
  - [ ] Edit button available
  - [ ] Can update profile fields
  - [ ] Can upload profile picture

### Listings
- [ ] Can navigate to Create Listing page
  - [ ] Category dropdown works
  - [ ] Type dropdown works
  - [ ] All form fields present
  - [ ] Photo upload interface visible
  - [ ] Can select multiple photos
  - [ ] Photo preview shows images
  - [ ] Can reorder photos (drag/drop)
  - [ ] Can remove photos
  - [ ] Create button works
  - [ ] Redirects to listing after creation
- [ ] Created listing appears in "My Properties"
- [ ] Can click on any listing to view details
  - [ ] Full-size images display
  - [ ] Listing info shows (title, price, description)
  - [ ] Host information displayed
  - [ ] Host profile picture shown
  - [ ] Book button visible
  - [ ] Date range picker works
- [ ] Can edit own listing
  - [ ] Edit button visible for owner
  - [ ] Can change listing details
  - [ ] Can remove existing photos
  - [ ] Can add new photos
  - [ ] Changes save successfully
- [ ] Cannot edit other user's listings
  - [ ] Edit button not visible for non-owners

### Search & Filter
- [ ] Can search in navbar search bar
  - [ ] Redirects to search results
  - [ ] Results filter correctly by search term
- [ ] Can browse by category
  - [ ] Category cards link to category page
  - [ ] Category page shows filtered listings

### Bookings
- [ ] Can select dates on listing details
  - [ ] Date range picker works
  - [ ] Valid date range selected
- [ ] Can complete booking
  - [ ] Payment redirect works (if applicable)
  - [ ] Booking appears in Trip List
- [ ] Trip List shows user's bookings
  - [ ] All user bookings listed
  - [ ] Booking details correct
- [ ] Property List shows user's hosted listings
  - [ ] All user-created listings shown
  - [ ] Can edit from this view

### Wishlist
- [ ] Can add listing to wishlist
  - [ ] Heart icon shown on listing card
  - [ ] Clicking heart adds to wishlist
- [ ] Wishlist page shows saved listings
  - [ ] All favorited listings displayed
  - [ ] Can remove from wishlist

---

## Image Loading Checklist

### Static Assets (Client Images)
- [ ] Logo loads in navbar
  - DevTools → Network → search "logo.png"
  - Should show: `http://localhost:8000/assets/logo.png` (200)
- [ ] Category images load
  - Should see: `http://localhost:8000/assets/beach_cat.jpg` (200)
- [ ] Background images load
  - Should see: `http://localhost:8000/assets/slide.jpg` (200)

### Uploaded Images
- [ ] Listing photos display
  - DevTools → Network tab
  - Should see: `http://localhost:8000/uploads/*.jpg` (200)
- [ ] Profile pictures display
  - User profile picture in navbar loads
  - Should see: `http://localhost:8000/uploads/*.jpg` (200)
- [ ] No "broken image" icons (red X)
- [ ] No ImageFromUrl errors in console

### DevTools Network Verification
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page (Ctrl+R)
4. Filter for images (type: img)
5. Verify:
   - [ ] All images have status 200 (green)
   - [ ] No 404s (red)
   - [ ] No CORS errors
   - [ ] URLs match: `http://localhost:8000/...`

---

## Console Errors Checklist

### Open DevTools (F12 → Console)
- [ ] No JavaScript errors (red text)
- [ ] No CORS errors
- [ ] No 404 errors
- [ ] Warnings are acceptable (yellow text)

Common acceptable warnings:
- "Deprecation warnings" for legacy packages
- React development mode notices

---

## Performance Checklist

### Page Load Times
- [ ] Homepage loads within 3 seconds
- [ ] Listing details load within 2 seconds
- [ ] Images load quickly (not stalled)

### No Blank Loader
- [ ] Loader doesn't spin endlessly
- [ ] Content appears after loading

---

## Responsive Design Checklist

### Mobile View (Chrome DevTools → Toggle device toolbar)
- [ ] Logo visible on mobile
- [ ] Navigation works on mobile
- [ ] Listing cards stack vertically
- [ ] Images scale appropriately
- [ ] Forms are usable on mobile

### Desktop View
- [ ] Navbar full-width
- [ ] Listing grid displays 3-4 items per row
- [ ] Modals are centered
- [ ] All text readable

---

## Error Recovery Checklist

### If Server Won't Start
- [ ] Clear any stuck processes: port check above
- [ ] Check .env file exists with correct MongoDB URI
- [ ] Verify MongoDB is running
- [ ] Check Node.js version (v14+)
- [ ] Delete node_modules and reinstall

### If Client Won't Build
- [ ] Clear npm cache: `npm cache clean --force`
- [ ] Delete node_modules
- [ ] Reinstall: `npm install`
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Try different port (Vite auto-selects 5173 or 5174)

### If Images Don't Load
- [ ] Verify server running on port 8000
- [ ] Check DevTools Network tab for 404s
- [ ] Verify files exist in:
  - `server/public/uploads/` (for uploaded images)
  - `client/public/assets/` (for static images)
- [ ] See IMAGE_LOADING_GUIDE.md for detailed help

---

## Security Checklist

### Authentication
- [ ] Passwords hashed (not plain text)
- [ ] JWT tokens used for protected routes
- [ ] Only logged-in users can create listings
- [ ] Only logged-in users can book listings
- [ ] Only list owner can edit listing

### API Protection
- [ ] Create listing requires authentication
- [ ] Edit listing requires ownership
- [ ] Delete operations require authentication
- [ ] Profile update requires correct user ID

---

## Build/Deployment Checklist

### Ready for Development
- [ ] No build errors
- [ ] No console errors
- [ ] All features working locally
- [ ] Images loading correctly

### Ready for Production
Before deploying:
- [ ] Environment variables set for production
- [ ] Database URI points to production MongoDB
- [ ] JWT_SECRET is strong and unique
- [ ] API URL updated in production environment
- [ ] Image serving path verified
- [ ] All secrets removed from code
- [ ] Error tracking enabled (optional)

---

## Final Verification

### Complete Flow Test
1. [ ] Open app in fresh browser tab
2. [ ] Explore homepage
3. [ ] Register new account
4. [ ] Login with account
5. [ ] Upload profile picture
6. [ ] Create a listing with photos
7. [ ] Browse other listings
8. [ ] View listing details
9. [ ] Add listing to wishlist
10. [ ] Visit profile page
11. [ ] Edit listing
12. [ ] View properties list
13. [ ] Logout

### Success Criteria
- [ ] All steps complete without errors
- [ ] All images display correctly
- [ ] No console errors
- [ ] No network errors (all 200 status)
- [ ] Data persists in database
- [ ] UI is responsive and functional

---

## Documentation Reference

| Issue | File |
|-------|------|
| Image not loading? | IMAGE_LOADING_GUIDE.md |
| How images work? | IMAGE_LOADING_IMPROVEMENTS.md |
| Full feature list? | COMPLETE_STATUS.md |
| API reference? | PROJECT_DOCUMENTATION.md |
| What changed? | CHANGELOG_IMAGE_CENTRALIZATION.md |

---

## Support

### Port Issues
```bash
# Find what's using port 8000
Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue

# Kill it
Stop-Process -Id <PID> -Force
```

### Database Issues
```bash
# Test connection
mongo mongodb://localhost:27017/mern-home-rentals
```

### Build Issues
```bash
# Clean install
rm -r server/node_modules client/node_modules
npm install --prefix server
npm install --prefix client
```

---

## Success Indicator

✅ **App is working correctly when:**
- Server shows "Server is running on port 8000"
- Client shows "Local: http://localhost:5173"
- Homepage displays with listings and images
- Can create account and login
- Images load from both static and uploaded sources
- All features from checklist above work

You're all set! 🎉

