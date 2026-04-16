const mongoose = require("mongoose");

const castSchema = new mongoose.Schema({
  actor: String,
  character: String,
  picture: String,
});

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,
    director: String,

    genre: [String],

    language: String,

    duration: {
      type: Number, // minutes
    },

    releaseDate: {
      type: Date,
    },

    rating: {
      type: Number,
      min: 0,
      max: 10,
    },

    poster: String,
    banner: String,
    trailer: String,

    status: {
      type: String,
      enum: ["NOW_SHOWING", "UPCOMING"],
      default: "UPCOMING",
    },

    ticketPrice: Number,

    cast: [castSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);