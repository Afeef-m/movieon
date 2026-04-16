const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Movie",
  },

  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theater",
  },

  screenId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Screen",
  },

  showDate: {
    type: Date,
  },

  showTime: String,

  price: Number,

  bookedSeats: [String],   // ["A1", "A2"]
  lockedSeats: [String],   // temp lock before payment
});

module.exports = mongoose.model("Show", showSchema);