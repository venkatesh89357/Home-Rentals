const express = require("express")
const router = express.Router();
const multer = require("multer");

const Listing = require("../models/Listing.js");
const verifyToken = require("../middleware/auth.js");

/* Configuration Multer for File Upload */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/"); // Store uploaded files in the 'uploads' folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

// update listing (host only) - supports updating fields, appending new photos, and removing existing photos
router.patch("/:listingId", verifyToken, async (req, res) => {
  // run multer manually to capture errors
  upload.array("listingPhotos")(req, res, async (err) => {
    if (err) {
      console.error('Multer error on listing update:', err);
      return res.status(400).json({ message: 'File upload error', error: err.message });
    }

    try {
      const { listingId } = req.params;
      const listing = await Listing.findById(listingId);
      if (!listing) return res.status(404).json({ message: 'Listing not found' });

      // only creator can update
      if (!req.user || listing.creator.toString() !== req.user.id) {
        return res.status(403).json({ message: 'Forbidden: cannot update this listing' });
      }

      console.log('Update listing request for', listingId, 'by', req.user.id);

      const updates = {};
      const {
        category,
        type,
        streetAddress,
        aptSuite,
        city,
        province,
        country,
        guestCount,
        bedroomCount,
        bedCount,
        bathroomCount,
        amenities,
        title,
        description,
        highlight,
        highlightDesc,
        price,
        removedPhotos,
      } = req.body;

      if (category) updates.category = category;
      if (type) updates.type = type;
      if (streetAddress) updates.streetAddress = streetAddress;
      if (aptSuite) updates.aptSuite = aptSuite;
      if (city) updates.city = city;
      if (province) updates.province = province;
      if (country) updates.country = country;
      if (guestCount) updates.guestCount = Number(guestCount);
      if (bedroomCount) updates.bedroomCount = Number(bedroomCount);
      if (bedCount) updates.bedCount = Number(bedCount);
      if (bathroomCount) updates.bathroomCount = Number(bathroomCount);
      if (title) updates.title = title;
      if (description) updates.description = description;
      if (highlight) updates.highlight = highlight;
      if (highlightDesc) updates.highlightDesc = highlightDesc;
      if (price) updates.price = Number(price);

      // handle amenities (array or JSON string)
      if (amenities) {
        try {
          updates.amenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
        } catch (e) {
          updates.amenities = amenities;
        }
      }

      // handle removed photos list
      let removed = [];
      if (removedPhotos) {
        try {
          removed = typeof removedPhotos === 'string' ? JSON.parse(removedPhotos) : removedPhotos;
        } catch (e) {
          removed = [];
        }
      }

      // append new uploaded photos
      if (req.files && req.files.length > 0) {
        const newPaths = req.files.map((f) => f.path);
        listing.listingPhotoPaths = listing.listingPhotoPaths.concat(newPaths);
      }

      // remove any requested photos
      if (Array.isArray(removed) && removed.length > 0) {
        const fs = require('fs');
        listing.listingPhotoPaths = listing.listingPhotoPaths.filter((p) => {
          const keep = !removed.includes(p);
          if (!keep) {
            // try to unlink file (best-effort)
            try {
              fs.unlink(p, (err) => {
                if (err) console.warn('Failed to delete image file', p, err.message);
              });
            } catch (e) {
              console.warn('Error deleting file', p, e.message);
            }
          }
          return keep;
        });
      }

      // apply field updates
      Object.keys(updates).forEach((k) => {
        listing[k] = updates[k];
      });

      await listing.save();

      return res.status(200).json({ message: 'Listing updated', listing });
    } catch (err) {
      console.error('Error updating listing:', err);
      return res.status(500).json({ message: 'Failed to update listing', error: err.message });
    }
  });
});

const upload = multer({ storage });

// create listing
router.post("/create", verifyToken, upload.array("listingPhotos"), async (req, res) => {
  try {
    console.log("Create Listing Request Received");
    console.log("Files:", req.files ? req.files.length : "No files");
    console.log("Body Fields:", Object.keys(req.body));

    const {
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount,
      bedroomCount,
      bedCount,
      bathroomCount,
      amenities,
      title,
      description,
      highlight,
      highlightDesc,
      price,
    } = req.body;

    // Validate required fields
    if (!category || !type || !title || !description || !price) {
      console.log("Missing required fields");
      return res.status(400).json({ message: "Missing required fields!" });
    }

    const listingPhotos = req.files

    if (!listingPhotos || listingPhotos.length === 0) {
      console.log("No photos provided");
      return res.status(400).json({ message: "At least one photo is required!" });
    }

    console.log("Photos received:", listingPhotos.length);
    const listingPhotoPaths = listingPhotos.map(file => file.path);

    // Parse amenities from JSON string if needed
    let parsedAmenities = [];
    if (amenities) {
      try {
        parsedAmenities = typeof amenities === 'string' ? JSON.parse(amenities) : amenities;
      } catch (e) {
        console.log("Error parsing amenities:", e.message);
        parsedAmenities = amenities;
      }
    }

    const newListing = new Listing({
      creator,
      category,
      type,
      streetAddress,
      aptSuite,
      city,
      province,
      country,
      guestCount: Number(guestCount),
      bedroomCount: Number(bedroomCount),
      bedCount: Number(bedCount),
      bathroomCount: Number(bathroomCount),
      amenities: parsedAmenities,
      listingPhotoPaths,
      title,
      description,
      highlight,
      highlightDesc,
      price: Number(price),
    })

    await newListing.save();
    console.log("Listing saved successfully");

    return res.status(201).json(newListing);
  } catch (err) {
    console.log("Error creating listing:", err.message);
    console.log("Error stack:", err);
    return res.status(409).json({ message: "Fail to create Listing", error: err.message })
  }
});


// get listing by categories
router.get("/", async (req, res) => {
  const qCategory = req.query.category

  try {
    let listings
    if (qCategory) {
      listings = await Listing.find({ category: qCategory }).populate("creator")
    } else {
      listings = await Listing.find().populate("creator")
    }

    return res.status(200).json(listings)
  } catch (err) {
    return res.status(404).json({ message: "Fail to fetch listings", error: err.message })
  }
})

// get listing by search
router.get("/search/:search", async (req, res) => {
  const { search } = req.params;

  try {
    let listings = []

    if (search === "all") {

      listings = await Listing.find().populate("creator");

    } else {

      listings = await Listing.find({
        $or: [
          { category: { $regex: search, $options: "i" } },
          { title: { $regex: search, $options: "i" } },
        ]
      }).populate("creator");

    }

    return res.status(200).json(listings);
    
  } catch (err) {
    return res.status(404).json({ message: "Fail to fetch listings", error: err.message })
  }
})

/* LISTING DETAILS */
router.get("/:listingId", async (req, res) => {

  try {

    const { listingId } = req.params;

    const listing = await Listing.findById(listingId).populate("creator");

    return res.status(200).json(listing)
  } catch (err) {
    return res.status(404).json({ message: "Listing can not found!", error: err.message })
  }
})

module.exports = router;
