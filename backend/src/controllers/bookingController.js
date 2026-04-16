const bookingService = require("../services/bookingService");

exports.bookSeat = async (req, res) => {
  try {
    const result = await bookingService.bookSeat(req);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.lockSeats = async (req, res) => {
  try {
    const result = await bookingService.lockSeats(req);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.releaseSeats = async (req, res) => {
  try {
    const result = await bookingService.releaseSeats(req);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const result = await bookingService.createOrder(req);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const result = await bookingService.verifyPayment(req);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}