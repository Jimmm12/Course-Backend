const express = require("express");
const cors = require("cors");
const connectDB = require("./config/connectDB");
const dotenv = require("dotenv");
const app = express();
const authRouter = require("./routes/auth");
const courseRouter = require("./routes/course");
const userRouter = require("./routes/user");
const orderRouter = require("./routes/order");
const cookieParser = require("cookie-parser");
dotenv.config();
connectDB();

app.use(
  cors({
    origin: "*", 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Include OPTIONS for preflight requests
    allowedHeaders: ["Content-Type", "Authorization", "token"], // Add any additional headers if needed
  })
);

app.use(express.json());
app.use(cookieParser());
//ROUTER
app.use("/v1/auth", authRouter);
app.use("/v1/course", courseRouter);
app.use("/v1/user", userRouter);
app.use("/v1/order", orderRouter);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
