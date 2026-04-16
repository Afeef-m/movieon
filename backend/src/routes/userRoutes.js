const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");

// CREATE USER (REGISTER)
router.post("/", async (req, res) => {
  try {
    const { email, password, firstName } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// get all users
router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

module.exports = router;