const mongoose = require("mongoose");

// COURSE
const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  students_enrolled: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
  },
});

// USERS
const useSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    courses_enrolled: [
      {
        course_id: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
        enrolled_at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// ORDER
const orderSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  courses: [
    {
      course_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
      price: Number,
    },
  ],
  total_price: {
    type: Number,
    required: true,
  },
  payment_status: {
    type: String,
    required: true,
  },
  order_date: {
    type: Date,
    default: Date.now, // Thiết lập giá trị mặc định cho ngày đặt hàng
  },
});

let User = mongoose.model("User", useSchema);
let Course = mongoose.model("Course", courseSchema);
let Order = mongoose.model("Order", orderSchema);

module.exports = {
  User,
  Course,
  Order,
};
