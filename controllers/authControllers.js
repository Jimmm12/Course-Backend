const { User } = require("../models/index");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authControllers = {
  //REGISTER
  registerUser: async (req, res) => {
    try {
      // Kiểm tra người dùng đã tồn tại
      const existingUser = await User.findOne({ username: req.body.username });
      if (existingUser) {
        return res.status(400).json({
          message: "Tên người dùng đã tồn tại. Vui lòng chọn tên khác.",
          success: false,
          status: "error",
        });
      }

      // Tạo mật khẩu đã băm
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      // Tạo người dùng mới
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword,
      });

      // Lưu người dùng vào cơ sở dữ liệu
      const savedUser = await newUser.save();
      res.status(200).json({
        message: "Đăng Ký Thành Công ",
        data: savedUser,
        success: true,
        status: "success",
      });
    } catch (err) {
      console.error(err); // Log lỗi ra để dễ dàng debug hơn
      return res
        .status(500)
        .json({
          message: "Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau ",
          error: err.message,
          status: "error",
        });
    }
  },

  //LOGIN
  loginUser: async (req, res) => {
    try {
      const user = await User.findOne({ username: req.body.username });
      if (!user) {
        return res.status(404).json({
          message: "Không tìm thấy User",
          status: "error",
        });
      }
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword) {
        return res
          .status(404)
          .json({ message: "Kiểm Tra Mật Khẩu", status: "error" });
      }
      // Tạo JWT token (sử dụng user ID)

      if (user && validPassword) {
        const accessToken = jwt.sign(
          {
            id: user.id,
          },
          process.env.JWT_SECRER_KEY,
          { expiresIn: "1h" }
        );
        const refreshToken = jwt.sign(
          {
            id: user.id,
          },
          process.env.JWT_REFRESHTOKEN_KEY,
          { expiresIn: "365d" }
        );
        res.cookie("refreshToken", refreshToken, {
          httpOnly: false,
          secure: false,
          path: "/",
          sameSite: "strict",
        });
        const { password, ...others } = user._doc;
        return res.status(200).json({
          ...others,
          accessToken,
          status: "success",
          message: "Đăng Nhập Thành Công ",
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        message: "Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại sau.",
        error: err.message,
        status: "error",
      });
    }
  },
  logoutUser: async (req, res) => {
    try {
      const cookieOption = {
        http: true,
        secure: true,
      };
      return res.cookie("token", "", cookieOption).status(200).json({
        message: "session out",
        success: true,
      });
    } catch (error) {
      return res.status(500).json({
        message: error.message || error,
        error: true,
      });
    }
  },
  
};

module.exports = authControllers;
