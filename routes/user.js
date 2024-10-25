const router = require("express").Router();
const userControllers = require("../controllers/userControllers");

// Get All User Infor
router.get("/", userControllers.getAllUserInfor);

// Get A user Infor 
router.get("/:id", userControllers.getAUserInfor);

// Update user 
router.put("/:id", userControllers.updateUser);

// Get Enroll
router.get("/:id/courses", userControllers.getEnrolledCourses);




module.exports = router