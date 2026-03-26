const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log("ENV VALUE:", process.env.MONGODB_URI);

    await mongoose.connect("mongodb+srv://user:user1234@cluster0.zfpjwe3.mongodb.net/dfxstudio?retryWrites=true&w=majority");

    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;