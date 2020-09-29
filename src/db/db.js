const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const connectDB = async (dbUrl) => {
    try {
        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('connect to db');
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectDB;