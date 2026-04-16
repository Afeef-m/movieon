const paymentService = require("../services/paymentService");

exports.createOrder = async (req, res) => {
  try {
    const result = await paymentService.createOrder(req);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const result = await paymentService.verifyPayment(req);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};