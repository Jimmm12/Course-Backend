const { Course } = require("../models/index");

const courseControllers = {
  // CREATE A COURSE
  createCourse: async (req, res) => {
    try {
      const newCourse = new Course(req.body);
      const saveCoruse = await newCourse.save();
      res.status(200).json({
        saveCoruse,
        message: "Create course successfully!",
        success: true,
      });
    } catch (err) {
      return res
      .status(500)
      .json({ message: "Server error", error: err.message });
    }
  },

  // GET ALL COURSE
  getAllCourse: async (req, res) => {
    try {
      const allCourse = await Course.find();
      res.status(200).json(allCourse);
    } catch (err) {
      return res
      .status(500)
      .json({ message: "Server error", error: err.message });
    }
  },

  //GET A COURSE
  getACourse: async (req, res) => {
    try {
      const aCourse = await Course.findById(req.params.id);
      if (!aCourse) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json(aCourse);
    } catch (err) {
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  //GET A COURSE FOR User
  getACourseUser: async (req, res) => {
    try {
      const aCourse = await Course.findById(req.params.id);
      if (!aCourse) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.status(200).json(aCourse);
    } catch (err) {
      return res.status(500).json({ message: "Server error", error: err.message });
    }
  },

  // UPDATE A COURSE
  updateCourse: async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      await course.updateOne({ $set: req.body });
      res.status(200).json({
        course,
        message: "Update sccussefully!",
        success: true,
      });
    } catch (err) {
      return res
      .status(500)
      .json({ message: "Server error", error: err.message });
    }
  },

  // DELETE A COURSE
  deleteCourse: async (req, res) => {
    try {
      await Course.findByIdAndDelete(req.params.id);
      res.status(200).json({ message: "Delete Successfully! ", success: true });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },
};

module.exports = courseControllers;
