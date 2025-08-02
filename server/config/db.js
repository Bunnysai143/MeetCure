const mongoose = require("mongoose");

const connectDB = async () => {
    try
    {
        await mongoose.connect("mongodb://localhost:27017/meetcure",);
        console.log("CONNECTION OF MONGODB SUCCESSFUL !!");
    }
    catch(err)
    {
        console.error(err.message);
        process.exit(1);
    }
};

module.exports = connectDB