const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not configured. Copy .env.example to .env and start MongoDB.");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(`MongoDB connection failed: ${err.message}`);
    console.error("Start MongoDB locally with: docker compose up -d mongodb");
    process.exit(1);
  }
};

module.exports = connectDB;