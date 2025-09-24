
// here we are incuding environment variables that has all the sensitive info like mongodb connection string , jwt secret key 
require('dotenv').config();

const express= require("express");
const app= express();
const PORT = process.env.PORT;

// these are the routes that we need in the application 
const userRoute= require('./router/userRoute');
const imageRoute=require('./router/imageRoute');
const recommendRoute=require('./router/recommendRoute');

// incuding the db and connecting the db 
const connectDB= require("./config/db");
connectDB();
//using cors to  allow request from any port 
const cors=require('cors');
app.use(cors({ origin: "*" }));

//global middlewares for parsing the body into json objects or url type routes 
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Authentication & User
app.use('/api/user', userRoute);
//image and analysis
// app.use('/api/image',imageRoute)    
//recommendation 
// app.use('/api/reccomend',recommendRoute);

//this is global error handler to handle the server error 
app.use((err,req,res,next)=>{
     console.log(err);
    res.status(err.status || 500) .json({msg:err.message ||'server error'});
})

// the server is active on the prot specified in the env variable .
app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}`);
})