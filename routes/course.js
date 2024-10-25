
const courseControllers = require("../controllers/courseControllers");
const authMiddleware = require("../Middleware/authMiddleware");

const router = require("express").Router();

// CREATE COURSE
router.post('/', courseControllers.createCourse);

// GET ALL COURSE
router.get('/', courseControllers.getAllCourse);

//GET A COURSE
router.get('/:id', courseControllers.getACourse);

// UPDATE A COURSE 
router.put('/:id', courseControllers.updateCourse);

// DELETE A COURSE 
router.delete('/:id', courseControllers.deleteCourse);


module.exports = router;
