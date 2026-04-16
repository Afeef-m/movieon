const express = require("express");
const router = express.Router();

const Theater = require("../models/Theater");

// CREATE theater
router.post("/", async (req, res) => {
  try {
    const theater = await Theater.create(req.body);
    res.json(theater);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all theaters
router.get("/", async (req, res) => {
  const theaters = await Theater.find();
  res.json(theaters);
});

module.exports = router;