const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    phone: String,
    age: Number,
    place: String,
    profileImage: String,

    // only for manager
    theaterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theater",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);