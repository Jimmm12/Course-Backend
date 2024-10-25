const { Order, User, Course } = require("../models/index");

const orderControllers = {
  // Create Order
  createOrder: async (req, res) => {
    try {
      const { user_id, courses, total_price, payment_status } = req.body;

      // Tạo một đơn hàng mới
      const newOrder = new Order({
        user_id,
        courses: courses.map((course) => ({
          course_id: course.course_id,
          price: course.price,
        })),
        total_price,
        payment_status,
        order_date: new Date(),
      });

      // Lưu đơn hàng
      const savedOrder = await newOrder.save();

      // Tự động enroll khóa học
      const user = await User.findById(user_id);
      const enrolledCourses = [];
      if (user) {
        for (const course of courses) {
          const courseDetails = await Course.findById(course.course_id);
          if (
            courseDetails &&
            !user.courses_enrolled.some(
              (c) => c.course_id.toString() === course.course_id
            )
          ) {
            user.courses_enrolled.push({ course_id: course.course_id });
            enrolledCourses.push(courseDetails); // Lưu thông tin khóa học đã enroll
          }
        }
        await user.save();
      }

      // Populate thông tin người dùng (chỉ lấy tên và email)
      const populatedOrder = await Order.findById(savedOrder._id)
        .populate({
          path: "user_id",
          select: "username email", // Chỉ lấy tên và email
        })
        .populate({
          path: "courses.course_id",
          select:
            "title description price instructor duration rating students_enrolled videoId", // Chỉ lấy các trường cần thiết
        })
        .exec();

      // Thêm thông tin khóa học đã enroll vào phản hồi
      const orderResponse = {
        ...populatedOrder.toObject(), // Chuyển đổi thành đối tượng JavaScript
        enrolledCourses: enrolledCourses, // Thêm khóa học đã enroll
      };

      res.status(200).json({
        order: orderResponse,
        message: "Create order and enroll successfully!",
        success: true,
      });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  },
};
module.exports = orderControllers;
