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
app.use('/v1/auth',authRouter);
app.use('/v1/course',courseRouter);
app.use('/v1/user',userRouter);
app.use('/v1/order',orderRouter);

app.listen(8000, ()=> {
  console.log("Server is running....")
})