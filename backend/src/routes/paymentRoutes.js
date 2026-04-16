const express = require("express");
const router = express.Router();

const auth = require("../middleware/authMiddleware");
const paymentController = require("../controllers/paymentController");

router.post("/create-order", auth, paymentController.createOrder);
router.post("/verify-payment", auth, paymentController.verifyPayment);

module.exports = router;