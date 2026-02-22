const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();

const port = process.env.PORT || 8000;

const connectDB = require("./database/db.js");

const authRoutes = require("./routes/auth.js")
const listingRoutes = require("./routes/listing.js")
const bookingRoutes = require("./routes/booking.js")
const userRoutes = require("./routes/user.js")


// CORS configuration for production
const corsOptions = {
  origin: (origin, cb) => {
    // Allow requests from Vercel, localhost (dev), and requests with no origin
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'https://vercel.app',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:3000'
    ];
    
    // Allow requests from any origin in development, or from allowed origins in production
    if (!origin || allowedOrigins.some(allowed => origin.includes(allowed)) || process.env.NODE_ENV !== 'production') {
      cb(null, true);
    } else {
      cb(null, true); // For now, allow all CORS in production. Update allowedOrigins to be more restrictive if needed.
    }
  },
  methods: "GET, POST, PUT, DELETE, PATCH, HEAD",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

/* Root route */
app.get("/", (req, res) => {
  res.status(200).json({ message: "MERN Home Rentals API is running" });
});

/* routes */
app.use("/auth", authRoutes)
app.use("/properties", listingRoutes)
app.use("/bookings", bookingRoutes)
app.use("/users", userRoutes)

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});



