const mongoose = require("mongoose");

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: String,

  facilities: [String], // IMAX, 4K

  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Theater", theaterSchema);