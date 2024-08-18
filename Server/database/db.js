const mongoose = require("mongoose")

mongoose.connect(
    "mongodb+srv://jatavankit486:ZPbcEr53g5Q9Hw7W@cluster0.4f709.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
).then(()=>{
    console.log("Connected to the database")
}).catch((err)=>{
    console.log(err)
    console.log("Connection failed")
});

module.exports = mongoose;