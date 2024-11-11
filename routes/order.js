const router = require("express").Router();
const orderControllers = require("../controllers/orderControllers");
const authMiddleware = require("../Middleware/authMiddleware");

router.post("/",authMiddleware, orderControllers.createOrder);

module.exports = router;