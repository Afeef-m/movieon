const mongoose = require("mongoose");

const screenSchema = new mongoose.Schema({
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Theater",
  },

  screenNumber: Number,

  totalSeats: Number,

  layout: {
    rows: Number,
    cols: Number,
  },
});

module.exports = mongoose.model("Screen", screenSchema);