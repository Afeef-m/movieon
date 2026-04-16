const Show = require("../models/Show");
const Booking = require("../models/Booking");

const razorpay = require("../config/razorpay");
const crypto = require("crypto");

exports.bookSeat = async (req) => {
  const { showId, seats } = req.body;
  const userId = req.user.id;

  if (!showId || !seats || seats.length === 0) {
  throw new Error("Invalid input");
}

  const show = await Show.findById(showId);
  if (!show) throw new Error("Show not found");

  const isUnavailable = seats.some(
  seat => show.bookedSeats.includes(seat) || show.lockedSeats.includes(seat)
);

if (isUnavailable) {
  throw new Error("Seats already booked or locked");
}

  const updatedShow = await Show.findOneAndUpdate(
    {
      _id: showId,
      bookedSeats: { $nin: seats },
      lockedSeats: { $nin: seats }
    },
    {
      $push: { bookedSeats: { $each: seats } }
    },
    { new: true }
  );

  if (!updatedShow) throw new Error("Seat already booked");

  await Show.findByIdAndUpdate(showId, {
    $pull: { lockedSeats: { $in: seats } }
  });

  const booking = await Booking.create({
    userId,
    showId,
    seats,
    totalAmount: seats.length * updatedShow.price
  });

  return booking;
};

exports.lockSeats = async (req) => {
  const { showId, seats } = req.body;

  if (!showId || !seats || seats.length === 0) {
  throw new Error("Invalid input");
}

  const updatedShow = await Show.findOneAndUpdate(
    {
      _id: showId,
      bookedSeats: { $nin: seats },
      lockedSeats: { $nin: seats }
    },
    {
      $push: { lockedSeats: { $each: seats } }
    },
    { new: true }
  );

  setTimeout(async () => {
  await Show.findByIdAndUpdate(showId, {
    $pull: { lockedSeats: { $in: seats } }
  });
}, 5 * 60 * 1000);

  if (!updatedShow) throw new Error("Seats already booked or locked");

  return { message: "Seats locked" };
};

exports.releaseSeats = async (req) => {
  const { showId, seats } = req.body;

  if (!showId || !seats || seats.length === 0) {
  throw new Error("Invalid input");
}

  await Show.findByIdAndUpdate(showId, {
    $pull: { lockedSeats: { $in: seats } }
  });

  return { message: "Seats released" };
};


exports.createOrder = async (req) => {
  const { showId, seats } = req.body;

  if (!showId || !seats || seats.length === 0) {
  throw new Error("Invalid input");
}

  const show = await Show.findById(showId); 
  if (!show) throw new Error("Show not found");

  const isUnavailable = seats.some(
  seat => show.bookedSeats.includes(seat) || show.lockedSeats.includes(seat)
);

if (isUnavailable) {
  throw new Error("Seats already booked or locked");
}

  const amount = seats.length * show.price * 100;

  const order = await razorpay.orders.create({
    amount,
    currency: "INR",
    receipt: `rcpt_${Date.now()}`
  });

  return {
    orderId: order.id,
    amount: order.amount
  };
};


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

  const existingBooking = await Booking.findOne({
    paymentId: razorpay_payment_id
  });

  if (existingBooking) {
    return { message: "Already processed", booking: existingBooking };
  }

  const updatedShow = await Show.findOneAndUpdate(
    {
      _id: showId,
      bookedSeats: { $nin: seats },
      lockedSeats: { $nin: seats }
    },
    {
      $push: { bookedSeats: { $each: seats } }
    },
    { new: true }
  );

  if (!updatedShow) throw new Error("Seats already booked");

  await Show.findByIdAndUpdate(showId, {
    $pull: { lockedSeats: { $in: seats } }
  });

  const booking = await Booking.create({
    userId: req.user.id,
    showId,
    seats,
    totalAmount: seats.length * updatedShow.price,
    paymentId: razorpay_payment_id
  });

  return { message: "Payment verified", booking };
};
