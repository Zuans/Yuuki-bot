const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();


const connectDB = async (password, dbName) => {
    try {
        await mongoose.connect(`mongodb+srv://juan123:${password}@cluster0.npqqt.mongodb.net/${dbName}?retryWrites=true&w=majority`, {
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