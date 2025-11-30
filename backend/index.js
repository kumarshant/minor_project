
// here we are incuding environment variables that has all the sensitive info like mongodb connection string , jwt secret key 
require('dotenv').config();

const express= require("express");
const path= require('path');
const app= express();
const PORT = process.env.PORT;

const cors= require('cors');

// these are the routes that we need in the application 
const userRoute= require('./router/userRoute');

const recommendRoute=require('./router/recommendRoute');

// incuding the db and connecting the db 
const connectDB= require("./config/db");
connectDB();

//using cors to  allow request from any port 

app.use(
  cors({
    origin: ['http://localhost:5173'], // array safer for future multiple origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    // credentials: true, // ✅ must match frontend's withCredentials:true
  })
);

//global middlewares for parsing the body into json objects or url type routes 
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// server.js — MUST HAVE THIS
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
// app.use("/uploads", express.static(path.join(__dirname, "/uploads"))); i am not using direct upload right now .

app.use('/api/user', userRoute);

 app.use('/api/recommend',recommendRoute);

//this is global error handler to handle the server error 
app.use((err,req,res,next)=>{
     console.log(err);
    res.status(err.status || 500) .json({msg:err.message ||'server error'});
})

// the server is active on the prot specified in the env variable .
app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}`);
})