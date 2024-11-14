
const courseControllers = require("../controllers/courseControllers");
const authMiddleware = require("../Middleware/authMiddleware");


const router = require("express").Router();

// CREATE COURSE
router.post('/', courseControllers.createCourse);

// GET ALL COURSE
router.get('/', courseControllers.getAllCourse);

//GET A COURSE
router.get('/:id', courseControllers.getACourse);

//GET A COURSE FOR USER
router.get('/user/:id',authMiddleware, courseControllers.getACourseUser);


// UPDATE A COURSE 
router.put('/:id',authMiddleware, courseControllers.updateCourse);

// DELETE A COURSE 
router.delete('/:id',authMiddleware, courseControllers.deleteCourse);


module.exports = router;
