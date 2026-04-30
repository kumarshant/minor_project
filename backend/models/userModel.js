const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true,
    unique:true
  },

  password:{
    type:String,
    required:true
  },

  userType:{
    type:String,
    enum:["STANDARD","PREMIUM"],
    default:"STANDARD"
  },

  credits:{
    type:Number,
    default:500
  },

  referralCode:{
    type:String,
    unique:false,
    sparse:true
  },

  premiumExpiresAt:{
    type:Date,
    default:null
  },
  
  styleProfile:{
    type:String,
    default:""
  }

}, {timestamps:true})

const User = mongoose.model("User", userSchema);
module.exports= User;