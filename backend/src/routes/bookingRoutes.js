const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const bookingController = require("../controllers/bookingController");

router.post("/book-seat", auth, bookingController.bookSeat);
router.post("/lock-seats", auth, bookingController.lockSeats);
router.post("/release-seats", auth, bookingController.releaseSeats);
router.post("/create-order", auth, bookingController.createOrder);
router.post("/verify-payment", auth, bookingController.verifyPayment);

module.exports = router;

