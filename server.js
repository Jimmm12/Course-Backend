const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const dotenv = require("dotenv");
const app = express();
const authRouter = require("./routes/auth");
const courseRouter = require("./routes/course");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/order");
const cookieParser = require('cookie-parser');
dotenv.config();
connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}))
app.use(express.json());
app.use(cookieParser());
//ROUTER
app.use("/v1/auth", authRouter);
app.use("/v1/course", courseRouter);
app.use("/v1/user", userRouter);
app.use("/v1/order", orderRouter);

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running....");
});
