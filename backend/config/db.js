const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {});
        console.log('MongoDB connected'); // ✅ Fixed here
    } catch (err) {
        console.error("Error connecting to MongoDB ", err);
        process.exit(1);
    }
};

// ✅ Fixed spelling of "module"
module.exports = connectDB;
