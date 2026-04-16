const express = require("express");
const router = express.Router();

const Screen = require("../models/Screen");

// CREATE screen
router.post("/", async (req, res) => {
  try {
    const screen = await Screen.create(req.body);
    res.json(screen);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET screens
router.get("/", async (req, res) => {
  const screens = await Screen.find().populate("theaterId");
  res.json(screens);
});

module.exports = router;