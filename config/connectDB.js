// CONCECT DATABASE 
const mongoose = require('mongoose');

const connectDB = async () => {
  try{
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.MONGODB_URL);
    console.log("Connected Data....")
  }catch(err){
    console.log(err)
  }
}

module.exports = connectDB