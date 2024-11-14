const router = require("express").Router();
const orderControllers = require("../controllers/orderControllers");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/payment",authMiddleware, orderControllers.createOrder);

module.exports = router;