const User= require('../models/userModel');
const generateToken = require('../utils/generatetoken');
const bcrypt = require("bcrypt");


const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // Check if user exist
    console.log({email})
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (user) {
    res.status(200).json({
  user: {
    _id: user._id,
    username: user.username,
    email: user.email,
  },
  token: generateToken(user._id),
});

    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid email or password" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

     if(user.userType==="PREMIUM" &&  user.premiumExpiresAt < new Date()){
         user.userType= "STANDARD",
         user.referredBy=null,
         user.premiumExpiresAt=null

         await user.save();
     }

   res.json({
  user: {
    _id: user._id,
    username: user.username,
    email: user.email,
    userType:user.userType
  },
  token: generateToken(user._id),
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        images: user.images || [],
        userType:user.userType,
        credits:user.credits,
        reneual_date:user.premiumExpiresAt
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const editProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      user.username = req.body.username || user.username;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (user) {
      await user.remove();
      res.json({ message: "User removed" });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPremium = async(req, res)=>{
   const userId = req.user.id;
   const referralCode= req.body.referralCode || "";
   try{
     const user = await User.findById(userId);
     if(!user) return res.status(404).json({message: "user not found"});

     if(user.userType==="PREMIUM" &&  user.premiumExpiresAt > new Date()){
      return res.status(400).json({
    message: "You already have an active premium plan"
  });
       }
     if(user.credits < 500){
      return res.status(404).json({message: "insufficient token "});
     }
     user.credits -= 500;
    if (referralCode) {
      user.referredBy = referralCode;
    }
    user.userType = "PREMIUM";
    user.premiumExpiresAt = new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    );

    // Save changes
    await user.save();

    return res.status(200).json({
      message: "Congratulations! You can enjoy premium features now.",
      credits_left: user.credits,
      premiumExpiresAt: user.premiumExpiresAt
    });
   }
   catch (err){
    res.status(500).json({message: err.message})
   }
}

module.exports={
    signup,
    login,
    getProfile,
    editProfile,
    deleteProfile,
    getPremium
}