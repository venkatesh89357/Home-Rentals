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


// Allow dev client origins (5173/5174) during development
const corsOptions = {
  origin: (origin, cb) => {
    // allow requests with no origin (like curl, Postman) and allow local dev origins
    cb(null, true);
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



