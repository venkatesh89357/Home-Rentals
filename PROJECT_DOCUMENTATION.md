Project: MERN Home Rentals
==========================

Overview
--------
This is a full-stack "Home Rentals" application (MERN) with a React + Vite frontend and Node/Express + MongoDB backend. Key features implemented:
- User authentication (JWT)
- Create / Read / Update listing properties (hosts)
- File uploads for listing photos and profile images (multer -> public/uploads)
- Booking creation and reservation listing
- User profile view & update (protected)
- Wishlist (favorite listings)

Repository structure (top-level)
-------------------------------
- client/ — React + Vite frontend
  - public/assets — static assets
  - src/
    - components/ — shared UI components (Navbar, ListingCard, Slide, etc.)
    - pages/ — route pages (HomePage, ListingDetails, CreateListing, EditListing, ProfilePage, PropertyList, etc.)
    - redux/ — simple redux store & state slice
    - styles/ — SCSS styles
- server/ — Express backend
  - models/ — Mongoose models (User, Listing, Booking)
  - routes/ — API routes (auth.js, listing.js, booking.js, user.js)
  - public/uploads — uploaded files (images)
  - server.js — app entry

Tech stack
----------
- Frontend: React (Vite), SCSS, React Router, Redux
- Backend: Node.js, Express, Mongoose (MongoDB Atlas)
- Uploads: multer (disk storage) saving to `server/public/uploads`
- Auth: JWT tokens via `middleware/auth.js`

Quick setup (dev)
-----------------
1. Install dependencies
   - Server: open a terminal at `server/` and run:
     ```powershell
     cd d:\MERN-Home-Rentals\server
     npm install
     ```
   - Client: open a terminal at `client/` and run:
     ```powershell
     cd d:\MERN-Home-Rentals\client
     npm install
     ```

2. Environment variables (server)
   - Create `.env` in `server/` with at least:
     ```text
     MONGO_URL=<your-mongodb-connection-string>
     PORT=8000
     JWT_SECRET_KEY=<your-secret>
     CLIENT_URL=http://localhost:5173
     ```

3. Start servers (separate terminals)
   - Start server:
     ```powershell
     cd d:\MERN-Home-Rentals\server
     node server.js
     ```
     If you encounter `EADDRINUSE` for port 8000, kill the process using that port and retry.

   - Start client (Vite):
     ```powershell
     cd d:\MERN-Home-Rentals\client
     npm run dev
     ```
     Vite may use 5173 or fall back to 5174 if 5173 is in use. Use the URL shown by Vite (e.g., `http://localhost:5174`).

API Reference (important routes)
--------------------------------
Base: `http://localhost:8000`

- Auth
  - POST `/auth/register` — register a user
  - POST `/auth/login` — login, returns JWT token

- Listings (properties)
  - POST `/properties/create` — create listing (protected)
    - multipart form-data: `listingPhotos` (multiple), plus text fields (title, description, amenities, price, etc.)
  - GET `/properties` — list all
  - GET `/properties?category=Beachfront` — filter by category
  - GET `/properties/search/:search` — search
  - GET `/properties/:listingId` — get listing details
  - PATCH `/properties/:listingId` — update listing (host only)
    - multipart form-data: `listingPhotos` (new ones), text fields for updates; `removedPhotos` (JSON array of server paths to remove)

- Users
  - GET `/users/:userId/profile` — get user profile
  - PATCH `/users/:userId` — update profile (protected)
    - multipart form-data: `profileImage` (optional) plus firstName, lastName, email
  - GET `/users/:userId/properties` — host's properties (used by PropertyList page)
  - Additional routes: trips, reservations, wishlist (see `server/routes/user.js`)

Bookings
- POST `/bookings/create` — create a booking (protected); body contains customerId, listingId, hostId, start/end dates and total price

