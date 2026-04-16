const express = require("express");
const router = express.Router();

const Show = require("../models/Show");

// CREATE show
router.post("/", async (req, res) => {
  try {
    const show = await Show.create(req.body);
    res.json(show);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET all shows
router.get("/", async (req, res) => {
  const shows = await Show.find()
    .populate("movieId")
    .populate("theaterId")
    .populate("screenId");

  res.json(shows);
});

module.exports = router;