const crypto = require("crypto");
const Booking = require("../models/Booking");
const bookingService = require("./bookingService");

exports.verifyPayment = async (req) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    showId,
    seats
  } = req.body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    throw new Error("Invalid payment data");
  }

  if (!showId || !seats || seats.length === 0) {
    throw new Error("Invalid input");
  }

  const sign = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign)
    .digest("hex");

  if (expectedSign !== razorpay_signature) {
    throw new Error("Invalid payment");
  }

  // prevent duplicate
  const existing = await Booking.findOne({
    paymentId: razorpay_payment_id
  });

  if (existing) {
    return { message: "Already processed", booking: existing };
  }

  // reuse booking logic
  const booking = await bookingService.bookSeat(req);

  booking.paymentId = razorpay_payment_id;
  await booking.save();

  return {
    message: "Payment verified",
    booking
  };
};