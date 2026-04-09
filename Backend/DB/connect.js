const mongoose = require("mongoose");

/**
 * connectDB – establishes a connection to MongoDB Atlas.
 * The MONGO_URI is read from the .env file via dotenv.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options suppress deprecation warnings in newer Mongoose versions
      serverSelectionTimeoutMS: 5000, // timeout after 5s if Atlas is unreachable
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure if DB connection fails
  }
};

module.exports = connectDB;
