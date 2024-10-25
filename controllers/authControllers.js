const { User } = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authControllers = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(req.body.password, salt);

      // Create new user
      const newUser = await new User({
        username: req.body.username,
        email: req.body.email,
        password: hashed,
      });
      console.log(newUser);
      //Save to DB
      const user = await newUser.save();
      console.log(user);
      res.status(200).json({
        message: "User created successfully",
        data: user,
        sucess: true,
      });
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        res.status(404).json({
          message: "Not Found Username",
        });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        res.status(404).json({ message: "Check Password" });
      }
      // Tạo JWT token (sử dụng user ID)
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRER_KEY, {
        expiresIn: "1h",
      });
      if (user && validPassword) {
        res.status(200).json({
          token,
          message: "Login Successfully",
        });
      }
    } catch (err) {
      return res
        .status(500)
        .json({ message: "Server error", error: err.message });
    }
  },
  logoutUser: async (req, res) => {
    res.status(200).json({
      message: "Logout successful",
      success: true,
    });
  },
};

module.exports = authControllers;
