const router = require("express").Router()

const Booking = require("../models/Booking")
const verifyToken = require("../middleware/auth.js")

// create booking
router.post("/create", verifyToken, async (req, res) => {

  try {

    const { customerId, hostId, listingId, startDate, endDate, totalPrice } = req.body

    const newBooking = new Booking({ customerId, hostId, listingId, startDate, endDate, totalPrice })

    await newBooking.save();

    return res.status(201).json(newBooking);

  } catch (err) {
    return res.status(400).json({ message: "Fail to create a new Booking!", error: err.message });
  }
})

module.exports = router