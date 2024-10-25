const authControllers = require("../controllers/authControllers");
const authMiddleware = require("../Middleware/authMiddleware");

const router = require("express").Router();

// register
router.post("/register", authControllers.registerUser);

// login
router.post("/login", authControllers.loginUser);

router.post('/logout', authMiddleware, authControllers.logoutUser);

module.exports = router;
