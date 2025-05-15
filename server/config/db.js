const mongoose = require('mongoose');
const DB_URL = 'mongodb+srv://m3huzaifa1:Huzaifa123@m3huzaifa1.uwkb6rb.mongodb.net/TaskFlowPro'

const connectDB = async () => {
    try {
        await mongoose.connect(DB_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        }
        );

        console.log("Connected to DB");
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB