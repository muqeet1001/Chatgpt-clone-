require("dotenv").config();
const moongoose = require("mongoose");
async function connectDB() {
  try {
    await moongoose.connect(process.env.MONGO_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
}
module.exports = connectDB;
