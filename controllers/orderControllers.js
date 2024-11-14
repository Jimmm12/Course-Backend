const nodemailer = require("nodemailer");
const { Order, User, Course } = require("../models/index");


const orderControllers = {
  createOrder: async (req, res) => {
    try {
      const user_id = req.user.id;
      const { courses, total_price, payment_method } = req.body;

      if (!courses || courses.length === 0) {
        return res.status(400).json({ message: "No courses selected" });
      }

      // Step 1: Create a new order in the database
      const newOrder = new Order({
        user_id,
        courses: courses.map((course) => ({
          course_id: course.course_id,
          price: course.price,
        })),
        total_price,
        payment_method,
        order_date: new Date(),
      });

      // Save the order
      const savedOrder = await newOrder.save();

      // Step 2: Enroll the user in the purchased courses
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
            user.courses_enrolled.push({
              course_id: course.course_id,
              title: courseDetails.title,
              instructor: courseDetails.instructor,
              duration: courseDetails.duration,
            });
            enrolledCourses.push(courseDetails);
          }
        }
        await user.save();
      }

      // Step 3: Populate order with detailed user and course info
      const populatedOrder = await Order.findById(savedOrder._id)
        .populate({
          path: "user_id",
          select: "username email",
        })
        .populate({
          path: "courses.course_id",
          select: "title description price instructor duration rating students_enrolled videoId",
        })
        .exec();

      const orderResponse = {
        ...populatedOrder.toObject(),
        enrolledCourses: enrolledCourses,
      };

      // Step 4: Send an email to the user notifying them of the successful order and course enrollment
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USERNAME, // Your email
          pass: process.env.EMAIL_PASSWORD, // Your email password
        },
      });

      const mailOptions = {
        from: "huytranhd22@gmail.com", // Sender address
        to: user.email, // Receiver address
        subject: "Order Confirmation and Enrollment", // Email subject
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #f4f7fc; padding: 20px;">
            <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
              <h2 style="text-align: center; color: #4CAF50;">Đơn Hàng Thành Công!</h2>
              <p style="font-size: 16px; color: #333;">Chào bạn <strong>${user.username}</strong>,</p>
              <p style="font-size: 16px; color: #333;">Đơn hàng của bạn đã được tạo thành công! Bạn đã đăng ký các khóa học sau:</p>
              <ul style="list-style-type: none; padding-left: 0;">
                ${enrolledCourses.map((course) => {
                  return `
                    <li style="margin-bottom: 10px; font-size: 16px; color: #333;">
                      <strong>${course.title}</strong> by <em>${course.instructor}</em>
                    </li>`;
                }).join("")}
              </ul>
              <p style="font-size: 16px; color: #333;">Tổng giá trị đơn hàng: <strong>${total_price} VNĐ</strong></p>
              <p style="font-size: 16px; color: #333;">Phương thức thanh toán: <strong>${payment_method}</strong></p>
              <p style="font-size: 16px; color: #333;">Cảm ơn bạn đã sử dụng nền tảng của chúng tôi!</p>
              <p style="text-align: center; margin-top: 20px;">
                <a href="#" style="background-color: #4CAF50; color: #fff; text-decoration: none; padding: 10px 20px; border-radius: 4px;">Xem Chi Tiết Đơn Hàng Trong Thông Tin Người Dùng</a>
              </p>
            </div>
          </div>
        `,
      };
      

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("Error sending email:", error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });

      // Step 5: Return a response to the client with order details
      res.status(200).json({
        order: orderResponse,
        status: "success",
        message: "Thanh Toán Thành công",
        success: true,
      });
    } catch (err) {
      res.status(500).json({
        message: "Server error",
        error: err.message,
        status: "error",
      });
    }
  },
};

module.exports = orderControllers;
