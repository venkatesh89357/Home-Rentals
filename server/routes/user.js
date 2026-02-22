const router = require("express").Router();

const multer = require("multer");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Listing = require("../models/Listing");
const verifyToken = require("../middleware/auth.js");

/* Multer setup for profile image uploads */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const safeName = file.originalname.replace(/[^a-z0-9.\-\_]/gi, "_");
    cb(null, `${uniqueSuffix}-${safeName}`);
  },
});

const upload = multer({ storage });

// get trip list
router.get("/:userId/trips", async (req, res) => {
  try {
    const { userId } = req.params;

    const trips = await Booking.find({ customerId: userId }).populate(
      "customerId hostId listingId"
    );

    return res.status(200).json(trips);
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Can not find trips!", error: err.message });
  }
});

// Add listing to whistlist
router.patch("/:userId/:listingId", async (req, res) => {
  try {
    const { userId, listingId } = req.params;

    const user = await User.findById(userId);

    const listing = await Listing.findById(listingId).populate("creator");

    const favoriteListing = user.wishList.find(
      (item) => item._id.toString() === listingId
    );

    if (favoriteListing) {
      user.wishList = user.wishList.filter(
        (item) => item._id.toString() !== listingId
      );

      await user.save();

      return res.status(200).json({
        message: "Listing is removed from wish list",
        wishList: user.wishList,
      });
        
    } else {

      user.wishList.push(listing);

      await user.save();
      
      return res.status(200).json({
        message: "Listing is added to wish list",
        wishList: user.wishList,
      });
    }
  } catch (err) {
    return res.status(404).json({ error: err.message });
  }
});

// get property list
router.get("/:userId/properties", async (req, res) => {
  try {
    const { userId } = req.params;

    const properties = await Listing.find({ creator: userId }).populate(
      "creator"
    );

    return res.status(200).json(properties);
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Can not find properties!", error: err.message });
  }
});

// get reservation list
router.get("/:userId/reservations", async (req, res) => {
  try {
    const { userId } = req.params;

    const reservations = await Booking.find({ hostId: userId }).populate(
      "customerId hostId listingId"
    );

    return res.status(200).json(reservations);
  } catch (err) {
    return res
      .status(404)
      .json({ message: "Can not find reservations!", error: err.message });
  }
});

// get user profile
router.get("/:userId/profile", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
});

// update user profile (protected) - allows updating name/email/profile image
router.patch("/:userId", verifyToken, async (req, res) => {
  // run multer manually so we can catch its errors and always return JSON
  upload.single("profileImage")(req, res, async (err) => {
    if (err) {
      console.error('Multer error on profile update:', err);
      return res.status(400).json({ message: 'File upload error', error: err.message });
    }

    try {
      const { userId } = req.params;

      console.log(`Profile update request for user ${userId} by ${req.user && req.user.id}`);
      console.log('Body fields:', req.body);
      console.log('File:', req.file && req.file.path);

      // Only allow user to update own profile
      if (!req.user || req.user.id !== userId) {
        return res.status(403).json({ message: "Forbidden: cannot update other user's profile" });
      }

      const updates = {};
      const { firstName, lastName, email } = req.body;
      if (firstName) updates.firstName = firstName;
      if (lastName) updates.lastName = lastName;
      if (email) updates.email = email;

      if (req.file) {
        updates.profileImagePath = req.file.path;
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

      return res.status(200).json({ message: "Profile updated", user: updatedUser });
    } catch (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ message: "Failed to update profile", error: err.message });
    }
  });
});

module.exports = router;
