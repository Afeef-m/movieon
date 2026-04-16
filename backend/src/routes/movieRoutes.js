const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");

// create movie
router.post("/", async (req, res) => {
  try {
    const movie = await Movie.create(req.body);
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// get all movies
router.get("/", async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;