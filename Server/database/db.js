const mongoose = require("mongoose");
require('dotenv').config();

mongoose.connect(
    process.env.MONGO_URL
).then(()=>{
    console.log("Connected to the database")
}).catch((err)=>{
    console.log(err)
    console.log("Connection failed")
});

module.exports = mongoose;