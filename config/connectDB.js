// CONCECT DATABASE
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);

    // Check if the MONGODB_URL environment variable is defined
    if (!process.env.MONGODB_URL) {
      throw new Error("MONGODB_URL environment variable is not defined");
    }

    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to Database...");
  } catch (err) {
    console.error("Database connection failed:", err);
    process.exit(1); // Exit the process if the database connection fails
  }
};

module.exports = connectDB;
