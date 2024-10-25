const express = require('express');
const cors = require('cors');
const connectDB = require('./config/connectDB');
const dotenv = require('dotenv');
const app = express();
const authRouter = require('./routes/auth');
const courseRouter = require('./routes/course');
const userRouter = require('./routes/user');
const orderRouter = require('./routes/order');
dotenv.config();
connectDB();



app.use(cors());
app.use(express.json());


//ROUTER 
app.use('https://course-backend-1akf.onrender.com/v1/auth',authRouter);
app.use('https://course-backend-1akf.onrender.com/v1/course',courseRouter);
app.use('https://course-backend-1akf.onrender.com/v1/user',userRouter);
app.use('https://course-backend-1akf.onrender.com/v1/order',orderRouter);

app.listen(8000, ()=> {
  console.log("Server is running....")
})