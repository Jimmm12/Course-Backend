const { User } = require("../models/index");
const bcrypt = require("bcrypt");

const userControllers = {
  // GET ALL USERS INFOR
  getAllUserInfor: async (req, res) => {
    try {
      const user = await User.find();
      res.status(200).json(user);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },
  // GET A USERS INFOR
  getAUserInfor: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      res.status(200).json(user);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },

  // UPDATE USER
  updateUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "User not found", success: error, status: "error", });
      }
      // Update password
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
      await user.updateOne({ $set: req.body });
      res.status(200).json({
        user,
        message: "Cập Nhập Thành Công!",
        success: true,
        status: "success",
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message, status: "error" });
    }
  },
  // Get Enroll
  getEnrolledCourses: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).populate(
        "courses_enrolled.course_id"
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },
};

module.exports = userControllers;
