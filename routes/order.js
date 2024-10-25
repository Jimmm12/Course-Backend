const router = require("express").Router();
const orderControllers = require("../controllers/orderControllers");

router.post("/", orderControllers.createOrder);

module.exports = router;