Notes about uploads & paths
---------------------------
- Multer stores files to `server/public/uploads` and the server serves static files from `server/public`.
- On Windows the stored `path` may include backslashes (e.g., `public\uploads\file.jpg`). The client normalizes those strings when building `http://localhost:8000/...` URLs by stripping `public/` and replacing backslashes with forward slashes.
- If images don't show, confirm the file exists in `server/public/uploads` and check the constructed URL in browser devtools.

Client routes & important pages
-------------------------------
- `/` — HomePage
- `/properties/:listingId` — `ListingDetails` (loads listing by id)
- `/properties/:listingId/edit` — `EditListing` (host-only UI to update listing)
- `/create-listing` — create new listing
- `/profile` — logged-in user's profile page (view + update)
- `/:userId/properties` — PropertyList (host's properties)

Recent fixes & features added (summary)
--------------------------------------
- Fixed cross-origin issues by relaxing CORS for local dev.
- Normalized Windows backslash paths on the client when building image URLs.
- Implemented `PATCH /properties/:listingId` to allow hosts to update fields, append photos, and remove existing photos (ownership enforced).
- Implemented `PATCH /users/:userId` to update profile and upload `profileImage` (ownership enforced).
- Created `EditListing.jsx` page and wired route `/properties/:listingId/edit`.
- Improved CreateListing preview, drag-and-drop reordering, multiple-photo handling.
- Added a visible "Home" button in the `Navbar`.
- Migrated SCSS `map-get` usage to `map.get()` and converted `@import` to `@use` (as * to preserve variables) to reduce Sass deprecation warnings.

Testing flows to verify (manual)
--------------------------------
1. Profile update
   - Log in (obtain JWT in client state), go to `/profile`, change name and upload a new profile image, click Update. Server should log the request and return updated user JSON. Navbar profile image should update after refresh (or when client state is updated).

2. Create listing
   - Go to `/create-listing`, fill fields, upload multiple photos, submit. Server should save listing and files under `server/public/uploads`. New listing should appear in listing pages.

3. Edit listing (host)
   - From PropertyList, click Edit for a listing you own. Remove an existing photo, add new photos, change price, submit. Server responds with updated listing; check that deleted files were removed (best-effort) and listing document updated.

Debugging tips & common issues
-----------------------------
- "Failed to fetch" or blank loader in ListingDetails: usually server unreachable (server not running or port conflict) or CORS blocked. Ensure server is running on port 8000 and client is using the correct Vite URL.
- EADDRINUSE: use `netstat -ano | findstr :8000` and `taskkill /PID <pid> /F` to free port 8000 before restarting server.
- Sass warnings: deprecation warnings for `@import` and legacy JS API were addressed partially — full migration to `@use` with namespacing is recommended long-term.
- If images are broken, open browser devtools → Network and verify the actual image request URL and server response (404 or 200). If path contains `public\uploads\...`, ensure client normalizes slashes.

Known limitations / To do
------------------------
- Improve server-side validation for file types and max file sizes.
- Replace `@use ... as *` with proper namespaced `@use` and refactor SCSS to remove global `as *` usage.
- Add tests (unit/integration) for critical routes.
- Add progress UI for uploads and better UX feedback (toasts) instead of `alert()`.

File to review for quick changes
--------------------------------
- `server/routes/listing.js` — create and update listing handlers
- `server/routes/user.js` — profile get/update handlers
- `client/src/pages/CreateListing.jsx` — multi-photo handling and preview
- `client/src/pages/EditListing.jsx` — edit flow
- `client/src/pages/ListingDetails.jsx` — details rendering and amenities handling
- `client/src/components/Navbar.jsx` — Home button & profile image

Where I saved this document
---------------------------
Project root: `d:/MERN-Home-Rentals/PROJECT_DOCUMENTATION.md`

If you want I can:
- commit these changes and create a small CHANGELOG.md entry.
- fully namespace SCSS `@use` imports and refactor variable usages.
- generate a shorter README.md for repo root and keep this long doc in `docs/`.

Which of the above would you like next? (commit, namespace SCSS, add CHANGELOG, or generate smaller README)
