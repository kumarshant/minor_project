const mongoose= require('mongoose');
const connectDB= async()=>{
    try{
        mongoose.connect(process.env.MONGO_URL);
        console.log("database connected");
    }
    catch(err){
        console.log(err.message);
        process.exit(1);
    }
}

module.exports= connectDB;
