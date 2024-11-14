const { Order, User, Course } = require("../models/index");

const orderControllers = {
  createOrder: async (req, res) => {
    try {
      // Get authenticated user's ID and course information from request body
      const user_id = req.user.id;
      const { courses, total_price, payment_method } = req.body;

      if (!courses || courses.length === 0) {
        return res.status(400).json({ message: "No courses selected" });
      }

      // Create a new order
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

      // Automatically enroll the user in the purchased course(s)
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

      // Populate user info and course details for response
      const populatedOrder = await Order.findById(savedOrder._id)
        .populate({
          path: "user_id",
          select: "username email",
        })
        .populate({
          path: "courses.course_id",
          select:
            "title description price instructor duration rating students_enrolled videoId",
        })
        .exec();

      const orderResponse = {
        ...populatedOrder.toObject(),
        enrolledCourses: enrolledCourses,
      };

      res.status(200).json({
        order: orderResponse,
        status: "success",
        message: "Create order and enroll successfully!",
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
