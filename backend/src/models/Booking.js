const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  showId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Show",
  },

  seats: [String],

  totalAmount: Number,

  status: {
    type: String,
    enum: ["BOOKED", "CANCELLED"],
    default: "BOOKED",
  },

  paymentId: String,
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);