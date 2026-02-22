

const mongoose = require("mongoose");

const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI || process.env.MONGO_URL;
    if (!mongoUri) {
        console.error(
            'Missing MongoDB connection string. Set `MONGO_URI` (or `MONGO_URL`) in environment variables.'
        );
        // exit with non-zero so Render shows failure clearly
        process.exit(1);
    }

    try {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Database Connected Successfully");
    } catch (err) {
        console.error("Error while connecting to database:", err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
