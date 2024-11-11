const router = require("express").Router();
const userControllers = require("../controllers/userControllers");
const authMiddleware = require("../Middleware/authMiddleware")
// Get All User Infor
router.get("/",authMiddleware, userControllers.getAllUserInfor);

// Get A user Infor 
router.get("/:id",authMiddleware, userControllers.getAUserInfor);

// Update user 
router.put("/update/:id",authMiddleware, userControllers.updateUser);

// Get Enroll
router.get("/:id/courses", authMiddleware, userControllers.getEnrolledCourses);




module.exports = router